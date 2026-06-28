using Archon.Core.Ai;
using Archon.Core.Audit;
using Archon.Core.Connectors;
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
// Connecteurs declares (plugins/MCP/HTTP) : persistes, secrets par reference de variable d'env.
builder.Services.AddSingleton<IConnectorStore, SqliteConnectorStore>();

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
    grants.Grant(ihm.Manifest.Id, "ihm.theme");
    grants.Grant(ihm.Manifest.Id, "ihm.remove");

    await registry.RefreshHealthAsync();
}

// --- API HTTP/JSON : le contrat coeur .NET <-> surface React (Archon, servie a /) ---
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

// L'etat vivant : registre (online/offline), journal, approbations en attente, mode, theme.
api.MapGet("/state", (PluginRegistry reg, IAuditLog audit, ApprovalQueue approvals, ApprovalSettings settings, ISettingsStore store) =>
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
        theme = store.Get("ihm.theme") ?? "",
    }));

// --- Plugins : manifeste, capacites et permissions (deny par defaut, reglables) ---
api.MapGet("/plugins", (PluginRegistry reg, GrantStore grants) =>
    Results.Ok(reg.All().Select(r => new
    {
        id = r.Plugin.Manifest.Id,
        name = r.Plugin.Manifest.Name,
        version = r.Plugin.Manifest.Version,
        author = r.Plugin.Manifest.Author,
        online = r.Health == PluginHealth.Online,
        capabilities = r.Plugin.Capabilities.Select(c => new
        {
            id = c.Id,
            title = c.Title,
            impact = c.Impact.ToString(),
            granted = grants.IsAllowed(r.Plugin.Manifest.Id, c.Id),
        }),
    })));

api.MapPost("/plugins/{pluginId}/cap/{capId}/toggle", (string pluginId, string capId, ToggleRequest body, GrantStore grants, IAuditLog audit) =>
{
    if (body.Granted) grants.Grant(pluginId, capId);
    else grants.Revoke(pluginId, capId);
    audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "user", body.Granted ? "grant" : "revoke", $"{pluginId}/{capId}", body.Granted));
    return Results.Ok(new { granted = grants.IsAllowed(pluginId, capId) });
});

// --- Connecteurs : declares, persistes (secret par reference de variable d'env) ---
api.MapGet("/connectors", (IConnectorStore store) =>
    Results.Ok(store.List().Select(c => new
    {
        id = c.Id,
        kind = c.Kind,
        name = c.Name,
        endpoint = c.Endpoint,
        enabled = c.Enabled,
        secretEnvVar = c.SecretEnvVar,
        // On ne revele jamais le secret : on indique seulement si la variable d'env est presente.
        secretPresent = !string.IsNullOrEmpty(c.SecretEnvVar) && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable(c.SecretEnvVar)),
    })));

api.MapPost("/connectors", (ConnectorRequest req, IConnectorStore store) =>
{
    var kind = (req.Kind ?? "").Trim().ToLowerInvariant();
    if (kind is not ("mcp" or "http")) return Results.BadRequest(new { error = "kind doit etre 'mcp' ou 'http'." });
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest(new { error = "nom requis." });
    if (string.IsNullOrWhiteSpace(req.Endpoint)) return Results.BadRequest(new { error = "endpoint requis." });

    store.Add(new Connector
    {
        Id = Guid.NewGuid().ToString("n"),
        Kind = kind,
        Name = req.Name!.Trim(),
        Endpoint = req.Endpoint!.Trim(),
        Enabled = true,
        SecretEnvVar = (req.SecretEnvVar ?? "").Trim(),
        ConfigJson = req.ConfigJson ?? "",
        CreatedAt = DateTimeOffset.UtcNow,
    });
    return Results.Ok();
});

api.MapPost("/connectors/{id}/toggle", (string id, ToggleRequest body, IConnectorStore store) =>
{
    store.SetEnabled(id, body.Granted);
    return Results.Ok(new { enabled = body.Granted });
});

api.MapDelete("/connectors/{id}", (string id, IConnectorStore store) =>
{
    store.Remove(id);
    return Results.Ok();
});

// Test de joignabilite (v1) : on verifie que l'hote repond. Le tool-calling MCP viendra ensuite.
api.MapPost("/connectors/{id}/test", async (string id, IConnectorStore store, IHttpClientFactory httpFactory, CancellationToken ct) =>
{
    var c = store.Get(id);
    if (c is null) return Results.NotFound();
    if (string.IsNullOrWhiteSpace(c.Endpoint)) return Results.Ok(new { ok = false, detail = "Aucun endpoint." });

    try
    {
        var http = httpFactory.CreateClient();
        http.Timeout = TimeSpan.FromSeconds(6);
        using var resp = await http.GetAsync(c.Endpoint, ct);
        return Results.Ok(new { ok = true, detail = $"HTTP {(int)resp.StatusCode}" });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { ok = false, detail = ex.Message });
    }
});

// --- Reglages : preferences IHM, theme, skill Archon (modele en lecture seule) ---
api.MapGet("/settings", (ISettingsStore store, ILanguageModel model) =>
    Results.Ok(new
    {
        preferences = store.Get("ihm.preferences") ?? "",
        theme = store.Get("ihm.theme") ?? "",
        skill = store.Get(ArchonSkill.SettingsKey) is { Length: > 0 } s ? s : ArchonSkill.Default,
        model = new { name = model.Name, configured = model.IsConfigured },
    }));

api.MapPost("/settings", (SettingsRequest req, ISettingsStore store) =>
{
    if (req.Preferences is not null) store.Set("ihm.preferences", req.Preferences);
    if (req.Theme is not null) store.Set("ihm.theme", req.Theme);
    if (req.Skill is not null) store.Set(ArchonSkill.SettingsKey, req.Skill);
    return Results.Ok();
});

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

// Archon EST le produit : la surface React est servie a la racine "/". Les assets
// (/archon/assets/...) passent par UseStaticFiles ; la navigation interne se fait par hash,
// donc le serveur n'a qu'a servir l'index a "/". Blazor ne garde que /console et /api.
var spaIndex = Path.Combine(
    app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot"),
    "archon", "index.html");
IResult ServeArchon() => File.Exists(spaIndex)
    ? Results.File(spaIndex, "text/html")
    : Results.Text("La surface Archon n'est pas encore construite (src/Archon.Surface : npm run build).", "text/plain");
app.MapGet("/", ServeArchon);

app.Run();

// --- Contrats des requetes de l'API et utilitaires ---
record ChatRequest(string? Input);
record ApprovalDecision(string Id, bool Approved);
record ModeRequest(string? Mode);
record ToggleRequest(bool Granted);
record ConnectorRequest(string? Kind, string? Name, string? Endpoint, string? SecretEnvVar, string? ConfigJson);
record SettingsRequest(string? Preferences, string? Theme, string? Skill);

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
