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

// L'orchestrateur : comprend l'intention (via un resolver, IA ou repli mots-cles), verifie
// la permission, demande l'approbation, invoque la capacite, et journalise. Comprendre le
// langage est delegue a IIntentResolver : c'est la que vit le cerveau IA.
public sealed class Orchestrator : IOrchestrator
{
    private readonly PluginRegistry _registry;
    private readonly IIntentResolver _resolver;
    private readonly IPermissionPolicy _policy;
    private readonly IApprovalGate _approval;
    private readonly IAuditLog _audit;

    public Orchestrator(
        PluginRegistry registry,
        IIntentResolver resolver,
        IPermissionPolicy policy,
        IApprovalGate approval,
        IAuditLog audit)
    {
        _registry = registry;
        _resolver = resolver;
        _policy = policy;
        _approval = approval;
        _audit = audit;
    }

    public async Task<OrchestratorResponse> HandleAsync(string input, CancellationToken ct = default)
    {
        // 1. Comprendre l'intention : quelle capacite, quels arguments.
        var specs = _registry.All()
            .SelectMany(r => r.Plugin.Capabilities.Select(c => new CapabilitySpec(
                c.Id, c.Title, c.Description, c.Parameters.Select(p => p.Name).ToList())))
            .ToList();

        var intent = await _resolver.ResolveAsync(input, specs, ct);
        if (intent is null)
        {
            return new OrchestratorResponse(false, "Je n'ai pas compris. Essaie : meteo <ville>.", null);
        }

        var plugin = _registry.FindByCapability(intent.CapabilityId);
        if (plugin is null)
        {
            return new OrchestratorResponse(false, $"Aucun plugin ne fournit la capacite '{intent.CapabilityId}'.", null);
        }

        var capability = plugin.Capabilities.First(c => c.Id == intent.CapabilityId);
        var target = $"{plugin.Manifest.Id}/{intent.CapabilityId}";

        // 2. Permission (deny par defaut).
        if (!_policy.IsAllowed(plugin.Manifest.Id, intent.CapabilityId))
        {
            _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke.denied", target, false));
            return new OrchestratorResponse(false, $"Permission refusee pour '{intent.CapabilityId}'.", null);
        }

        // 3. Approbation humaine (auto pour les lectures au stade squelette).
        if (!await _approval.RequestApprovalAsync(plugin.Manifest.Id, capability, intent.Args, ct))
        {
            _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke.unapproved", target, false));
            return new OrchestratorResponse(false, "Action en attente d'approbation humaine.", null);
        }

        // 4. Invocation.
        var result = await plugin.InvokeAsync(intent.CapabilityId, intent.Args, ct);
        _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke", target, result.Success));

        return result.Success
            ? new OrchestratorResponse(true, "Voici le resultat.", result.Ui)
            : new OrchestratorResponse(false, result.Error ?? "Echec de la capacite.", null);
    }
}
