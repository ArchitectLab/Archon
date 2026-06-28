using System.Globalization;
using Archon.Core.Connectors;
using Microsoft.Data.Sqlite;

namespace Archon.Data;

// Connecteurs declares, persistes (SQLite). Aucun secret en clair : seul le nom d'une
// variable d'environnement est stocke (secret_env_var).
public sealed class SqliteConnectorStore : IConnectorStore
{
    private readonly ArchonDatabase _db;

    public SqliteConnectorStore(ArchonDatabase db) => _db = db;

    public IReadOnlyList<Connector> List()
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            "SELECT id, kind, name, endpoint, enabled, secret_env_var, config_json, created_at FROM connectors ORDER BY created_at";
        using var reader = cmd.ExecuteReader();

        var list = new List<Connector>();
        while (reader.Read())
        {
            list.Add(ReadRow(reader));
        }

        return list;
    }

    public Connector? Get(string id)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            "SELECT id, kind, name, endpoint, enabled, secret_env_var, config_json, created_at FROM connectors WHERE id = $id";
        cmd.Parameters.AddWithValue("$id", id);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadRow(reader) : null;
    }

    public void Add(Connector x)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            """
            INSERT INTO connectors (id, kind, name, endpoint, enabled, secret_env_var, config_json, created_at)
            VALUES ($id, $kind, $name, $endpoint, $enabled, $secret, $config, $at)
            ON CONFLICT(id) DO UPDATE SET
                kind = $kind, name = $name, endpoint = $endpoint, enabled = $enabled,
                secret_env_var = $secret, config_json = $config;
            """;
        cmd.Parameters.AddWithValue("$id", x.Id);
        cmd.Parameters.AddWithValue("$kind", x.Kind);
        cmd.Parameters.AddWithValue("$name", x.Name);
        cmd.Parameters.AddWithValue("$endpoint", x.Endpoint);
        cmd.Parameters.AddWithValue("$enabled", x.Enabled ? 1 : 0);
        cmd.Parameters.AddWithValue("$secret", x.SecretEnvVar);
        cmd.Parameters.AddWithValue("$config", x.ConfigJson);
        cmd.Parameters.AddWithValue("$at", x.CreatedAt.ToString("o", CultureInfo.InvariantCulture));
        cmd.ExecuteNonQuery();
    }

    public void SetEnabled(string id, bool enabled)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "UPDATE connectors SET enabled = $enabled WHERE id = $id";
        cmd.Parameters.AddWithValue("$enabled", enabled ? 1 : 0);
        cmd.Parameters.AddWithValue("$id", id);
        cmd.ExecuteNonQuery();
    }

    public void Remove(string id)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "DELETE FROM connectors WHERE id = $id";
        cmd.Parameters.AddWithValue("$id", id);
        cmd.ExecuteNonQuery();
    }

    private static Connector ReadRow(SqliteDataReader r) => new()
    {
        Id = r.GetString(0),
        Kind = r.GetString(1),
        Name = r.GetString(2),
        Endpoint = r.GetString(3),
        Enabled = r.GetInt32(4) != 0,
        SecretEnvVar = r.GetString(5),
        ConfigJson = r.GetString(6),
        CreatedAt = DateTimeOffset.Parse(r.GetString(7), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
    };
}
