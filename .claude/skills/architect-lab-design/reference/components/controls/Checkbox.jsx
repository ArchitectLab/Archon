import React from 'react';

/**
 * Architect Lab — Checkbox
 * A crisp blueprint square; when checked it fills spectrum-blue and the
 * tick draws itself in. Controlled or uncontrolled.
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const val = isControlled ? checked : on;
  const toggle = () => {
    if (disabled) return;
    const next = !val;
    if (!isControlled) setOn(next);
    onChange && onChange(next);
  };
  const cls = ['al-check', val ? 'is-on' : '', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" role="checkbox" aria-checked={val} disabled={disabled} onClick={toggle} className={cls} style={style} {...rest}>
      <span className="al-check__box">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 L6.5 12 L13 4.5" /></svg>
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export default Checkbox;
