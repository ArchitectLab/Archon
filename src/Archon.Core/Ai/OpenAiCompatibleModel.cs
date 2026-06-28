using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Archon.Core.Ai;

// Adaptateur agnostique : parle l'API "chat completions" compatible OpenAI, que servent
// Ollama (local), vLLM, LM Studio, et la plupart des fournisseurs cloud. On change de
// modele (local <-> cloud) en changeant la config, pas le code.
public sealed class OpenAiCompatibleModel : ILanguageModel
{
    private readonly HttpClient _http;
    private readonly ModelOptions _opts;

    public OpenAiCompatibleModel(HttpClient http, ModelOptions opts)
    {
        _http = http;
        _opts = opts;
    }

    public string Name => _opts.Model ?? "aucun";

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_opts.BaseUrl) && !string.IsNullOrWhiteSpace(_opts.Model);

    public async Task<string> CompleteAsync(IReadOnlyList<ModelMessage> messages, CancellationToken ct = default)
    {
        var url = _opts.BaseUrl!.TrimEnd('/') + "/chat/completions";
        using var req = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(new
            {
                model = _opts.Model,
                messages = messages.Select(m => new { role = m.Role, content = m.Content }).ToArray(),
                temperature = 0,
                stream = false,
            }),
        };

        if (!string.IsNullOrWhiteSpace(_opts.ApiKey))
        {
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _opts.ApiKey);
        }

        using var resp = await _http.SendAsync(req, ct);
        resp.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync(ct));
        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "";
    }
}
