using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Archon.Core.Ai;
using Archon.Core.Data;

namespace Archon.Core.Orchestration;

// Une intention resolue : quelle capacite, quels arguments.
public sealed record Intent(string CapabilityId, IReadOnlyDictionary<string, string> Args);

// La description d'une capacite disponible, donnee au resolver.
public sealed record CapabilitySpec(
    string Id,
    string Title,
    string Description,
    IReadOnlyList<string> Parameters);

// Transforme une demande en langage libre en une intention (ou null si rien ne convient).
public interface IIntentResolver
{
    Task<Intent?> ResolveAsync(string input, IReadOnlyList<CapabilitySpec> available, CancellationToken ct = default);
}

// Repli sans IA : reconnait les commandes simples. Toujours disponible, tourne sans modele.
public sealed class KeywordIntentResolver : IIntentResolver
{
    public Task<Intent?> ResolveAsync(string input, IReadOnlyList<CapabilitySpec> available, CancellationToken ct = default)
    {
        input = input.Trim();
        var norm = Deburr(input).ToLowerInvariant();

        // IHM : poser la meteo sur le canvas (sans IA aussi). C'est l'exemple meteo-2min :
        // "mets sur l'ihm la meteo d'Agen rafraichie toutes les 2 minutes".
        if (norm.Contains("ihm") || norm.Contains("canvas"))
        {
            if (norm.Contains("vide") || norm.Contains("efface") || norm.Contains("nettoie"))
            {
                return Task.FromResult<Intent?>(new Intent("ihm.clear", new Dictionary<string, string>()));
            }

            if (norm.Contains("meteo"))
            {
                var ville = ExtractCity(input);
                var refresh = ExtractRefreshSec(norm);
                var intent = new Intent("ihm.place", new Dictionary<string, string>
                {
                    ["title"] = $"Meteo {ville}",
                    ["capability"] = "meteo.get",
                    ["args"] = $"{{\"city\":\"{ville}\"}}",
                    ["refresh_sec"] = refresh.ToString(CultureInfo.InvariantCulture),
                });
                return Task.FromResult<Intent?>(intent);
            }
        }

        if (input.StartsWith("meteo", StringComparison.OrdinalIgnoreCase))
        {
            var city = input.Length > 5 ? input[5..].Trim() : "";
            if (city.Length == 0) city = "Agen";
            var intent = new Intent("meteo.get", new Dictionary<string, string> { ["city"] = city });
            return Task.FromResult<Intent?>(intent);
        }

        foreach (var (verb, etat) in new[] { ("allume", "allumee"), ("eteins", "eteinte"), ("eteint", "eteinte") })
        {
            if (input.StartsWith(verb, StringComparison.OrdinalIgnoreCase))
            {
                var rest = input[verb.Length..].Trim();
                var piece = rest.Length == 0
                    ? "salon"
                    : rest.Split(' ', StringSplitOptions.RemoveEmptyEntries).Last().Trim('?', '.', '!').ToLowerInvariant();
                var intent = new Intent("maison.lumiere", new Dictionary<string, string>
                {
                    ["piece"] = piece,
                    ["etat"] = etat,
                });
                return Task.FromResult<Intent?>(intent);
            }
        }

        return Task.FromResult<Intent?>(null);
    }

    // Extrait la ville d'une phrase ("meteo de Paris", "meteo d'Agen"). Defaut : Agen.
    private static string ExtractCity(string input)
    {
        var m = Regex.Match(
            Deburr(input),
            @"meteo\s+(?:de\s+|d'|du\s+|a\s+)?([A-Za-z][A-Za-z\-]+)",
            RegexOptions.IgnoreCase);
        if (m.Success)
        {
            var city = m.Groups[1].Value.Trim();
            string[] stop = ["rafraichie", "rafraichi", "toutes", "tous", "sur", "la", "le", "les", "des", "qui", "avec", "en", "ville"];
            if (city.Length > 1 && Array.IndexOf(stop, city.ToLowerInvariant()) < 0)
            {
                return char.ToUpperInvariant(city[0]) + city[1..].ToLowerInvariant();
            }
        }

        return "Agen";
    }

    // Extrait un intervalle de rafraichissement ("toutes les 2 minutes"). Defaut : 120 s.
    private static int ExtractRefreshSec(string norm)
    {
        var m = Regex.Match(norm, @"(\d+)\s*(minute|min|seconde|sec|heure|h|s)");
        if (m.Success && int.TryParse(m.Groups[1].Value, out var n) && n > 0)
        {
            var unit = m.Groups[2].Value;
            if (unit.StartsWith("min")) return n * 60;
            if (unit == "h" || unit.StartsWith("heure")) return n * 3600;
            return n;
        }

        return 120;
    }

    // Retire les accents (pour reconnaitre "meteo" comme "meteo") sans toucher au style ASCII.
    private static string Deburr(string s)
    {
        var formD = s.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(formD.Length);
        foreach (var c in formD)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}

// Resolver a IA : un modele agnostique mappe la phrase vers (capacite, args). Si le modele
// n'est pas configure ou echoue, repli automatique sur le resolver de secours.
public sealed class LlmIntentResolver : IIntentResolver
{
    private readonly ILanguageModel _model;
    private readonly IIntentResolver _fallback;
    private readonly ISettingsStore? _settings;

    public LlmIntentResolver(ILanguageModel model, IIntentResolver fallback, ISettingsStore? settings = null)
    {
        _model = model;
        _fallback = fallback;
        _settings = settings;
    }

    public async Task<Intent?> ResolveAsync(string input, IReadOnlyList<CapabilitySpec> available, CancellationToken ct = default)
    {
        if (!_model.IsConfigured)
        {
            return await _fallback.ResolveAsync(input, available, ct);
        }

        try
        {
            var skill = _settings?.Get(ArchonSkill.SettingsKey);
            if (string.IsNullOrWhiteSpace(skill)) skill = ArchonSkill.Default;

            var messages = new List<ModelMessage>
            {
                new("system", BuildSystemPrompt(available, _settings?.Get("ihm.preferences"), skill)),
                new("user", input),
            };
            var raw = await _model.CompleteAsync(messages, ct);
            var intent = ParsePlan(raw, available);
            return intent ?? await _fallback.ResolveAsync(input, available, ct);
        }
        catch
        {
            return await _fallback.ResolveAsync(input, available, ct);
        }
    }

    private static string BuildSystemPrompt(IReadOnlyList<CapabilitySpec> available, string? preferences, string? skill)
    {
        var sb = new StringBuilder();
        if (!string.IsNullOrWhiteSpace(skill))
        {
            sb.AppendLine(skill);
            sb.AppendLine();
        }

        sb.AppendLine("Tu es l'orchestrateur d'Archon. A partir de la demande de l'utilisateur,");
        sb.AppendLine("choisis UNE capacite parmi la liste et extrais ses parametres.");
        sb.AppendLine("Reponds UNIQUEMENT en JSON : {\"capability\": \"id\", \"args\": {\"nom\": \"valeur\"}}.");
        sb.AppendLine("Si aucune capacite ne convient, reponds {\"capability\": null}.");
        sb.AppendLine("Pour afficher durablement sur l'IHM (le canvas), utilise ihm.place (widget lie a une");
        sb.AppendLine("capacite, ex. meteo) ou ihm.html (compose un fragment HTML/CSS original et soigne).");
        if (!string.IsNullOrWhiteSpace(preferences))
        {
            sb.AppendLine($"Preferences d'affichage de l'utilisateur (a respecter sur l'IHM) : {preferences}");
        }

        sb.AppendLine("Capacites disponibles :");
        foreach (var c in available)
        {
            sb.AppendLine($"- {c.Id} : {c.Title}. {c.Description} Parametres : {string.Join(", ", c.Parameters)}");
        }

        return sb.ToString();
    }

    private static Intent? ParsePlan(string raw, IReadOnlyList<CapabilitySpec> available)
    {
        var json = ExtractJson(raw);
        if (json is null)
        {
            return null;
        }

        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (!root.TryGetProperty("capability", out var capEl) || capEl.ValueKind != JsonValueKind.String)
            {
                return null;
            }

            var cap = capEl.GetString();
            if (string.IsNullOrWhiteSpace(cap) || available.All(a => a.Id != cap))
            {
                return null;
            }

            var args = new Dictionary<string, string>();
            if (root.TryGetProperty("args", out var argsEl) && argsEl.ValueKind == JsonValueKind.Object)
            {
                foreach (var p in argsEl.EnumerateObject())
                {
                    args[p.Name] = p.Value.ToString();
                }
            }

            return new Intent(cap!, args);
        }
        catch
        {
            return null;
        }
    }

    private static string? ExtractJson(string raw)
    {
        var start = raw.IndexOf('{');
        var end = raw.LastIndexOf('}');
        return start >= 0 && end > start ? raw[start..(end + 1)] : null;
    }
}
