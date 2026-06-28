import { useCallback, useEffect, useState } from 'react';
import type { UiView, Widget } from '../types';
import { api } from '../api';
import { UiRenderer } from './UiRenderer';

// Widget "capability" : re-execute sa capacite source toutes les refreshSec secondes.
function CapabilityWidget({ w }: { w: Widget }) {
  const [view, setView] = useState<UiView | null>(null);
  const [err, setErr] = useState('');
  const [stamp, setStamp] = useState('');

  const refresh = useCallback(async () => {
    try {
      const r = await api.refresh(w.id);
      if (r.ok) {
        setView(r.ui ?? null);
        setErr('');
      } else {
        setErr(r.message || 'indisponible');
      }
      setStamp(new Date().toLocaleTimeString('fr-FR'));
    } catch {
      setErr('hors ligne');
    }
  }, [w.id]);

  useEffect(() => {
    refresh();
    if (w.refreshSec > 0) {
      const id = setInterval(refresh, w.refreshSec * 1000);
      return () => clearInterval(id);
    }
    return undefined;
  }, [refresh, w.refreshSec]);

  return (
    <>
      <UiRenderer view={view} />
      {err ? <p className="ui-meta tone-warn">{err}</p> : null}
      <p className="widget-foot">
        {w.refreshSec > 0 ? `maj toutes les ${w.refreshSec}s` : 'manuel'}
        {stamp ? ` (${stamp})` : ''}
      </p>
    </>
  );
}

// Widget "html" : fragment compose par l'IA, rendu dans un iframe bac a sable (aucun
// script execute, aucune meme-origine) -> originalite sans risque.
function HtmlWidget({ w }: { w: Widget }) {
  const doc =
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<style>body{margin:0;padding:14px;background:transparent;color:#F5F7FA;' +
    "font-family:Inter,system-ui,sans-serif;line-height:1.5;}</style></head><body>" +
    w.html +
    '</body></html>';
  return <iframe className="widget-frame" sandbox="" srcDoc={doc} title={w.title} />;
}

export function Ihm({ widgets, onRemove }: { widgets: Widget[]; onRemove: (id: string) => void }) {
  if (widgets.length === 0) {
    return (
      <div className="ihm-empty">
        <p className="ui-meta">L'IHM est vide pour l'instant.</p>
        <p className="ui-meta">
          Demande dans le chat, par exemple : "mets sur l'IHM la meteo d'Agen rafraichie toutes les 2 minutes".
        </p>
      </div>
    );
  }

  return (
    <div className="ihm-grid">
      {widgets.map((w) => (
        <article className="widget" key={w.id}>
          <header className="widget-head">
            <h4 className="widget-title">{w.title}</h4>
            <button className="widget-x" title="Retirer ce widget" onClick={() => onRemove(w.id)}>
              retirer
            </button>
          </header>
          {w.kind === 'html' ? <HtmlWidget w={w} /> : <CapabilityWidget w={w} />}
        </article>
      ))}
    </div>
  );
}
