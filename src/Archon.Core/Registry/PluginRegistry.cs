using Archon.Core.Plugins;

namespace Archon.Core.Registry;

public enum PluginHealth { Unknown, Online, Offline }

public sealed class RegisteredPlugin
{
    public required IPlugin Plugin { get; init; }
    public PluginHealth Health { get; set; } = PluginHealth.Unknown;
    public DateTimeOffset? LastSeen { get; set; }
}

// Le registre vivant : ce qui est branche, et son statut online/offline.
public sealed class PluginRegistry
{
    private readonly Dictionary<string, RegisteredPlugin> _plugins = new();
    private readonly Lock _lock = new();

    public void Register(IPlugin plugin)
    {
        lock (_lock)
        {
            _plugins[plugin.Manifest.Id] = new RegisteredPlugin { Plugin = plugin };
        }
    }

    public IReadOnlyList<RegisteredPlugin> All()
    {
        lock (_lock)
        {
            return _plugins.Values.ToList();
        }
    }

    public RegisteredPlugin? Get(string id)
    {
        lock (_lock)
        {
            return _plugins.TryGetValue(id, out var p) ? p : null;
        }
    }

    public IPlugin? FindByCapability(string capabilityId)
    {
        lock (_lock)
        {
            return _plugins.Values
                .Select(static r => r.Plugin)
                .FirstOrDefault(p => p.Capabilities.Any(c => c.Id == capabilityId));
        }
    }

    // Interroge la sante de chaque plugin et met a jour online/offline.
    public async Task RefreshHealthAsync(CancellationToken ct = default)
    {
        foreach (var r in All())
        {
            bool ok;
            try { ok = await r.Plugin.HealthCheckAsync(ct); }
            catch { ok = false; }

            r.Health = ok ? PluginHealth.Online : PluginHealth.Offline;
            if (ok) r.LastSeen = DateTimeOffset.UtcNow;
        }
    }
}
