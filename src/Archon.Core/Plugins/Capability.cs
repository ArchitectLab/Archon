using Archon.Core.Ui;

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

// Le resultat d'une invocation. Ui est un schema UI neutre (voir Archon.Core.Ui) : la
// surface le rend en composants surs, jamais du HTML brut.
public sealed record CapabilityResult
{
    public bool Success { get; init; }
    public string? Error { get; init; }
    public UiView? Ui { get; init; }

    public static CapabilityResult Ok(UiView ui) => new() { Success = true, Ui = ui };
    public static CapabilityResult Fail(string error) => new() { Success = false, Error = error };
}
