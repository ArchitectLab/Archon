import React from 'react';

/**
 * Architect Lab — SegmentedControl
 * A row of options with a sliding indicator — the "personality switch"
 * from the motion console. Options are strings or {label, value}.
 */
export function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onChange,
  tone = 'default',     // 'default' | 'spectrum'
  className = '',
  style,
  ...rest
}) {
  const opts = options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o));
  const first = opts[0] ? opts[0].value : undefined;
  const [val, setVal] = React.useState(defaultValue !== undefined ? defaultValue : first);
  const isControlled = value !== undefined;
  const cur = isControlled ? value : val;
  const idx = Math.max(0, opts.findIndex((o) => o.value === cur));

  const wrapRef = React.useRef(null);
  const [ind, setInd] = React.useState({ left: 0, width: 0 });

  const measure = React.useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const btn = wrap.querySelectorAll('.al-seg__opt')[idx];
    if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [idx]);

  React.useLayoutEffect(() => { measure(); }, [measure, opts.length]);
  React.useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const pick = (v) => {
    if (!isControlled) setVal(v);
    onChange && onChange(v);
  };

  const cls = ['al-seg', tone === 'spectrum' ? 'al-seg--spectrum' : '', className].filter(Boolean).join(' ');
  return (
    <div ref={wrapRef} className={cls} role="tablist" style={style} {...rest}>
      <span className="al-seg__ind" style={{ transform: `translateX(${ind.left}px)`, width: ind.width }} />
      {opts.map((o) => (
        <button
          key={String(o.value)} type="button" role="tab" aria-selected={o.value === cur}
          className={'al-seg__opt' + (o.value === cur ? ' is-active' : '')}
          onClick={() => pick(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
