namespace Archon.Core.Data;

// Petit magasin cle-valeur pour les reglages persistants. Local-first : l'implementation
// par defaut (cote app) ecrit dans un fichier SQLite chez l'utilisateur.
public interface ISettingsStore
{
    string? Get(string key);
    void Set(string key, string value);
}
