namespace Archon.Core.Audit;

public sealed record AuditEntry(
    DateTimeOffset At,
    string Actor,
    string Action,
    string Detail,
    bool Allowed);

// Journal append-only. Au stade squelette : en memoire. Plus tard : immuable, hash chaine,
// persiste (voir docs/data-model.md et security-baseline.md).
public interface IAuditLog
{
    void Append(AuditEntry entry);
    IReadOnlyList<AuditEntry> Recent(int count = 50);
}

public sealed class InMemoryAuditLog : IAuditLog
{
    private readonly List<AuditEntry> _entries = new();
    private readonly Lock _lock = new();

    public void Append(AuditEntry entry)
    {
        lock (_lock) _entries.Add(entry);
    }

    public IReadOnlyList<AuditEntry> Recent(int count = 50)
    {
        lock (_lock)
        {
            return _entries.AsEnumerable().Reverse().Take(count).ToList();
        }
    }
}
