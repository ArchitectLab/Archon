using Archon.Core.Audit;
using Archon.Core.Orchestration;
using Archon.Core.Plugins;
using Archon.Core.Registry;
using Archon.Core.Security;
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
builder.Services.AddSingleton<IApprovalGate, AutoApprovalGate>();
builder.Services.AddSingleton<IAuditLog, InMemoryAuditLog>();
builder.Services.AddSingleton<IOrchestrator>(sp => new Orchestrator(
    sp.GetRequiredService<PluginRegistry>(),
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

// --- Branche le plugin Meteo (premiere partie) ---
{
    var registry = app.Services.GetRequiredService<PluginRegistry>();
    var grants = app.Services.GetRequiredService<GrantStore>();
    var httpFactory = app.Services.GetRequiredService<IHttpClientFactory>();

    var meteo = new MeteoPlugin();
    await meteo.InitializeAsync(new PluginContext { Http = httpFactory.CreateClient() });
    registry.Register(meteo);

    // Deny par defaut : l'utilisateur accorde. Au stade squelette, on accorde la lecture meteo.
    grants.Grant(meteo.Manifest.Id, "meteo.get");

    await registry.RefreshHealthAsync();
}

app.Run();
