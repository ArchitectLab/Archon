import type { UiNode, UiView } from '../types';
import { Sparkline } from './Sparkline';

function toneClass(tone?: string): string {
  switch (tone) {
    case 'success':
      return 'tone-success';
    case 'info':
      return 'tone-info';
    case 'warn':
      return 'tone-warn';
    case 'accent':
      return 'tone-accent';
    default:
      return '';
  }
}

// Rend un noeud du schema neutre en composant sur (jamais de HTML brut dans le DOM).
function Node({ node }: { node: UiNode }) {
  switch (node.type) {
    case 'heading':
      return <h3 className="ui-title">{node.text}</h3>;
    case 'stat':
      return (
        <div>
          <p className="ui-stat">
            {node.value}
            <span className="ui-unit">{node.unit}</span>
          </p>
          {node.text ? <p className="ui-meta">{node.text}</p> : null}
        </div>
      );
    case 'badge':
      return <p className={`ui-badge ${toneClass(node.tone)}`}>{node.text}</p>;
    case 'keyvalue':
      return (
        <ul className="ui-kv">
          {(node.items ?? []).map((it, i) => (
            <li key={i}>
              <span className="ui-kv-k">{it.key}</span>
              <span className={`ui-kv-v ${toneClass(it.tone)}`}>{it.value}</span>
            </li>
          ))}
        </ul>
      );
    case 'list':
      return (
        <ul className="ui-list">
          {(node.items ?? []).map((it, i) => (
            <li key={i}>{it.key}</li>
          ))}
        </ul>
      );
    case 'sparkline':
      return <Sparkline points={node.points ?? []} caption={node.text} />;
    case 'rule':
      return <div className="ui-rule" />;
    case 'note':
      return <p className="ui-meta">{node.text}</p>;
    default:
      return <p className="ui-text">{node.text}</p>;
  }
}

export function UiRenderer({ view }: { view?: UiView | null }) {
  if (!view || !view.nodes) return null;
  return (
    <>
      {view.nodes.map((n, i) => (
        <Node key={i} node={n} />
      ))}
    </>
  );
}
