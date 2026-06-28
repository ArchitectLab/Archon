// Une petite courbe SVG (donnee vivante). Le degrade reprend deux couleurs du spectre.
export function Sparkline({ points, caption }: { points: number[]; caption?: string }) {
  const w = 240;
  const h = 48;
  const pad = 4;

  let poly = '';
  if (points.length === 1) {
    poly = `0,${h / 2} ${w},${h / 2}`;
  } else if (points.length > 1) {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min < 1e-9 ? 1 : max - min;
    poly = points
      .map((v, i) => {
        const x = (w * i) / (points.length - 1);
        const y = h - pad - ((h - 2 * pad) * (v - min)) / range;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <figure className="spark">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="spark-svg" role="img" aria-label={caption}>
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2ECC9A" />
            <stop offset="100%" stopColor="#2A6BF2" />
          </linearGradient>
        </defs>
        {poly ? (
          <polyline
            points={poly}
            fill="none"
            stroke="url(#spark-grad)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      {caption ? <figcaption className="ui-meta">{caption}</figcaption> : null}
    </figure>
  );
}
