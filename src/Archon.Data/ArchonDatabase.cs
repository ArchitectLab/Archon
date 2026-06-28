using Microsoft.Data.Sqlite;

namespace Archon.Data;

// Acces SQLite local-first (fichier archon.db). SQL a la main, pas d'ORM ni de migrations
// au stade actuel : CREATE TABLE IF NOT EXISTS. Plus tard : migrations versionnees, Postgres
// pour le cloud (voir docs/data-model.md).
public sealed class ArchonDatabase
{
    private readonly string _connectionString;

    public ArchonDatabase(string path)
    {
        _connectionString = new SqliteConnectionStringBuilder { DataSource = path }.ToString();
        EnsureSchema();
    }

    public SqliteConnection Open()
    {
        var connection = new SqliteConnection(_connectionString);
        connection.Open();
        return connection;
    }

    private void EnsureSchema()
    {
        using var connection = Open();
        using var cmd = connection.CreateCommand();
        cmd.CommandText =
            """
            CREATE TABLE IF NOT EXISTS settings (
                key   TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS audit (
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                at      TEXT NOT NULL,
                actor   TEXT NOT NULL,
                action  TEXT NOT NULL,
                detail  TEXT NOT NULL,
                allowed INTEGER NOT NULL
            );
            """;
        cmd.ExecuteNonQuery();
    }
}
