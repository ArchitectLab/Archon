using Archon.Core.Audit;
using Archon.Core.Plugins;
using Archon.Core.Security;
using Xunit;

namespace Archon.Tests;

public class GrantStoreTests
{
    [Fact]
    public void Deny_by_default()
    {
        var grants = new GrantStore();
        Assert.False(grants.IsAllowed("plugin", "cap"));
    }

    [Fact]
    public void Allow_after_grant()
    {
        var grants = new GrantStore();
        grants.Grant("plugin", "cap");
        Assert.True(grants.IsAllowed("plugin", "cap"));
        Assert.False(grants.IsAllowed("plugin", "autre"));
    }
}

public class ApprovalGateTests
{
    private static readonly Dictionary<string, string> NoArgs = new();

    private static Capability Cap(ImpactLevel impact) => new()
    {
        Id = "x.do",
        Title = "X",
        Impact = impact,
    };

    [Fact]
    public async Task Read_is_auto_approved()
    {
        var gate = new InteractiveApprovalGate(new ApprovalQueue(), new ApprovalSettings(), new InMemoryAuditLog());
        Assert.True(await gate.RequestApprovalAsync("p", Cap(ImpactLevel.Read), NoArgs));
    }

    [Fact]
    public async Task Action_is_auto_approved_in_autorun_mode()
    {
        var settings = new ApprovalSettings { Mode = ApprovalMode.AutoRun };
        var gate = new InteractiveApprovalGate(new ApprovalQueue(), settings, new InMemoryAuditLog());
        Assert.True(await gate.RequestApprovalAsync("p", Cap(ImpactLevel.Write), NoArgs));
    }

    [Fact]
    public async Task Action_in_ask_mode_waits_for_human_resolution()
    {
        var queue = new ApprovalQueue();
        var gate = new InteractiveApprovalGate(queue, new ApprovalSettings(), new InMemoryAuditLog());

        var task = gate.RequestApprovalAsync("p", Cap(ImpactLevel.Write), NoArgs);

        for (var i = 0; i < 100 && queue.Pending().Count == 0; i++)
        {
            await Task.Delay(10);
        }

        var pending = Assert.Single(queue.Pending());
        queue.Resolve(pending.Id, true);

        Assert.True(await task);
    }
}
