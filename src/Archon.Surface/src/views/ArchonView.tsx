import { useCallback, useEffect, useRef, useState } from 'react';
import type { StatePayload, UiView, Widget } from '../types';
import { api } from '../api';
import { UiRenderer } from '../components/UiRenderer';
import { Ihm } from '../components/Ihm';

interface Msg {
  role: 'user' | 'archon';
  text: string;
  ui?: UiView | null;
  ok?: boolean;
}

const GREETING: Msg = {
  role: 'archon',
  text: "Je suis la. Demande-moi la meteo, une action, ou de composer quelque chose sur l'IHM a droite.",
};

// L'endroit central : a gauche le chat, a droite l'IHM. Parler au chat agit dans l'IHM.
export function ArchonView({
  state,
  reloadState,
  onThinking,
}: {
  state: StatePayload | null;
  reloadState: () => void;
  onThinking: (b: boolean) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);

  const reloadWidgets = useCallback(async () => {
    try {
      setWidgets(await api.ihm());
    } catch {
      /* coeur indisponible : on garde l'affichage courant */
    }
  }, []);

  useEffect(() => {
    reloadWidgets();
  }, [reloadWidgets]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setBusy(true);
    onThinking(true);
    try {
      const r = await api.chat(text);
      setMessages((m) => [...m, { role: 'archon', text: r.message || '', ui: r.ui ?? null, ok: r.ok }]);
    } catch {
      setMessages((m) => [...m, { role: 'archon', text: 'Le coeur ne repond pas.', ok: false }]);
    } finally {
      setBusy(false);
      onThinking(false);
      reloadWidgets();
      reloadState();
    }
  }, [input, busy, onThinking, reloadWidgets, reloadState]);

  const approve = useCallback(
    async (id: string, approved: boolean) => {
      await api.approval(id, approved);
      reloadState();
    },
    [reloadState],
  );

  const removeWidget = useCallback(
    async (id: string) => {
      await api.removeWidget(id);
      reloadWidgets();
    },
    [reloadWidgets],
  );

  const approvals = state?.approvals ?? [];

  return (
    <div className="grid">
      <section className="pane pane-chat">
        <p className="eyebrow">// CHAT</p>

        {approvals.length > 0 && (
          <div className="approvals">
            {approvals.map((a) => (
              <article className="approval" key={a.id}>
                <p className="approval-eyebrow">APPROBATION REQUISE</p>
                <p className="approval-detail">{a.detail}</p>
                <div className="approval-actions">
                  <button className="btn btn-spectrum" onClick={() => approve(a.id, true)}>
                    Approuver
                  </button>
                  <button className="btn btn-secondary" onClick={() => approve(a.id, false)}>
                    Refuser
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="thread" ref={threadRef}>
          {messages.map((m, i) => (
            <div key={i} className={`bubble bubble-${m.role}`}>
              {m.text ? <p className={`bubble-text ${m.ok === false ? 'tone-warn' : ''}`}>{m.text}</p> : null}
              {m.ui ? (
                <div className="bubble-ui">
                  <UiRenderer view={m.ui} />
                </div>
              ) : null}
            </div>
          ))}
          {busy ? <p className="ui-meta">L'orchestrateur reflechit...</p> : null}
        </div>

        <div className="cmd">
          <span className="cmd-prompt">&gt;</span>
          <input
            className="cmd-input"
            value={input}
            placeholder="ex : mets la meteo d'Agen sur l'IHM, rafraichie toutes les 2 minutes"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <button className="btn btn-spectrum" onClick={send} disabled={busy}>
            Envoyer
          </button>
        </div>
      </section>

      <section className="pane pane-ihm">
        <p className="eyebrow">// IHM : le canvas que l'IA pilote</p>
        <Ihm widgets={widgets} onRemove={removeWidget} />
      </section>
    </div>
  );
}
