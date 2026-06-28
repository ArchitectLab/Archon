namespace Archon.Core.Plugins;

// Une capacite exposee par un plugin (un outil appelable par l'orchestrateur).
public sealed record Capability
{
    public required string Id { get; init; }      // ex. "meteo.get"
    public required string Title { get; init; }
    public string Description { get; init; } = "";

    // Sert aux garde-fous : les lectures peuvent etre auto-approuvees, le reste passe
    // par une approbation humaine (voir IApprovalGate).
    public ImpactLevel Impact { get; init; } = ImpactLevel.Read;

    public IReadOnlyList<CapabilityParam> Parameters { get; init; } = [];
}

public sealed record CapabilityParam(string Name, string Description, bool Required = true);

public enum ImpactLevel { Read, Write, Consequential }

// Le resultat d'une invocation. Ui est la graine du "schema UI neutre" : l'orchestrateur
// ne renvoie pas du HTML brut, mais une description que la surface rend en composants surs.
public sealed record CapabilityResult
{
    public bool Success { get; init; }
    public string? Error { get; init; }
    public UiBlock? Ui { get; init; }

    public static CapabilityResult Ok(UiBlock ui) => new() { Success = true, Ui = ui };
    public static CapabilityResult Fail(string error) => new() { Success = false, Error = error };
}

// Bloc d'UI neutre (kind + donnees). La surface choisit comment le rendre selon Kind.
public sealed record UiBlock
{
    public required string Kind { get; init; }
    public required IReadOnlyDictionary<string, string> Data { get; init; }
}
