import React from 'react';

/**
 * Architect Lab — Tag
 * The mono, uppercase, letter-tracked label. Used for categories,
 * code refs, status and the // eyebrow tags. Optionally spectrum-filled.
 */
export function Tag({
  children,
  tone = 'default',   // 'default' | 'spectrum' | 'green' | 'blue' | 'violet' | 'magenta'
  outlined = true,
  style,
  ...rest
}) {
  const colors = {
    green: '#2ECC9A', blue: '#2A6BF2', violet: '#8A2BE2', magenta: '#E612D9',
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '3px 9px',
    borderRadius: 999,
    border: outlined ? '1px solid #1E2A40' : '1px solid transparent',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  };

  let toneStyle = { color: '#8B97A8' };
  if (tone === 'spectrum') {
    toneStyle = {
      background: 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    };
  } else if (colors[tone]) {
    toneStyle = { color: colors[tone], borderColor: outlined ? colors[tone] + '55' : 'transparent' };
  }

  return (
    <span style={{ ...base, ...toneStyle, ...style }} {...rest}>
      {children}
    </span>
  );
}

export default Tag;
