import React from 'react';

/**
 * Architect Lab — Eyebrow
 * The section label: a short spectrum tick followed by tracked,
 * uppercase display text. The "02 — Le logo" pattern from the charte.
 */
export function Eyebrow({
  children,
  color = '#2A6BF2',
  style,
  ...rest
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden="true" style={{
        width: 34, height: 2,
        background: 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)',
      }} />
      {children}
    </span>
  );
}

export default Eyebrow;
