using Archon.Core.Connectors;
using Archon.Core.Data;
using Archon.Core.Ihm;
using Archon.Data;
using Archon.Plugins.Ihm;
using Xunit;

namespace Archon.Tests;

public class ConnectorStoreTests
{
    private static SqliteConnectorStore NewStore(out string path)
    {
        path = Path.Combine(Path.GetTempPath(), $"archon-test-{Guid.NewGuid():n}.db");
        return new SqliteConnectorStore(new ArchonDatabase(path));
    }

    [Fact]
    public void Adds_lists_toggles_and_removes()
    {
        var store = NewStore(out var path);
        try
        {
            store.Add(new Connector
            {
                Id = "c1",
                Kind = "mcp",
                Name = "Test",
                Endpoint = "https://example.org",
                SecretEnvVar = "TEST_TOKEN",
                CreatedAt = DateTimeOffset.UtcNow,
            });

            Assert.Single(store.List());
            Assert.Equal("Test", store.Get("c1")!.Name);
            Assert.True(store.Get("c1")!.Enabled);

            store.SetEnabled("c1", false);
            Assert.False(store.Get("c1")!.Enabled);

            store.Remove("c1");
            Assert.Empty(store.List());
        }
        finally
        {
            File.Delete(path);
        }
    }
}

public class IhmPluginCockpitTests
{
    private sealed class FakeIhm : IIhmStore
    {
        private readonly List<Widget> _w = new();
        public IReadOnlyList<Widget> List() => _w;
        public Widget? Get(string id) => _w.FirstOrDefault(x => x.Id == id);
        public void Add(Widget w) => _w.Add(w);
        public void Remove(string id) => _w.RemoveAll(x => x.Id == id);
        public void Clear() => _w.Clear();
    }

    private sealed class FakeSettings : ISettingsStore
    {
        public readonly Dictionary<string, string> Store = new();
        public string? Get(string key) => Store.TryGetValue(key, out var v) ? v : null;
        public void Set(string key, string value) => Store[key] = value;
    }

    [Fact]
    public async Task Theme_maps_named_color_to_hex()
    {
        var settings = new FakeSettings();
        var plugin = new IhmPlugin(new FakeIhm(), settings);

        var result = await plugin.InvokeAsync("ihm.theme", new Dictionary<string, string> { ["accent"] = "violet" });

        Assert.True(result.Success);
        Assert.Contains("8A2BE2", settings.Get("ihm.theme"));
    }

    [Fact]
    public async Task Remove_targets_widget_by_title_fragment()
    {
        var ihm = new FakeIhm();
        ihm.Add(new Widget { Id = "w1", Title = "Meteo Agen", Kind = "capability", CreatedAt = DateTimeOffset.UtcNow });
        var plugin = new IhmPlugin(ihm, new FakeSettings());

        var result = await plugin.InvokeAsync("ihm.remove", new Dictionary<string, string> { ["title"] = "meteo" });

        Assert.True(result.Success);
        Assert.Empty(ihm.List());
    }
}
