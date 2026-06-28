using System.Text;
using System.Text.Json;
using Archon.Core.Ai;

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
        if (input.StartsWith("meteo", StringComparison.OrdinalIgnoreCase))
        {
            var city = input.Length > 5 ? input[5..].Trim() : "";
            if (city.Length == 0) city = "Agen";
            var intent = new Intent("meteo.get", new Dictionary<string, string> { ["city"] = city });
            return Task.FromResult<Intent?>(intent);
        }

        return Task.FromResult<Intent?>(null);
    }
}

// Resolver a IA : un modele agnostique mappe la phrase vers (capacite, args). Si le modele
// n'est pas configure ou echoue, repli automatique sur le resolver de secours.
public sealed class LlmIntentResolver : IIntentResolver
{
    private readonly ILanguageModel _model;
    private readonly IIntentResolver _fallback;

    public LlmIntentResolver(ILanguageModel model, IIntentResolver fallback)
    {
        _model = model;
        _fallback = fallback;
    }

    public async Task<Intent?> ResolveAsync(string input, IReadOnlyList<CapabilitySpec> available, CancellationToken ct = default)
    {
        if (!_model.IsConfigured)
        {
            return await _fallback.ResolveAsync(input, available, ct);
        }

        try
        {
            var messages = new List<ModelMessage>
            {
                new("system", BuildSystemPrompt(available)),
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

    private static string BuildSystemPrompt(IReadOnlyList<CapabilitySpec> available)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Tu es l'orchestrateur d'Archon. A partir de la demande de l'utilisateur,");
        sb.AppendLine("choisis UNE capacite parmi la liste et extrais ses parametres.");
        sb.AppendLine("Reponds UNIQUEMENT en JSON : {\"capability\": \"id\", \"args\": {\"nom\": \"valeur\"}}.");
        sb.AppendLine("Si aucune capacite ne convient, reponds {\"capability\": null}.");
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
