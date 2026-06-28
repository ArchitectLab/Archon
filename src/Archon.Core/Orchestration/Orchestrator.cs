using Archon.Core.Ai;
using Archon.Core.Audit;
using Archon.Core.Plugins;
using Archon.Core.Registry;
using Archon.Core.Security;
using Archon.Core.Ui;

namespace Archon.Core.Orchestration;

public sealed record OrchestratorResponse(bool Success, string Message, UiView? Ui);

public interface IOrchestrator
{
    Task<OrchestratorResponse> HandleAsync(string input, CancellationToken ct = default);
}

// L'orchestrateur : comprend l'intention (resolver IA ou repli mots-cles), verifie la
// permission, demande l'approbation, invoque la capacite, journalise. Si rien ne correspond
// a une capacite mais qu'un modele est branche, il compose une reponse libre (surface
// generative) au lieu de dire "je n'ai pas compris".
public sealed class Orchestrator : IOrchestrator
{
    private readonly PluginRegistry _registry;
    private readonly IIntentResolver _resolver;
    private readonly ILanguageModel _model;
    private readonly IPermissionPolicy _policy;
    private readonly IApprovalGate _approval;
    private readonly IAuditLog _audit;

    public Orchestrator(
        PluginRegistry registry,
        IIntentResolver resolver,
        ILanguageModel model,
        IPermissionPolicy policy,
        IApprovalGate approval,
        IAuditLog audit)
    {
        _registry = registry;
        _resolver = resolver;
        _model = model;
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
            return await AnswerFreeformAsync(input, ct);
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

        // 3. Approbation humaine (selon le mode choisi par l'utilisateur).
        if (!await _approval.RequestApprovalAsync(plugin.Manifest.Id, capability, intent.Args, ct))
        {
            _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke.unapproved", target, false));
            return new OrchestratorResponse(false, "Action refusee ou non approuvee a temps.", null);
        }

        // 4. Invocation.
        var result = await plugin.InvokeAsync(intent.CapabilityId, intent.Args, ct);
        _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "invoke", target, result.Success));

        return result.Success
            ? new OrchestratorResponse(true, "", result.Ui)
            : new OrchestratorResponse(false, result.Error ?? "Echec de la capacite.", null);
    }

    // Pas de capacite : si un modele est branche, on compose une reponse libre (texte) rendue
    // par la surface generative. Sinon, message d'aide.
    private async Task<OrchestratorResponse> AnswerFreeformAsync(string input, CancellationToken ct)
    {
        if (_model.IsConfigured)
        {
            try
            {
                var answer = await _model.CompleteAsync(
                [
                    new ModelMessage("system", "Tu es l'assistant d'Archon. Reponds brievement et utilement en francais, sans inventer."),
                    new ModelMessage("user", input),
                ], ct);
                _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "orchestrator", "answer", "modele", true));
                var view = UiView.Of(new UiNode { Type = "text", Text = answer.Trim() });
                return new OrchestratorResponse(true, "", view);
            }
            catch
            {
                // repli silencieux vers le message d'aide
            }
        }

        return new OrchestratorResponse(false,
            "Je n'ai pas compris. Essaie : meteo <ville>, ou allume la lumiere du salon.", null);
    }
}
