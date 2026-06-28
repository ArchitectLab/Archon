namespace Archon.Core.Plugins;

// Le contrat central : tout ce qui n'est pas le coeur est un plugin (voir docs/plugin-model.md).
// Au stade squelette, le plugin tourne in-process ; le meme contrat servira aux plugins
// WASM/WASI et process (gRPC) plus tard.
public interface IPlugin
{
    PluginManifest Manifest { get; }

    IReadOnlyList<Capability> Capabilities { get; }

    Task InitializeAsync(PluginContext context, CancellationToken ct = default);

    Task<CapabilityResult> InvokeAsync(
        string capabilityId,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default);

    Task<bool> HealthCheckAsync(CancellationToken ct = default);
}

// Le manifeste declaratif d'un plugin.
public sealed record PluginManifest
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Version { get; init; }
    public string Author { get; init; } = "";
    public string Source { get; init; } = "";
    public PluginRuntime Runtime { get; init; } = PluginRuntime.InProcess;

    // Les permissions demandees (deny par defaut cote hote tant qu'elles ne sont pas accordees).
    public IReadOnlyList<Permission> RequestedPermissions { get; init; } = [];
}

public enum PluginRuntime { InProcess, Wasm, Process }

// Une permission demandee, ex. ("http", "api.open-meteo.com").
public sealed record Permission(string Kind, string Scope);

// Ce que l'hote fournit au plugin a l'initialisation (minimal au stade squelette).
public sealed class PluginContext
{
    public required HttpClient Http { get; init; }
}
