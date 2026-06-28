namespace Archon.Core.Ui;

// Schema UI neutre : une liste de noeuds que la surface rend en composants surs.
// L'IA et les plugins composent des UI sans emettre de HTML brut (pas de XSS). Le renderer
// (ici Blazor ; demain TS/React) choisit comment rendre chaque noeud selon son Type.
public sealed record UiView(IReadOnlyList<UiNode> Nodes)
{
    public static UiView Of(params UiNode[] nodes) => new(nodes);
}

// Un noeud d'UI. Types connus (v1) : heading, text, stat, badge, keyvalue, list, rule,
// note, sparkline.
public sealed record UiNode
{
    public required string Type { get; init; }
    public string Text { get; init; } = "";
    public string Value { get; init; } = "";   // stat / badge
    public string Unit { get; init; } = "";     // stat
    public string Tone { get; init; } = "";      // neutral | success | info | warn | accent
    public IReadOnlyList<UiKeyValue> Items { get; init; } = [];  // keyvalue / list
    public IReadOnlyList<double> Points { get; init; } = [];     // sparkline
}

public sealed record UiKeyValue(string Key, string Value, string Tone = "");
