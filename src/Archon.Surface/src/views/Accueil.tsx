import type { StatePayload } from '../types';
import { Core } from '../components/Core';

// Accueil sobre, facon Jarvis : le coeur, une phrase, les actions, l'etat en une ligne.
export function Accueil({ state }: { state: StatePayload | null }) {
  const online = state?.registry.filter((r) => r.online).length ?? 0;
  const total = state?.registry.length ?? 0;
  const alert = (state?.approvals.length ?? 0) > 0;

  return (
    <div className="accueil">
      <div className="accueil-core">
        <Core mode={alert ? 'alert' : 'idle'} size={120} />
      </div>

      <p className="eyebrow">// TOUR DE CONTROLE SOUVERAINE</p>
      <h1 className="hero-title">
        Archon<span className="cursor">_</span>
      </h1>
      <p className="hero-lead">
        Une IA centrale comprend, branche et agit. Tu parles, Archon compose l'affichage en
        direct. Souverain, modulaire, auditable, securise des la premiere ligne.
      </p>

      <div className="accueil-actions">
        <a className="btn btn-spectrum" href="#/archon">
          Entrer dans Archon
        </a>
        <a className="btn btn-secondary" href="#/connecteurs">
          Connecteurs
        </a>
        <a className="btn btn-secondary" href="#/reglages">
          Reglages
        </a>
      </div>

      <div className="rule" />
      <p className="ui-meta">
        {online}/{total} plugins en ligne, mode {state?.mode === 'AutoRun' ? 'autonome' : 'approbation'}.
      </p>
    </div>
  );
}
