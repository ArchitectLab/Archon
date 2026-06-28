namespace Archon.Core.Ai;

// Un message dans une conversation (role : system | user | assistant).
public sealed record ModelMessage(string Role, string Content);

// Abstraction agnostique d'un modele de langage. Le coeur ne connait ni le fournisseur
// ni l'hebergement : seulement ce contrat. IsConfigured = false => l'orchestrateur retombe
// sur le resolver de secours (mots-cles), donc l'app tourne toujours.
public interface ILanguageModel
{
    string Name { get; }
    bool IsConfigured { get; }
    Task<string> CompleteAsync(IReadOnlyList<ModelMessage> messages, CancellationToken ct = default);
}

// Options de connexion a un modele. Renseignees par configuration / variables
// d'environnement (la cle ne vit JAMAIS dans le code).
public sealed class ModelOptions
{
    public string? BaseUrl { get; set; }   // ex http://localhost:11434/v1 (Ollama) ou cloud
    public string? Model { get; set; }      // ex llama3.1 ou gpt-4o-mini
    public string? ApiKey { get; set; }     // optionnel (vide en local)
}

// Aucun modele configure : l'orchestrateur utilise le repli a mots-cles.
public sealed class NullLanguageModel : ILanguageModel
{
    public string Name => "aucun";
    public bool IsConfigured => false;

    public Task<string> CompleteAsync(IReadOnlyList<ModelMessage> messages, CancellationToken ct = default)
        => throw new InvalidOperationException("Aucun modele configure.");
}
