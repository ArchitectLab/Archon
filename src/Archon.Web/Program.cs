using Archon.Core.Ai;
using Archon.Core.Audit;
using Archon.Core.Data;
using Archon.Core.Ihm;
using Archon.Core.Orchestration;
using Archon.Core.Plugins;
using Archon.Core.Registry;
using Archon.Core.Security;
using Archon.Core.Ui;
using Archon.Data;
using Archon.Plugins.Ihm;
using Archon.Plugins.Maison;
using Archon.Plugins.Meteo;
using Archon.Web.Components;

var builder = WebApplication.CreateBuilder(args);

// Blazor (render interactif Server).
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddHttpClient();

// --- Coeur Archon : un seul registre / journal pour l'app (singletons) ---
builder.Services.AddSingleton<PluginRegistry>();
builder.Services.AddSingleton<GrantStore>();
builder.Services.AddSingleton<IPermissionPolicy>(sp => sp.GetRequiredService<GrantStore>());
// --- Persistance locale (SQLite) : journal d'audit et reglages survivent au redemarrage ---
var dbPath = Path.Combine(builder.Environment.ContentRootPath, "archon.db");
builder.Services.AddSingleton(new ArchonDatabase(dbPath));
builder.Services.AddSingleton<ISettingsStore, SqliteSettingsStore>();
builder.Services.AddSingleton<IAuditLog, SqliteAuditLog>();
// Canvas IHM persistant (les widgets poses par l'IA survivent au redemarrage).
builder.Services.AddSingleton<IIhmStore, SqliteIhmStore>();

// --- Approbation humaine, configurable (option). Defaut : demander pour les actions. ---
builder.Services.AddSingleton<ApprovalSettings>(sp => new ApprovalSettings(sp.GetRequiredService<ISettingsStore>()));
builder.Services.AddSingleton<ApprovalQueue>();
builder.Services.AddSingleton<IApprovalGate>(sp => new InteractiveApprovalGate(
    sp.GetRequiredService<ApprovalQueue>(),
    sp.GetRequiredService<ApprovalSettings>(),
    sp.GetRequiredService<IAuditLog>()));

// --- Cerveau IA (agnostique local/cloud). Config par variables d'environnement :
//     ARCHON_MODEL_BASEURL, ARCHON_MODEL_NAME, ARCHON_MODEL_APIKEY (la cle jamais dans le code).
//     Sans config : NullLanguageModel, et l'orchestrateur retombe sur le resolver mots-cles. ---
var modelOptions = new ModelOptions
{
    BaseUrl = builder.Configuration["Model:BaseUrl"] ?? Environment.GetEnvironmentVariable("ARCHON_MODEL_BASEURL"),
    Model = builder.Configuration["Model:Name"] ?? Environment.GetEnvironmentVariable("ARCHON_MODEL_NAME"),
    ApiKey = builder.Configuration["Model:ApiKey"] ?? Environment.GetEnvironmentVariable("ARCHON_MODEL_APIKEY"),
};
builder.Services.AddSingleton(modelOptions);

builder.Services.AddSingleton<ILanguageModel>(sp =>
{
    var opts = sp.GetRequiredService<ModelOptions>();
    if (string.IsNullOrWhiteSpace(opts.BaseUrl) || string.IsNullOrWhiteSpace(opts.Model))
    {
        return new NullLanguageModel();
    }

    var http = sp.GetRequiredService<IHttpClientFactory>().CreateClient();
    http.Timeout = TimeSpan.FromSeconds(60);
    return new OpenAiCompatibleModel(http, opts);
});

builder.Services.AddSingleton<IIntentResolver>(sp =>
    new LlmIntentResolver(
        sp.GetRequiredService<ILanguageModel>(),
        new KeywordIntentResolver(),
        sp.GetRequiredService<ISettingsStore>()));

builder.Services.AddSingleton<IOrchestrator>(sp => new Orchestrator(
    sp.GetRequiredService<PluginRegistry>(),
    sp.GetRequiredService<IIntentResolver>(),
    sp.GetRequiredService<ILanguageModel>(),
    sp.GetRequiredService<IPermissionPolicy>(),
    sp.GetRequiredService<IApprovalGate>(),
    sp.GetRequiredService<IAuditLog>(),
    sp.GetRequiredService<ISettingsStore>()));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

// --- Branche les plugins de premiere partie ---
{
    var registry = app.Services.GetRequiredService<PluginRegistry>();
    var grants = app.Services.GetRequiredService<GrantStore>();
    var httpFactory = app.Services.GetRequiredService<IHttpClientFactory>();

    // Meteo (lecture).
    var meteo = new MeteoPlugin();
    await meteo.InitializeAsync(new PluginContext { Http = httpFactory.CreateClient() });
    registry.Register(meteo);
    grants.Grant(meteo.Manifest.Id, "meteo.get");

    // Maison (action : domotique simulee).
    var maison = new MaisonPlugin();
    await maison.InitializeAsync(new PluginContext { Http = httpFactory.CreateClient() });
    registry.Register(maison);
    grants.Grant(maison.Manifest.Id, "maison.lumiere");
    grants.Grant(maison.Manifest.Id, "maison.etat");

    // IHM (l'IA pilote le canvas : poser / composer / vider / preferences).
    var ihm = new IhmPlugin(
        app.Services.GetRequiredService<IIhmStore>(),
        app.Services.GetRequiredService<ISettingsStore>());
    await ihm.InitializeAsync(new PluginContext { Http = httpFactory.CreateClient() });
    registry.Register(ihm);
    grants.Grant(ihm.Manifest.Id, "ihm.place");
    grants.Grant(ihm.Manifest.Id, "ihm.html");
    grants.Grant(ihm.Manifest.Id, "ihm.clear");
    grants.Grant(ihm.Manifest.Id, "ihm.set_preferences");

    await registry.RefreshHealthAsync();
}

// --- API HTTP/JSON : le contrat coeur .NET <-> surface React (/app) ---
// JSON camelCase (defaut web) ; endpoints de donnees, pas de formulaire -> antiforgery off.
var api = app.MapGroup("/api").DisableAntiforgery();

// Le chat : l'orchestrateur comprend, agit (avec permission/approbation), repond.
api.MapPost("/chat", async (ChatRequest req, IOrchestrator orch, CancellationToken ct) =>
{
    var r = await orch.HandleAsync(req.Input ?? "", ct);
    return Results.Ok(new { ok = r.Success, message = r.Message, ui = r.Ui });
});

// L'IHM : les widgets persistes du canvas.
api.MapGet("/ihm", (IIhmStore store) =>
    Results.Ok(store.List().Select(w => new
    {
        id = w.Id,
        title = w.Title,
        kind = w.Kind,
        refreshSec = w.RefreshSec,
        capabilityId = w.CapabilityId,
        html = w.Html,
    })));

// Rafraichir un widget "capability" : re-execute sa capacite source -> schema UI a jour.
api.MapPost("/ihm/{id}/refresh", async (string id, IIhmStore store, IOrchestrator orch, CancellationToken ct) =>
{
    var w = store.Get(id);
    if (w is null) return Results.NotFound();
    if (w.Kind != "capability") return Results.Ok(new { ok = true, message = "", ui = (UiView?)null });

    var r = await orch.InvokeCapabilityAsync(w.CapabilityId, ApiHelpers.ParseArgs(w.ArgsJson), ct);
    return Results.Ok(new { ok = r.Success, message = r.Message, ui = r.Ui });
});

api.MapDelete("/ihm/{id}", (string id, IIhmStore store) =>
{
    store.Remove(id);
    return Results.Ok();
});

// L'etat vivant : registre (online/offline), journal, approbations en attente, mode.
api.MapGet("/state", (PluginRegistry reg, IAuditLog audit, ApprovalQueue approvals, ApprovalSettings settings) =>
    Results.Ok(new
    {
        registry = reg.All().Select(r => new
        {
            name = r.Plugin.Manifest.Name,
            version = r.Plugin.Manifest.Version,
            online = r.Health == PluginHealth.Online,
        }),
        journal = audit.Recent(12).Select(e => new { action = e.Action, detail = e.Detail, allowed = e.Allowed }),
        approvals = approvals.Pending().Select(p => new { id = p.Id, title = p.Title, detail = p.Detail }),
        mode = settings.Mode.ToString(),
    }));

api.MapPost("/approval", (ApprovalDecision d, ApprovalQueue approvals) =>
{
    approvals.Resolve(d.Id, d.Approved);
    return Results.Ok();
});

api.MapPost("/mode", (ModeRequest m, ApprovalSettings settings) =>
{
    if (Enum.TryParse<ApprovalMode>(m.Mode, ignoreCase: true, out var mode))
    {
        settings.Mode = mode;
    }

    return Results.Ok(new { mode = settings.Mode.ToString() });
});

// Sert la surface React (SPA) sous /app. Les assets (/app/assets/...) passent par UseStaticFiles.
var spaIndex = Path.Combine(
    app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot"),
    "app", "index.html");
IResult ServeApp() => File.Exists(spaIndex)
    ? Results.File(spaIndex, "text/html")
    : Results.Text("La surface React n'est pas encore construite (src/Archon.Surface : npm run build).", "text/plain");
// Un seul endpoint : le template "/app" matche deja "/app" et "/app/" (enregistrer les deux
// creerait une AmbiguousMatchException, le routing normalisant le slash final).
app.MapGet("/app", ServeApp);

app.Run();

// --- Contrats des requetes de l'API et utilitaires ---
record ChatRequest(string? Input);
record ApprovalDecision(string Id, bool Approved);
record ModeRequest(string? Mode);

static class ApiHelpers
{
    // Transforme le JSON d'args d'un widget en dictionnaire chaine->chaine pour l'invocation.
    public static IReadOnlyDictionary<string, string> ParseArgs(string json)
    {
        var dict = new Dictionary<string, string>();
        if (string.IsNullOrWhiteSpace(json)) return dict;

        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(json);
            if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Object)
            {
                foreach (var p in doc.RootElement.EnumerateObject())
                {
                    dict[p.Name] = p.Value.ValueKind == System.Text.Json.JsonValueKind.String
                        ? p.Value.GetString() ?? ""
                        : p.Value.ToString();
                }
            }
        }
        catch
        {
            // JSON invalide : args vides, le widget se rafraichira avec les valeurs par defaut.
        }

        return dict;
    }
}
