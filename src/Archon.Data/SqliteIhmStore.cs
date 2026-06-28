using System.Globalization;
using Archon.Core.Ihm;
using Microsoft.Data.Sqlite;

namespace Archon.Data;

// Canvas IHM persistant (SQLite). Les widgets poses par l'IA survivent au redemarrage.
public sealed class SqliteIhmStore : IIhmStore
{
    private readonly ArchonDatabase _db;

    public SqliteIhmStore(ArchonDatabase db) => _db = db;

    public IReadOnlyList<Widget> List()
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            "SELECT id, title, kind, refresh_sec, capability_id, args_json, html, created_at FROM widgets ORDER BY created_at";
        using var reader = cmd.ExecuteReader();

        var list = new List<Widget>();
        while (reader.Read())
        {
            list.Add(ReadRow(reader));
        }

        return list;
    }

    public Widget? Get(string id)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            "SELECT id, title, kind, refresh_sec, capability_id, args_json, html, created_at FROM widgets WHERE id = $id";
        cmd.Parameters.AddWithValue("$id", id);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadRow(reader) : null;
    }

    public void Add(Widget w)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText =
            """
            INSERT INTO widgets (id, title, kind, refresh_sec, capability_id, args_json, html, created_at)
            VALUES ($id, $title, $kind, $refresh, $cap, $args, $html, $at)
            ON CONFLICT(id) DO UPDATE SET
                title = $title, kind = $kind, refresh_sec = $refresh,
                capability_id = $cap, args_json = $args, html = $html;
            """;
        cmd.Parameters.AddWithValue("$id", w.Id);
        cmd.Parameters.AddWithValue("$title", w.Title);
        cmd.Parameters.AddWithValue("$kind", w.Kind);
        cmd.Parameters.AddWithValue("$refresh", w.RefreshSec);
        cmd.Parameters.AddWithValue("$cap", w.CapabilityId);
        cmd.Parameters.AddWithValue("$args", w.ArgsJson);
        cmd.Parameters.AddWithValue("$html", w.Html);
        cmd.Parameters.AddWithValue("$at", w.CreatedAt.ToString("o", CultureInfo.InvariantCulture));
        cmd.ExecuteNonQuery();
    }

    public void Remove(string id)
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "DELETE FROM widgets WHERE id = $id";
        cmd.Parameters.AddWithValue("$id", id);
        cmd.ExecuteNonQuery();
    }

    public void Clear()
    {
        using var c = _db.Open();
        using var cmd = c.CreateCommand();
        cmd.CommandText = "DELETE FROM widgets";
        cmd.ExecuteNonQuery();
    }

    private static Widget ReadRow(SqliteDataReader r) => new()
    {
        Id = r.GetString(0),
        Title = r.GetString(1),
        Kind = r.GetString(2),
        RefreshSec = r.GetInt32(3),
        CapabilityId = r.GetString(4),
        ArgsJson = r.GetString(5),
        Html = r.GetString(6),
        CreatedAt = DateTimeOffset.Parse(r.GetString(7), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind),
    };
}
