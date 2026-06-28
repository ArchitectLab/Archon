namespace Archon.Core.Connectors;

// Un connecteur declare par l'utilisateur : un serveur MCP ou un connecteur HTTP. A ce stade
// c'est declaratif et persiste (le branchement reel d'un serveur MCP vient a l'increment
// suivant). Securite : aucun secret en clair. Si le connecteur a besoin d'un jeton, on ne
// stocke que le NOM d'une variable d'environnement (SecretEnvVar) ; la valeur reste dans
// l'environnement (meme principe que la cle du modele IA).
public sealed record Connector
{
    public required string Id { get; init; }
    public required string Kind { get; init; }       // "mcp" | "http"
    public required string Name { get; init; }
    public string Endpoint { get; init; } = "";       // URL du serveur MCP ou base HTTP
    public bool Enabled { get; init; } = true;
    public string SecretEnvVar { get; init; } = "";    // NOM d'une variable d'env (jamais la valeur)
    public string ConfigJson { get; init; } = "";      // options libres (entetes, etc.), JSON
    public DateTimeOffset CreatedAt { get; init; }
}

// Le magasin des connecteurs declares. Local-first : impl SQLite par defaut.
public interface IConnectorStore
{
    IReadOnlyList<Connector> List();
    Connector? Get(string id);
    void Add(Connector connector);
    void SetEnabled(string id, bool enabled);
    void Remove(string id);
}
