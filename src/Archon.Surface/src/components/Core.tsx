// Le "coeur" d'Archon : une presence ambiante facon Jarvis. Deux anneaux fins en spectre qui
// tournent lentement et un point central qui pulse. L'etat module le rythme (idle / reflexion
// / alerte). Respecte prefers-reduced-motion (gere en CSS). Spectre uniquement sur des traits.
export type CoreMode = 'idle' | 'thinking' | 'alert';

export function Core({ mode = 'idle', size = 64 }: { mode?: CoreMode; size?: number }) {
  return (
    <div className={`core core-${mode}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="core-svg">
        <defs>
          <linearGradient id="core-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2ECC9A" />
            <stop offset="42%" stopColor="#2A6BF2" />
            <stop offset="74%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="#E612D9" />
          </linearGradient>
        </defs>
        <circle className="core-ring core-ring-a" cx="32" cy="32" r="24" fill="none" stroke="url(#core-grad)" strokeWidth="1.5" strokeDasharray="40 110" strokeLinecap="round" />
        <circle className="core-ring core-ring-b" cx="32" cy="32" r="15" fill="none" stroke="url(#core-grad)" strokeWidth="1" strokeDasharray="20 70" strokeLinecap="round" />
        <circle className="core-dot" cx="32" cy="32" r="3.2" fill="url(#core-grad)" />
      </svg>
    </div>
  );
}
