using Archon.Core.Ai;
using Archon.Core.Audit;
using Archon.Core.Orchestration;
using Archon.Core.Plugins;
using Archon.Core.Registry;
using Archon.Core.Security;
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
builder.Services.AddSingleton<IAuditLog, InMemoryAuditLog>();

// --- Approbation humaine, configurable (option). Defaut : demander pour les actions. ---
builder.Services.AddSingleton<ApprovalSettings>();
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
    new LlmIntentResolver(sp.GetRequiredService<ILanguageModel>(), new KeywordIntentResolver()));

builder.Services.AddSingleton<IOrchestrator>(sp => new Orchestrator(
    sp.GetRequiredService<PluginRegistry>(),
    sp.GetRequiredService<IIntentResolver>(),
    sp.GetRequiredService<IPermissionPolicy>(),
    sp.GetRequiredService<IApprovalGate>(),
    sp.GetRequiredService<IAuditLog>()));

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

    await registry.RefreshHealthAsync();
}

app.Run();
