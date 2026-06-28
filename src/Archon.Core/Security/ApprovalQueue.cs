using Archon.Core.Audit;
using Archon.Core.Data;
using Archon.Core.Plugins;

namespace Archon.Core.Security;

public enum ApprovalMode { Ask, AutoRun }

// Reglage d'approbation, modifiable par l'utilisateur : l'approbation est une OPTION.
// Defaut : Ask (demander pour les actions). Alternatif : AutoRun (laisser l'IA agir).
// Granulaire plus tard (par capacite / par workflow ; persiste via data-model).
public sealed class ApprovalSettings
{
    private readonly Lock _lock = new();
    private readonly ISettingsStore? _store;
    private ApprovalMode _mode = ApprovalMode.Ask;

    public ApprovalSettings(ISettingsStore? store = null)
    {
        _store = store;
        if (store?.Get("approval.mode") is { } saved && Enum.TryParse<ApprovalMode>(saved, out var mode))
        {
            _mode = mode;
        }
    }

    public ApprovalMode Mode
    {
        get { lock (_lock) return _mode; }
        set
        {
            lock (_lock) _mode = value;
            _store?.Set("approval.mode", value.ToString());
        }
    }
}

// Une demande d'approbation en attente.
public sealed class PendingApproval
{
    public required string Id { get; init; }
    public required string PluginId { get; init; }
    public required string Title { get; init; }
    public required string Detail { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    internal TaskCompletionSource<bool> Tcs { get; init; } = default!;
}

// File des approbations en attente. L'UI s'abonne a Changed pour afficher / retirer les cartes.
public sealed class ApprovalQueue
{
    private readonly Lock _lock = new();
    private readonly List<PendingApproval> _pending = new();

    public event Action? Changed;

    public IReadOnlyList<PendingApproval> Pending()
    {
        lock (_lock) return _pending.ToList();
    }

    // Cree une demande et attend la reponse humaine, ou refuse a l'expiration du delai.
    public async Task<bool> EnqueueAsync(string pluginId, string title, string detail, TimeSpan timeout, CancellationToken ct = default)
    {
        var tcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
        var item = new PendingApproval
        {
            Id = Guid.NewGuid().ToString("n"),
            PluginId = pluginId,
            Title = title,
            Detail = detail,
            CreatedAt = DateTimeOffset.UtcNow,
            Tcs = tcs,
        };

        lock (_lock) _pending.Add(item);
        Changed?.Invoke();

        var completed = await Task.WhenAny(tcs.Task, Task.Delay(timeout, ct));
        var approved = completed == tcs.Task && tcs.Task.Result;
        tcs.TrySetResult(approved);

        Remove(item.Id);
        return approved;
    }

    public void Resolve(string id, bool approved)
    {
        PendingApproval? item;
        lock (_lock) item = _pending.FirstOrDefault(p => p.Id == id);
        item?.Tcs.TrySetResult(approved);
    }

    private void Remove(string id)
    {
        bool removed;
        lock (_lock) removed = _pending.RemoveAll(p => p.Id == id) > 0;
        if (removed) Changed?.Invoke();
    }
}

// La porte d'approbation : Read passe direct ; une action passe selon le mode choisi par
// l'utilisateur (AutoRun : direct, trace "auto" ; Ask : demande humaine). Conforme a
// security-baseline.md (humain dans la boucle, refus par expiration).
public sealed class InteractiveApprovalGate : IApprovalGate
{
    private static readonly TimeSpan Timeout = TimeSpan.FromSeconds(60);

    private readonly ApprovalQueue _queue;
    private readonly ApprovalSettings _settings;
    private readonly IAuditLog _audit;

    public InteractiveApprovalGate(ApprovalQueue queue, ApprovalSettings settings, IAuditLog audit)
    {
        _queue = queue;
        _settings = settings;
        _audit = audit;
    }

    public async Task<bool> RequestApprovalAsync(
        string pluginId,
        Capability capability,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default)
    {
        if (capability.Impact == ImpactLevel.Read)
        {
            return true;
        }

        var target = $"{pluginId}/{capability.Id}";

        if (_settings.Mode == ApprovalMode.AutoRun)
        {
            _audit.Append(new AuditEntry(DateTimeOffset.UtcNow, "user", "approval.auto", target, true));
            return true;
        }

        var detail = $"{capability.Title} ({string.Join(", ", args.Select(a => $"{a.Key}={a.Value}"))})";
        var approved = await _queue.EnqueueAsync(pluginId, capability.Title, detail, Timeout, ct);
        _audit.Append(new AuditEntry(
            DateTimeOffset.UtcNow, "user", approved ? "approval.granted" : "approval.denied", target, approved));
        return approved;
    }
}
