import React from 'react';

/**
 * Architect Lab — Card
 * A panel raised off the void. The optional `accent` prints a spectrum
 * hairline along the top — the construction-line motif.
 */
export function Card({
  children,
  accent = false,        // false | true (spectrum top rule) | 'left'
  blueprint = false,     // print the 48px grid inside the card
  padding = 24,
  style,
  ...rest
}) {
  const base = {
    position: 'relative',
    background: blueprint ? '#0B1220' : '#111A2C',
    backgroundImage: blueprint
      ? 'linear-gradient(#1E2A40 1px, transparent 1px), linear-gradient(90deg, #1E2A40 1px, transparent 1px)'
      : 'none',
    backgroundSize: blueprint ? '48px 48px' : 'auto',
    border: '1px solid #1E2A40',
    borderRadius: 12,
    padding,
    overflow: 'hidden',
  };

  const topRule = accent === true && (
    <span aria-hidden="true" style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 3,
      background: 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)',
    }} />
  );
  const leftRule = accent === 'left' && (
    <span aria-hidden="true" style={{
      position: 'absolute', top: 0, bottom: 0, left: 0, width: 3,
      background: 'linear-gradient(180deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)',
    }} />
  );

  return (
    <div style={{ ...base, ...style }} {...rest}>
      {topRule}
      {leftRule}
      {children}
    </div>
  );
}

export default Card;
