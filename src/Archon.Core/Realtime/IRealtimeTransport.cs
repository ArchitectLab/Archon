namespace Archon.Core.Realtime;

// Abstraction du transport temps reel. Defaut vise : WebSocket (standard, polyglotte).
// SignalR reste un adaptateur .NET optionnel. Interface seulement au stade squelette.
public interface IRealtimeTransport
{
    Task PublishAsync(string topic, string payload, CancellationToken ct = default);
}
