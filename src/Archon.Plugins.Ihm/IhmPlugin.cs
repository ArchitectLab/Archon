using System.Text.RegularExpressions;
using Archon.Core.Data;
using Archon.Core.Ihm;
using Archon.Core.Plugins;
using Archon.Core.Ui;

namespace Archon.Plugins.Ihm;

// Plugin de premiere partie : il donne a l'IA la main sur l'IHM (le canvas vivant). L'IA
// appelle ces capacites comme n'importe quel outil ("mets la meteo d'Agen sur l'IHM").
//
// Choix de securite : poser / retirer un element sur l'IHM ne touche QUE la surface
// d'affichage d'Archon (jamais le monde reel). Ce sont donc des actions de niveau Read :
// non consequentes, elles ne declenchent pas d'approbation, mais la permission reste
// explicite (deny par defaut, accordee dans Program.cs). Les actions reelles (domotique)
// gardent, elles, l'approbation humaine.
public sealed class IhmPlugin : IPlugin
{
    private static readonly Regex ScriptTag =
        new("<script\\b[^>]*>.*?</script>", RegexOptions.IgnoreCase | RegexOptions.Singleline);

    private readonly IIhmStore _store;
    private readonly ISettingsStore _settings;

    public IhmPlugin(IIhmStore store, ISettingsStore settings)
    {
        _store = store;
        _settings = settings;
    }

    public PluginManifest Manifest { get; } = new()
    {
        Id = "plugin-ihm",
        Name = "IHM",
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
            Id = "ihm.place",
            Title = "Poser un widget sur l'IHM",
            Description =
                "Pose sur l'IHM (le canvas) un widget durable lie a une capacite, rafraichi tout seul. " +
                "args : title (titre affiche), capability (id de la capacite source, ex. meteo.get), " +
                "args (JSON des parametres de cette capacite, ex. {\"city\":\"Agen\"}), " +
                "refresh_sec (intervalle de rafraichissement en secondes, ex. 120 pour 2 minutes).",
            Impact = ImpactLevel.Read,
            Parameters =
            [
                new CapabilityParam("title", "Titre du widget"),
                new CapabilityParam("capability", "Id de la capacite source (ex. meteo.get)"),
                new CapabilityParam("args", "JSON des parametres de la capacite source", Required: false),
                new CapabilityParam("refresh_sec", "Intervalle de rafraichissement en secondes", Required: false),
            ],
        },
        new Capability
        {
            Id = "ihm.html",
            Title = "Composer un visuel libre sur l'IHM",
            Description =
                "Pose sur l'IHM un fragment HTML/CSS compose librement (graph, diagramme, mise en page " +
                "originale). Rendu dans un bac a sable (aucun script execute). args : title, html.",
            Impact = ImpactLevel.Read,
            Parameters =
            [
                new CapabilityParam("title", "Titre du visuel"),
                new CapabilityParam("html", "Fragment HTML/CSS a afficher"),
            ],
        },
        new Capability
        {
            Id = "ihm.clear",
            Title = "Vider l'IHM",
            Description = "Retire tous les widgets de l'IHM.",
            Impact = ImpactLevel.Read,
            Parameters = [],
        },
        new Capability
        {
            Id = "ihm.set_preferences",
            Title = "Memoriser une preference d'affichage",
            Description =
                "Met a jour le 'skill' de preferences d'affichage de l'utilisateur (densite, couleurs, " +
                "style, dispositions favorites). args : text.",
            Impact = ImpactLevel.Read,
            Parameters = [new CapabilityParam("text", "La preference d'affichage a memoriser")],
        },
    ];

    public Task InitializeAsync(PluginContext context, CancellationToken ct = default) => Task.CompletedTask;

    public Task<bool> HealthCheckAsync(CancellationToken ct = default) => Task.FromResult(true);

    public Task<CapabilityResult> InvokeAsync(
        string capabilityId,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default)
    {
        return Task.FromResult(capabilityId switch
        {
            "ihm.place" => Place(args),
            "ihm.html" => Html(args),
            "ihm.clear" => Clear(),
            "ihm.set_preferences" => SetPreferences(args),
            _ => CapabilityResult.Fail($"Capacite inconnue : {capabilityId}"),
        });
    }

    private CapabilityResult Place(IReadOnlyDictionary<string, string> args)
    {
        var capability = Arg(args, "capability");
        if (string.IsNullOrWhiteSpace(capability))
        {
            return CapabilityResult.Fail("Capacite source manquante (parametre 'capability').");
        }

        var title = Arg(args, "title");
        if (string.IsNullOrWhiteSpace(title))
        {
            title = capability;
        }

        var innerArgs = Arg(args, "args");
        if (string.IsNullOrWhiteSpace(innerArgs))
        {
            innerArgs = "{}";
        }

        var refresh = 0;
        if (int.TryParse(Arg(args, "refresh_sec"), out var parsed))
        {
            // Garde-fou : pas en dessous de 5 s pour ne pas marteler la source.
            refresh = parsed <= 0 ? 0 : Math.Max(5, parsed);
        }

        var widget = new Widget
        {
            Id = Guid.NewGuid().ToString("n"),
            Title = title,
            Kind = "capability",
            RefreshSec = refresh,
            CapabilityId = capability,
            ArgsJson = innerArgs,
            Html = "",
            CreatedAt = DateTimeOffset.UtcNow,
        };
        _store.Add(widget);

        return CapabilityResult.Ok(UiView.Of(
            new UiNode { Type = "heading", Text = "Widget pose sur l'IHM" },
            new UiNode
            {
                Type = "keyvalue",
                Items =
                [
                    new UiKeyValue("Titre", title),
                    new UiKeyValue("Source", capability),
                    new UiKeyValue("Rafraichissement", refresh > 0 ? $"{refresh} s" : "manuel"),
                ],
            },
            new UiNode { Type = "note", Text = "Il vit a droite, sur l'IHM, et se met a jour seul." }));
    }

    private CapabilityResult Html(IReadOnlyDictionary<string, string> args)
    {
        var html = Arg(args, "html");
        if (string.IsNullOrWhiteSpace(html))
        {
            return CapabilityResult.Fail("Contenu HTML manquant (parametre 'html').");
        }

        var title = Arg(args, "title");
        if (string.IsNullOrWhiteSpace(title))
        {
            title = "Visuel";
        }

        // Defense en profondeur : on retire les <script> avant stockage. Le rendu se fait de
        // toute facon dans un iframe bac a sable (aucun script execute, aucune meme-origine).
        var safe = ScriptTag.Replace(html, "");

        var widget = new Widget
        {
            Id = Guid.NewGuid().ToString("n"),
            Title = title,
            Kind = "html",
            RefreshSec = 0,
            CapabilityId = "",
            ArgsJson = "",
            Html = safe,
            CreatedAt = DateTimeOffset.UtcNow,
        };
        _store.Add(widget);

        return CapabilityResult.Ok(UiView.Of(
            new UiNode { Type = "heading", Text = "Visuel pose sur l'IHM" },
            new UiNode { Type = "note", Text = $"\"{title}\" est affiche a droite (rendu en bac a sable)." }));
    }

    private CapabilityResult Clear()
    {
        _store.Clear();
        return CapabilityResult.Ok(UiView.Of(
            new UiNode { Type = "heading", Text = "IHM videe" },
            new UiNode { Type = "note", Text = "Tous les widgets ont ete retires." }));
    }

    private CapabilityResult SetPreferences(IReadOnlyDictionary<string, string> args)
    {
        var text = Arg(args, "text");
        if (string.IsNullOrWhiteSpace(text))
        {
            return CapabilityResult.Fail("Preference vide (parametre 'text').");
        }

        var existing = _settings.Get("ihm.preferences");
        var updated = string.IsNullOrWhiteSpace(existing) ? text.Trim() : $"{existing}\n{text.Trim()}";
        _settings.Set("ihm.preferences", updated);

        return CapabilityResult.Ok(UiView.Of(
            new UiNode { Type = "heading", Text = "Preference memorisee" },
            new UiNode { Type = "note", Text = text.Trim() }));
    }

    private static string Arg(IReadOnlyDictionary<string, string> args, string key)
        => args.TryGetValue(key, out var v) ? v : "";
}
