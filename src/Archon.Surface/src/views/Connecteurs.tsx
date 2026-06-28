import { useCallback, useEffect, useState } from 'react';
import type { ConnectorItem, Plugin } from '../types';
import { api, type NewConnector } from '../api';

function impactTone(impact: string): string {
  switch (impact) {
    case 'Read':
      return 'tone-success';
    case 'Write':
      return 'tone-info';
    default:
      return 'tone-warn';
  }
}

// Panneau plugins : capacites + interrupteurs de permission (deny par defaut, visible).
function Plugins() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  const reload = useCallback(async () => {
    try {
      setPlugins(await api.plugins());
    } catch {
      /* coeur indisponible */
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggle = useCallback(
    async (pluginId: string, capId: string, granted: boolean) => {
      await api.togglePlugin(pluginId, capId, granted);
      reload();
    },
    [reload],
  );

  return (
    <div>
      <p className="eyebrow">// PLUGINS</p>
      {plugins.map((p) => (
        <article className="mgmt-card" key={p.id}>
          <header className="mgmt-head">
            <span className={`dot ${p.online ? 'dot-on' : 'dot-off'}`} />
            <h4 className="mgmt-title">{p.name}</h4>
            <span className="tag">v{p.version}</span>
            <span className="mgmt-spacer" />
            <span className="ui-meta">{p.author}</span>
          </header>
          <ul className="cap-list">
            {p.capabilities.map((c) => (
              <li className="cap-row" key={c.id}>
                <span className="cap-id">{c.id}</span>
                <span className="cap-title">{c.title}</span>
                <span className={`badge ${impactTone(c.impact)}`}>{c.impact}</span>
                <button
                  className={`switch ${c.granted ? 'switch-on' : ''}`}
                  onClick={() => toggle(p.id, c.id, !c.granted)}
                  title={c.granted ? 'Autorise (cliquer pour revoquer)' : 'Refuse (cliquer pour autoriser)'}
                >
                  {c.granted ? 'autorise' : 'refuse'}
                </button>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

const EMPTY: NewConnector = { kind: 'mcp', name: '', endpoint: '', secretEnvVar: '' };

// Panneau connecteurs : declarer un serveur MCP ou un connecteur HTTP, persiste.
function Connectors() {
  const [items, setItems] = useState<ConnectorItem[]>([]);
  const [form, setForm] = useState<NewConnector>(EMPTY);
  const [tests, setTests] = useState<Record<string, string>>({});

  const reload = useCallback(async () => {
    try {
      setItems(await api.connectors());
    } catch {
      /* coeur indisponible */
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = useCallback(async () => {
    if (!form.name.trim() || !form.endpoint.trim()) return;
    await api.addConnector(form);
    setForm(EMPTY);
    reload();
  }, [form, reload]);

  const test = useCallback(async (id: string) => {
    setTests((t) => ({ ...t, [id]: '...' }));
    try {
      const r = await api.testConnector(id);
      setTests((t) => ({ ...t, [id]: (r.ok ? 'OK ' : 'echec ') + r.detail }));
    } catch {
      setTests((t) => ({ ...t, [id]: 'echec' }));
    }
  }, []);

  return (
    <div>
      <p className="eyebrow">// CONNECTEURS (MCP / HTTP)</p>

      {items.length === 0 ? <p className="ui-meta">Aucun connecteur declare pour l'instant.</p> : null}

      {items.map((c) => (
        <article className="mgmt-card" key={c.id}>
          <header className="mgmt-head">
            <span className={`dot ${c.enabled ? 'dot-on' : 'dot-off'}`} />
            <h4 className="mgmt-title">{c.name}</h4>
            <span className="tag">{c.kind}</span>
            <span className="mgmt-spacer" />
            <button className={`switch ${c.enabled ? 'switch-on' : ''}`} onClick={() => api.toggleConnector(c.id, !c.enabled).then(reload)}>
              {c.enabled ? 'actif' : 'inactif'}
            </button>
          </header>
          <p className="conn-endpoint">{c.endpoint}</p>
          <p className="ui-meta">
            {c.secretEnvVar ? `secret via $${c.secretEnvVar} ${c.secretPresent ? '(present)' : '(absent)'}` : 'pas de secret'}
          </p>
          <div className="mgmt-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => test(c.id)}>
              Tester
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => api.removeConnector(c.id).then(reload)}>
              Retirer
            </button>
            {tests[c.id] ? <span className="ui-meta">{tests[c.id]}</span> : null}
          </div>
        </article>
      ))}

      <article className="mgmt-card mgmt-form">
        <p className="mgmt-form-title">Declarer un connecteur</p>
        <div className="field-row">
          <label className="field">
            <span className="field-label">Type</span>
            <select className="field-input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="mcp">Serveur MCP</option>
              <option value="http">Connecteur HTTP</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Nom</span>
            <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ex : Mon serveur MCP" />
          </label>
        </div>
        <label className="field">
          <span className="field-label">Endpoint (URL)</span>
          <input className="field-input" value={form.endpoint} onChange={(e) => setForm({ ...form, endpoint: e.target.value })} placeholder="https://..." />
        </label>
        <label className="field">
          <span className="field-label">Variable d'env du secret (optionnel)</span>
          <input
            className="field-input"
            value={form.secretEnvVar}
            onChange={(e) => setForm({ ...form, secretEnvVar: e.target.value })}
            placeholder="ex : MON_CONNECTEUR_TOKEN"
          />
          <span className="ui-meta">On ne stocke jamais le secret, seulement le NOM de la variable d'environnement.</span>
        </label>
        <div className="mgmt-actions">
          <button className="btn btn-spectrum" onClick={add}>
            Ajouter
          </button>
        </div>
      </article>
    </div>
  );
}

export function Connecteurs() {
  return (
    <div className="view-pad">
      <h2 className="view-title">Connecteurs</h2>
      <p className="view-lead">
        Gere les plugins (et leurs permissions, refusees par defaut) et declare des serveurs MCP ou des
        connecteurs HTTP. Le branchement reel d'un serveur MCP arrive a l'increment suivant.
      </p>
      <div className="mgmt-grid">
        <Plugins />
        <Connectors />
      </div>
    </div>
  );
}
