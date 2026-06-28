import React from 'react';

/**
 * Architect Lab — Radio
 * A single radio; the spectrum dot scales in when selected. For a group,
 * keep one `value` in state and render several with `checked={v === o}`.
 */
export function Radio({
  checked,
  defaultChecked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const val = isControlled ? checked : on;
  const pick = () => {
    if (disabled) return;
    if (!isControlled) setOn(true);
    onChange && onChange(value !== undefined ? value : true);
  };
  const cls = ['al-radio', val ? 'is-on' : '', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" role="radio" aria-checked={val} name={name} disabled={disabled} onClick={pick} className={cls} style={style} {...rest}>
      <span className="al-radio__dot" />
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export default Radio;
