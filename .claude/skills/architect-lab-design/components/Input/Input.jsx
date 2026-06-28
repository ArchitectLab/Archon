import React from 'react';

/**
 * Architect Lab — Input
 * Quiet on the void, with a mono label. Focus lights the spectrum-blue
 * ring. Pairs with a leading prompt glyph for terminal-style fields.
 */
export function Input({
  label,
  hint,
  prefix,                // e.g. "$" or ">" for terminal fields
  invalid = false,
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'al-in';
  const inputId = id || autoId;
  const borderColor = invalid ? '#E612D9' : focused ? '#2A6BF2' : '#1E2A40';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, ...style }}>
      {label ? (
        <label htmlFor={inputId} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#8B97A8',
        }}>{label}</label>
      ) : null}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#0B1220',
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        padding: '0 12px',
        boxShadow: focused ? '0 0 0 3px rgba(42,107,242,0.25)' : 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
      }}>
        {prefix ? (
          <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2ECC9A', fontSize: 15 }}>{prefix}</span>
        ) : null}
        <input
          id={inputId}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          {...rest}
          style={{
            flex: 1, minWidth: 0,
            background: 'transparent', border: 'none', outline: 'none',
            color: '#F5F7FA',
            fontFamily: "'Inter', sans-serif", fontSize: 15,
            padding: '11px 0',
          }}
        />
      </div>
      {hint ? (
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: invalid ? '#E612D9' : '#8B97A8' }}>{hint}</span>
      ) : null}
    </div>
  );
}

export default Input;
