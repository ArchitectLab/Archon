using Archon.Core.Plugins;

namespace Archon.Core.Security;

// Verifie qu'une capacite est autorisee. Deny par defaut.
public interface IPermissionPolicy
{
    bool IsAllowed(string pluginId, string capabilityId);
}

// Stockage des permissions accordees par l'utilisateur. Tant que rien n'est accorde,
// tout est refuse. (Plus tard : moteur OPA, persistance, UI d'octroi.)
public sealed class GrantStore : IPermissionPolicy
{
    private readonly HashSet<(string PluginId, string CapabilityId)> _grants = new();
    private readonly Lock _lock = new();

    public void Grant(string pluginId, string capabilityId)
    {
        lock (_lock) _grants.Add((pluginId, capabilityId));
    }

    public bool IsAllowed(string pluginId, string capabilityId)
    {
        lock (_lock) return _grants.Contains((pluginId, capabilityId));
    }
}

// Humain dans la boucle. Au stade squelette : auto-approuve les lectures, refuserait le
// reste (en attendant une vraie UI d'approbation).
public interface IApprovalGate
{
    Task<bool> RequestApprovalAsync(
        string pluginId,
        Capability capability,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default);
}

public sealed class AutoApprovalGate : IApprovalGate
{
    public Task<bool> RequestApprovalAsync(
        string pluginId,
        Capability capability,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default)
        => Task.FromResult(capability.Impact == ImpactLevel.Read);
}
