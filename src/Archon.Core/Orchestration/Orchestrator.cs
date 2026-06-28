using Archon.Core.Audit;
using Archon.Core.Plugins;
using Archon.Core.Registry;
using Archon.Core.Security;

namespace Archon.Core.Orchestration;

public sealed record OrchestratorResponse(bool Success, string Message, UiBlock? Ui);

public interface IOrchestrator
{
    Task<OrchestratorResponse> HandleAsync(string input, CancellationToken ct = default);
}

// L'orchestrateur du squelette : il comprend une intention, verifie la permission, demande
// l'approbation, invoque la capacite, et journalise. La COUTURE pour un vrai LLM est ici :
// il suffira de remplacer ParseIntent par un appel modele (agnostique local/cloud).
public sealed class Orchestrator : IOrchestrator
{
    private readonly PluginRegistry _registry;
    private readonly IPermissionPolicy _policy;
    private readonly IApprovalGate _approval;
    private readonly IAuditLog _audit;

    public Orchestrator(
        PluginRegistry registry,
        IPermissionPolicy policy,
        IApprovalGate approval,
        IAuditLog audit)
    {
        _registry = registry;
        _policy = policy;
        _approval = approval;
        _audit = audit;
    }

    public async Task<OrchestratorResponse> HandleAsync(string input, CancellationToken ct = default)
    {
        var (capabilityId, args) = ParseIntent(input);
        if (capabilityId is null)
        {
            return new OrchestratorResponse(false, "Je n'ai pas compris. Essaie : meteo <ville>.", null);
        }

        var plugin = _registry.FindByCapability(capabilityId);
        if (plugin is null)
        {
            return new OrchestratorResponse(false, $"Aucun plugin ne fournit la capacite '{capabilityId}'.", null);
        }

        var capability = plugin.Capabilities.First(c => c.Id == capabilityId);
        var target = $"{plugin.Manifest.Id}/{capabilityId}";

        // 1. Permission (deny par defaut).
        if (!_policy.IsAllowed(plugin.Manifest.Id, capabilityId))
        {
            _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke.denied", target, false));
            return new OrchestratorResponse(false, $"Permission refusee pour '{capabilityId}'.", null);
        }

        // 2. Approbation humaine (auto pour les lectures au stade squelette).
        if (!await _approval.RequestApprovalAsync(plugin.Manifest.Id, capability, args, ct))
        {
            _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke.unapproved", target, false));
            return new OrchestratorResponse(false, "Action en attente d'approbation humaine.", null);
        }

        // 3. Invocation.
        var result = await plugin.InvokeAsync(capabilityId, args, ct);
        _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke", target, result.Success));

        return result.Success
            ? new OrchestratorResponse(true, "Voici le resultat.", result.Ui)
            : new OrchestratorResponse(false, result.Error ?? "Echec de la capacite.", null);
    }

    // Squelette : "meteo <ville>" -> meteo.get { city }. A remplacer par un LLM.
    private static (string? CapabilityId, IReadOnlyDictionary<string, string> Args) ParseIntent(string input)
    {
        input = input.Trim();
        if (input.StartsWith("meteo", StringComparison.OrdinalIgnoreCase))
        {
            var city = input.Length > 5 ? input[5..].Trim() : "";
            if (city.Length == 0) city = "Agen";
            return ("meteo.get", new Dictionary<string, string> { ["city"] = city });
        }

        return (null, new Dictionary<string, string>());
    }
}
