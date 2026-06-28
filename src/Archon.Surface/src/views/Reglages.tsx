import { useCallback, useEffect, useState } from 'react';
import type { Settings, StatePayload } from '../types';
import { api } from '../api';
import { applyTheme } from '../theme';

const ACCENTS = [
  { label: 'Bleu', value: '#2A6BF2' },
  { label: 'Vert', value: '#2ECC9A' },
  { label: 'Violet', value: '#8A2BE2' },
  { label: 'Magenta', value: '#E612D9' },
];

export function Reglages({ state, reloadState }: { state: StatePayload | null; reloadState: () => void }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [preferences, setPreferences] = useState('');
  const [skill, setSkill] = useState('');
  const [accent, setAccent] = useState('');
  const [density, setDensity] = useState('normal');
  const [saved, setSaved] = useState('');

  const load = useCallback(async () => {
    const s = await api.getSettings();
    setSettings(s);
    setPreferences(s.preferences);
    setSkill(s.skill);
    try {
      const t = JSON.parse(s.theme || '{}') as { accent?: string; density?: string };
      setAccent(t.accent ?? '');
      setDensity(t.density ?? 'normal');
    } catch {
      /* theme vide */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (m: string) => {
    setSaved(m);
    window.setTimeout(() => setSaved(''), 1800);
  };

  const saveText = useCallback(async () => {
    await api.saveSettings({ preferences, skill });
    flash('Reglages enregistres.');
  }, [preferences, skill]);

  const saveTheme = useCallback(async () => {
    const theme = JSON.stringify({ accent, density });
    await api.saveSettings({ theme });
    applyTheme(theme);
    reloadState();
    flash('Theme applique.');
  }, [accent, density, reloadState]);

  const setMode = useCallback(
    async (mode: string) => {
      await api.mode(mode);
      reloadState();
    },
    [reloadState],
  );

  const mode = state?.mode ?? 'Ask';

  return (
    <div className="view-pad">
      <h2 className="view-title">Reglages</h2>

      <section className="setting">
        <h3 className="setting-title">Approbation des actions</h3>
        <p className="ui-meta">Archon agit-il directement, ou te demande-t-il ton accord pour les actions ?</p>
        <div className="seg">
          <button className={`seg-btn ${mode === 'Ask' ? 'is-on' : ''}`} onClick={() => setMode('Ask')}>
            Demander mon accord
          </button>
          <button className={`seg-btn ${mode === 'AutoRun' ? 'is-on' : ''}`} onClick={() => setMode('AutoRun')}>
            Laisser l'IA agir
          </button>
        </div>
      </section>

      <section className="setting">
        <h3 className="setting-title">Cerveau IA</h3>
        <p className="ui-meta">
          {settings?.model.configured
            ? `Modele branche : ${settings.model.name}`
            : 'Aucun modele branche (repli mots-cles). Voir docs/dev-quickstart.md pour brancher Ollama ou un cloud.'}
        </p>
      </section>

      <section className="setting">
        <h3 className="setting-title">Theme de l'IHM</h3>
        <p className="ui-meta">Accent et densite. L'IA peut aussi le changer en direct ("passe l'IHM en violet").</p>
        <div className="field-row">
          <label className="field">
            <span className="field-label">Accent</span>
            <div className="swatches">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  className={`swatch ${accent === a.value ? 'is-on' : ''}`}
                  style={{ background: a.value }}
                  title={a.label}
                  onClick={() => setAccent(a.value)}
                />
              ))}
              <button className={`swatch swatch-reset ${accent === '' ? 'is-on' : ''}`} title="Defaut" onClick={() => setAccent('')}>
                defaut
              </button>
            </div>
          </label>
          <label className="field">
            <span className="field-label">Densite</span>
            <select className="field-input" value={density} onChange={(e) => setDensity(e.target.value)}>
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="aere">Aere</option>
            </select>
          </label>
        </div>
        <div className="mgmt-actions">
          <button className="btn btn-spectrum" onClick={saveTheme}>
            Appliquer le theme
          </button>
        </div>
      </section>

      <section className="setting">
        <h3 className="setting-title">Preferences d'affichage (IHM)</h3>
        <p className="ui-meta">Le "skill" de preferences qu'Archon tient a jour et respecte.</p>
        <textarea className="field-input area" rows={3} value={preferences} onChange={(e) => setPreferences(e.target.value)} />
      </section>

      <section className="setting">
        <h3 className="setting-title">Skill Archon (prompt systeme)</h3>
        <p className="ui-meta">Decrit a l'IA comment interagir avec l'IHM et l'invite a etre originale. Injecte dans ses prompts.</p>
        <textarea className="field-input area area-tall" rows={12} value={skill} onChange={(e) => setSkill(e.target.value)} />
      </section>

      <div className="mgmt-actions">
        <button className="btn btn-spectrum" onClick={saveText}>
          Enregistrer
        </button>
        {saved ? <span className="ui-meta tone-success">{saved}</span> : null}
        <a className="btn btn-secondary btn-sm" href="/console" target="_blank" rel="noreferrer">
          Console technique
        </a>
      </div>
    </div>
  );
}
