using Archon.Core.Plugins;
using Archon.Core.Ui;

namespace Archon.Plugins.Maison;

// 2e plugin de premiere partie : domotique SIMULEE (aucun materiel reel). Il prouve le
// modele de plugin sur une ACTION (impact Write) et declenche l'approbation humaine.
public sealed class MaisonPlugin : IPlugin
{
    private readonly Lock _lock = new();
    private readonly Dictionary<string, bool> _lumieres = new(StringComparer.OrdinalIgnoreCase)
    {
        ["salon"] = false,
        ["cuisine"] = false,
        ["chambre"] = false,
    };

    public PluginManifest Manifest { get; } = new()
    {
        Id = "plugin-maison",
        Name = "Maison",
        Version = "0.1.0",
        Author = "Architect Lab",
        Source = "first-party",
        Runtime = PluginRuntime.InProcess,
        RequestedPermissions = [],
    };

    public IReadOnlyList<Capability> Capabilities { get; } =
    [
        new Capability
        {
            Id = "maison.lumiere",
            Title = "Allumer ou eteindre une lumiere",
            Description = "Change l'etat d'une lumiere (pieces : salon, cuisine, chambre).",
            Impact = ImpactLevel.Write,
            Parameters =
            [
                new CapabilityParam("piece", "La piece : salon, cuisine ou chambre"),
                new CapabilityParam("etat", "allumee ou eteinte"),
            ],
        },
        new Capability
        {
            Id = "maison.etat",
            Title = "Etat des lumieres",
            Description = "Donne l'etat actuel des lumieres.",
            Impact = ImpactLevel.Read,
            Parameters = [],
        },
    ];

    public Task InitializeAsync(PluginContext context, CancellationToken ct = default) => Task.CompletedTask;

    public Task<bool> HealthCheckAsync(CancellationToken ct = default) => Task.FromResult(true);

    public Task<CapabilityResult> InvokeAsync(
        string capabilityId,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default)
    {
        switch (capabilityId)
        {
            case "maison.lumiere":
            {
                var piece = args.TryGetValue("piece", out var p) ? p.Trim().ToLowerInvariant() : "";
                if (piece.Length == 0 || !_lumieres.ContainsKey(piece))
                {
                    return Task.FromResult(CapabilityResult.Fail(
                        $"Piece inconnue : '{piece}'. Pieces possibles : salon, cuisine, chambre."));
                }

                var on = ParseOn(args.TryGetValue("etat", out var e) ? e : "");
                lock (_lock) _lumieres[piece] = on;

                var ui = UiView.Of(
                    new UiNode { Type = "heading", Text = Capitalize(piece) },
                    new UiNode { Type = "badge", Text = on ? "allumee" : "eteinte", Tone = on ? "success" : "neutral" },
                    new UiNode { Type = "note", Text = $"Lumiere {(on ? "allumee" : "eteinte")} : {piece}." });

                return Task.FromResult(CapabilityResult.Ok(ui));
            }

            case "maison.etat":
            {
                List<UiKeyValue> items;
                lock (_lock)
                {
                    items = _lumieres
                        .Select(kv => new UiKeyValue(Capitalize(kv.Key), kv.Value ? "allumee" : "eteinte", kv.Value ? "success" : "neutral"))
                        .ToList();
                }

                var ui = UiView.Of(
                    new UiNode { Type = "heading", Text = "Lumieres" },
                    new UiNode { Type = "keyvalue", Items = items });

                return Task.FromResult(CapabilityResult.Ok(ui));
            }

            default:
                return Task.FromResult(CapabilityResult.Fail($"Capacite inconnue : {capabilityId}"));
        }
    }

    private static bool ParseOn(string etat)
    {
        etat = etat.Trim().ToLowerInvariant();
        return etat is "allumee" or "allume" or "allumer" or "on" or "true" or "1";
    }

    private static string Capitalize(string s) => s.Length == 0 ? s : char.ToUpperInvariant(s[0]) + s[1..];
}
