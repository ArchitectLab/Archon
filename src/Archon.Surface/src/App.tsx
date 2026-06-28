import { useCallback, useEffect, useState } from 'react';
import type { StatePayload } from './types';
import { api } from './api';
import { applyTheme } from './theme';
import { Core, type CoreMode } from './components/Core';
import { Accueil } from './views/Accueil';
import { ArchonView } from './views/ArchonView';
import { Connecteurs } from './views/Connecteurs';
import { Reglages } from './views/Reglages';

const NAV = [
  { id: 'accueil', label: 'Accueil', href: '#/' },
  { id: 'archon', label: 'Archon', href: '#/archon' },
  { id: 'connecteurs', label: 'Connecteurs', href: '#/connecteurs' },
  { id: 'reglages', label: 'Reglages', href: '#/reglages' },
];

function routeFromHash(): string {
  const h = window.location.hash.replace(/^#\/?/, '').trim();
  return h === '' ? 'accueil' : h;
}

export default function App() {
  const [route, setRoute] = useState<string>(routeFromHash());
  const [state, setState] = useState<StatePayload | null>(null);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const reloadState = useCallback(async () => {
    try {
      setState(await api.state());
    } catch {
      /* coeur indisponible */
    }
  }, []);

  useEffect(() => {
    reloadState();
    const id = setInterval(reloadState, 1500);
    return () => clearInterval(id);
  }, [reloadState]);

  // Le theme choisi par l'IA (ou l'utilisateur) est applique en direct.
  useEffect(() => {
    applyTheme(state?.theme);
  }, [state?.theme]);

  const mode: CoreMode = thinking ? 'thinking' : (state?.approvals.length ?? 0) > 0 ? 'alert' : 'idle';

  return (
    <div className="shell blueprint">
      <header className="topbar">
        <a className="brand" href="#/">
          <Core mode={mode} size={34} />
          <span className="wordmark">
            Archon<span className="cursor">_</span>
          </span>
        </a>

        <nav className="nav">
          {NAV.map((n) => (
            <a key={n.id} href={n.href} className={route === n.id ? 'is-on' : ''}>
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="content">
        {route === 'archon' ? (
          <ArchonView state={state} reloadState={reloadState} onThinking={setThinking} />
        ) : route === 'connecteurs' ? (
          <Connecteurs />
        ) : route === 'reglages' ? (
          <Reglages state={state} reloadState={reloadState} />
        ) : (
          <Accueil state={state} />
        )}
      </main>

      <footer className="ticker">
        {(state?.journal ?? []).slice(0, 6).map((e, i) => (
          <span key={i} className={`tick ${e.allowed ? '' : 'tick-deny'}`}>
            <span className="tick-action">{e.action}</span> {e.detail}
          </span>
        ))}
      </footer>
    </div>
  );
}
