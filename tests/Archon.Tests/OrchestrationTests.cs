using Archon.Core.Ai;
using Archon.Core.Audit;
using Archon.Core.Orchestration;
using Archon.Core.Plugins;
using Archon.Core.Registry;
using Archon.Core.Security;
using Archon.Core.Ui;
using Archon.Plugins.Maison;
using Xunit;

namespace Archon.Tests;

public class KeywordIntentResolverTests
{
    private static readonly IReadOnlyList<CapabilitySpec> NoSpecs = new List<CapabilitySpec>();

    [Fact]
    public async Task Recognizes_meteo_command()
    {
        var intent = await new KeywordIntentResolver().ResolveAsync("meteo Paris", NoSpecs);
        Assert.NotNull(intent);
        Assert.Equal("meteo.get", intent!.CapabilityId);
        Assert.Equal("Paris", intent.Args["city"]);
    }

    [Fact]
    public async Task Recognizes_light_command()
    {
        var intent = await new KeywordIntentResolver().ResolveAsync("allume la lumiere du salon", NoSpecs);
        Assert.NotNull(intent);
        Assert.Equal("maison.lumiere", intent!.CapabilityId);
        Assert.Equal("salon", intent.Args["piece"]);
        Assert.Equal("allumee", intent.Args["etat"]);
    }

    [Fact]
    public async Task Returns_null_when_unknown()
    {
        Assert.Null(await new KeywordIntentResolver().ResolveAsync("bonjour", NoSpecs));
    }

    [Fact]
    public async Task Recognizes_ihm_meteo_placement()
    {
        var intent = await new KeywordIntentResolver().ResolveAsync(
            "mets sur l'ihm la meteo d'Agen rafraichie toutes les 2 minutes", NoSpecs);
        Assert.NotNull(intent);
        Assert.Equal("ihm.place", intent!.CapabilityId);
        Assert.Equal("meteo.get", intent.Args["capability"]);
        Assert.Equal("120", intent.Args["refresh_sec"]);
        Assert.Contains("Agen", intent.Args["title"]);
    }

    [Fact]
    public async Task Extracts_city_and_seconds_for_ihm()
    {
        var intent = await new KeywordIntentResolver().ResolveAsync(
            "affiche la meteo de Paris sur le canvas toutes les 30 secondes", NoSpecs);
        Assert.NotNull(intent);
        Assert.Equal("ihm.place", intent!.CapabilityId);
        Assert.Equal("30", intent.Args["refresh_sec"]);
        Assert.Contains("Paris", intent.Args["title"]);
    }

    [Fact]
    public async Task Recognizes_ihm_clear()
    {
        var intent = await new KeywordIntentResolver().ResolveAsync("vide l'ihm", NoSpecs);
        Assert.NotNull(intent);
        Assert.Equal("ihm.clear", intent!.CapabilityId);
    }
}

public class LlmIntentResolverTests
{
    [Fact]
    public async Task Falls_back_when_model_not_configured()
    {
        var resolver = new LlmIntentResolver(new NullLanguageModel(), new KeywordIntentResolver());
        var intent = await resolver.ResolveAsync("meteo Lyon", new List<CapabilitySpec>());
        Assert.NotNull(intent);
        Assert.Equal("meteo.get", intent!.CapabilityId);
    }
}

public class MaisonPluginTests
{
    [Fact]
    public async Task Turns_a_light_on()
    {
        var plugin = new MaisonPlugin();
        await plugin.InitializeAsync(new PluginContext { Http = new HttpClient() });

        var result = await plugin.InvokeAsync(
            "maison.lumiere",
            new Dictionary<string, string> { ["piece"] = "salon", ["etat"] = "allumee" });

        Assert.True(result.Success);
        Assert.NotNull(result.Ui);
    }

    [Fact]
    public async Task Rejects_unknown_room()
    {
        var plugin = new MaisonPlugin();
        await plugin.InitializeAsync(new PluginContext { Http = new HttpClient() });

        var result = await plugin.InvokeAsync(
            "maison.lumiere",
            new Dictionary<string, string> { ["piece"] = "garage", ["etat"] = "allumee" });

        Assert.False(result.Success);
    }
}

public class OrchestratorTests
{
    private sealed class FakeResolver(Intent? intent) : IIntentResolver
    {
        public Task<Intent?> ResolveAsync(string input, IReadOnlyList<CapabilitySpec> available, CancellationToken ct = default)
            => Task.FromResult(intent);
    }

    private sealed class FakePlugin : IPlugin
    {
        public PluginManifest Manifest { get; } = new() { Id = "fake", Name = "Fake", Version = "1.0.0" };

        public IReadOnlyList<Capability> Capabilities { get; } =
            [new Capability { Id = "fake.read", Title = "Lire", Impact = ImpactLevel.Read }];

        public Task InitializeAsync(PluginContext context, CancellationToken ct = default) => Task.CompletedTask;
        public Task<bool> HealthCheckAsync(CancellationToken ct = default) => Task.FromResult(true);

        public Task<CapabilityResult> InvokeAsync(string capabilityId, IReadOnlyDictionary<string, string> args, CancellationToken ct = default)
            => Task.FromResult(CapabilityResult.Ok(UiView.Of(new UiNode { Type = "text", Text = "ok" })));
    }

    private static Orchestrator Build(GrantStore grants, Intent? intent)
    {
        var registry = new PluginRegistry();
        registry.Register(new FakePlugin());
        return new Orchestrator(
            registry,
            new FakeResolver(intent),
            new NullLanguageModel(),
            grants,
            new AutoApprovalGate(),
            new InMemoryAuditLog());
    }

    [Fact]
    public async Task Invokes_when_permitted()
    {
        var grants = new GrantStore();
        grants.Grant("fake", "fake.read");
        var orchestrator = Build(grants, new Intent("fake.read", new Dictionary<string, string>()));

        var response = await orchestrator.HandleAsync("peu importe");

        Assert.True(response.Success);
        Assert.NotNull(response.Ui);
    }

    [Fact]
    public async Task Denies_when_not_permitted()
    {
        var orchestrator = Build(new GrantStore(), new Intent("fake.read", new Dictionary<string, string>()));

        var response = await orchestrator.HandleAsync("peu importe");

        Assert.False(response.Success);
        Assert.Null(response.Ui);
    }
}
