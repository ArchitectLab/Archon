using Archon.Core.Data;

namespace Archon.Data;

// Magasin cle-valeur durable (SQLite).
public sealed class SqliteSettingsStore : ISettingsStore
{
    private readonly ArchonDatabase _db;

    public SqliteSettingsStore(ArchonDatabase db) => _db = db;

    public string? Get(string key)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "SELECT value FROM settings WHERE key = $k";
        cmd.Parameters.AddWithValue("$k", key);
        return cmd.ExecuteScalar() as string;
    }

    public void Set(string key, string value)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "INSERT INTO settings (key, value) VALUES ($k, $v) ON CONFLICT(key) DO UPDATE SET value = $v";
        cmd.Parameters.AddWithValue("$k", key);
        cmd.Parameters.AddWithValue("$v", value);
        cmd.ExecuteNonQuery();
    }
}
