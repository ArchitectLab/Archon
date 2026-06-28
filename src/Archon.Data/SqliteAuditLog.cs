using System.Globalization;
using Archon.Core.Audit;

namespace Archon.Data;

// Journal d'audit durable (SQLite). Append-only ; survit au redemarrage.
public sealed class SqliteAuditLog : IAuditLog
{
    private readonly ArchonDatabase _db;

    public SqliteAuditLog(ArchonDatabase db) => _db = db;

    public void Append(AuditEntry entry)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            "INSERT INTO audit (at, actor, action, detail, allowed) VALUES ($at, $actor, $action, $detail, $allowed)";
        cmd.Parameters.AddWithValue("$at", entry.At.ToString("o", CultureInfo.InvariantCulture));
        cmd.Parameters.AddWithValue("$actor", entry.Actor);
        cmd.Parameters.AddWithValue("$action", entry.Action);
        cmd.Parameters.AddWithValue("$detail", entry.Detail);
        cmd.Parameters.AddWithValue("$allowed", entry.Allowed ? 1 : 0);
        cmd.ExecuteNonQuery();
    }

    public IReadOnlyList<AuditEntry> Recent(int count = 50)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "SELECT at, actor, action, detail, allowed FROM audit ORDER BY id DESC LIMIT $n";
        cmd.Parameters.AddWithValue("$n", count);

        var list = new List<AuditEntry>();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            list.Add(new AuditEntry(
                DateTimeOffset.Parse(reader.GetString(0), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetString(3),
                reader.GetInt32(4) == 1));
        }

        return list;
    }
}
