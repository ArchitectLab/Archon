using System.Globalization;
using System.Text.Json;
using Archon.Core.Plugins;

namespace Archon.Plugins.Meteo;

// Plugin de premiere partie (le fil rouge de la Phase 1). Connecteur HTTP vers open-meteo
// (geocodage + meteo actuelle), sans cle. In-process derriere IPlugin : le meme contrat
// servira aux futurs plugins WASM/process.
public sealed class MeteoPlugin : IPlugin
{
    private HttpClient _http = default!;

    public PluginManifest Manifest { get; } = new()
    {
        Id = "plugin-meteo",
        Name = "Meteo",
        Version = "0.1.0",
        Author = "Architect Lab",
        Source = "first-party",
        Runtime = PluginRuntime.InProcess,
        RequestedPermissions =
        [
            new Permission("http", "geocoding-api.open-meteo.com"),
            new Permission("http", "api.open-meteo.com"),
        ],
    };

    public IReadOnlyList<Capability> Capabilities { get; } =
    [
        new Capability
        {
            Id = "meteo.get",
            Title = "Meteo d'une ville",
            Description = "Donne la meteo actuelle d'une ville (via open-meteo, sans cle).",
            Impact = ImpactLevel.Read,
            Parameters = [new CapabilityParam("city", "Le nom de la ville")],
        },
    ];

    public Task InitializeAsync(PluginContext context, CancellationToken ct = default)
    {
        _http = context.Http;
        return Task.CompletedTask;
    }

    public async Task<bool> HealthCheckAsync(CancellationToken ct = default)
    {
        try
        {
            using var resp = await _http.GetAsync(
                "https://api.open-meteo.com/v1/forecast?latitude=44.2&longitude=0.62&current=temperature_2m",
                ct);
            return resp.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<CapabilityResult> InvokeAsync(
        string capabilityId,
        IReadOnlyDictionary<string, string> args,
        CancellationToken ct = default)
    {
        if (capabilityId != "meteo.get")
        {
            return CapabilityResult.Fail($"Capacite inconnue : {capabilityId}");
        }

        var city = args.TryGetValue("city", out var c) && c.Length > 0 ? c : "Agen";

        // 1. Geocodage : nom de ville -> coordonnees.
        var geoUrl =
            $"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(city)}&count=1&language=fr&format=json";
        using var geoResp = await _http.GetAsync(geoUrl, ct);
        if (!geoResp.IsSuccessStatusCode)
        {
            return CapabilityResult.Fail("Service de geocodage indisponible.");
        }

        using var geoDoc = JsonDocument.Parse(await geoResp.Content.ReadAsStringAsync(ct));
        if (!geoDoc.RootElement.TryGetProperty("results", out var results) || results.GetArrayLength() == 0)
        {
            return CapabilityResult.Fail($"Ville introuvable : {city}");
        }

        var first = results[0];
        var lat = first.GetProperty("latitude").GetDouble();
        var lon = first.GetProperty("longitude").GetDouble();
        var name = first.GetProperty("name").GetString() ?? city;
        var country = first.TryGetProperty("country", out var co) ? co.GetString() ?? "" : "";

        // 2. Meteo actuelle.
        var inv = CultureInfo.InvariantCulture;
        var url =
            $"https://api.open-meteo.com/v1/forecast?latitude={lat.ToString(inv)}&longitude={lon.ToString(inv)}&current=temperature_2m,weather_code,wind_speed_10m";
        using var resp = await _http.GetAsync(url, ct);
        if (!resp.IsSuccessStatusCode)
        {
            return CapabilityResult.Fail("Service meteo indisponible.");
        }

        using var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync(ct));
        var current = doc.RootElement.GetProperty("current");
        var temp = current.GetProperty("temperature_2m").GetDouble();
        var wind = current.GetProperty("wind_speed_10m").GetDouble();
        var code = current.GetProperty("weather_code").GetInt32();

        var ui = new UiBlock
        {
            Kind = "weather-card",
            Data = new Dictionary<string, string>
            {
                ["city"] = name,
                ["country"] = country,
                ["temperature"] = temp.ToString("0.#", inv),
                ["wind"] = wind.ToString("0.#", inv),
                ["condition"] = WeatherText(code),
            },
        };

        return CapabilityResult.Ok(ui);
    }

    // Codes WMO -> texte FR (simplifie).
    private static string WeatherText(int code) => code switch
    {
        0 => "Ciel degage",
        1 or 2 or 3 => "Partiellement nuageux",
        45 or 48 => "Brouillard",
        51 or 53 or 55 => "Bruine",
        61 or 63 or 65 => "Pluie",
        71 or 73 or 75 => "Neige",
        80 or 81 or 82 => "Averses",
        95 or 96 or 99 => "Orage",
        _ => "Conditions variables",
    };
}
