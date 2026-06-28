namespace Archon.Core.Ihm;

// Un widget pose sur l'IHM : le canvas vivant que l'IA pilote. Il persiste (il reste apres
// rechargement), et se rafraichit seul. Deux familles :
//  - "capability" : lie a une capacite (ex. meteo.get), re-executee toutes les RefreshSec
//    secondes -> schema UI neutre (sur, jamais de HTML brut dans le DOM de confiance).
//  - "html" : un fragment HTML/CSS compose par l'IA, rendu dans un iframe bac a sable
//    (aucun script, aucune meme-origine) -> l'originalite, sans compromettre la securite.
public sealed record Widget
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Kind { get; init; }          // "capability" | "html"
    public int RefreshSec { get; init; }                 // 0 = pas de rafraichissement auto
    public string CapabilityId { get; init; } = "";      // kind=capability
    public string ArgsJson { get; init; } = "";          // kind=capability : args JSON de la capacite
    public string Html { get; init; } = "";              // kind=html : fragment HTML/CSS
    public DateTimeOffset CreatedAt { get; init; }
}

// Le canvas persistant des widgets. Local-first : l'implementation par defaut ecrit dans
// SQLite chez l'utilisateur (voir docs/data-model.md). Le coeur ne connait que ce contrat.
public interface IIhmStore
{
    IReadOnlyList<Widget> List();
    Widget? Get(string id);
    void Add(Widget widget);
    void Remove(string id);
    void Clear();
}
