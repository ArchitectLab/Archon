import React from 'react';

/**
 * Architect Lab — Switch
 * On = the spectrum lights the track and the thumb slides; off stays
 * blueprint-quiet. Controlled (pass `checked`) or uncontrolled.
 */
export function Switch({
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
  const cls = ['al-switch', val ? 'is-on' : '', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return (
    <button
      type="button" role="switch" aria-checked={val}
      aria-label={typeof label === 'string' ? label : undefined}
      disabled={disabled} onClick={toggle} className={cls} style={style} {...rest}
    >
      <span className="al-switch__track"><span className="al-switch__thumb" /></span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export default Switch;
