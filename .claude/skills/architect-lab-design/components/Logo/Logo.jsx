import React from 'react';

/**
 * Architect Lab — Logo
 * The Morphaius spectrum bowtie: an outlined hourglass whose stroke
 * carries green → blue → violet → magenta. The mark never tilts,
 * the spectrum never reverses.
 *
 * variant: 'mark' | 'horizontal' | 'stacked'
 * tone:    'spectrum' (default) | 'mono-light' (white) | 'mono-dark' (void)
 */
export function Logo({
  variant = 'horizontal',
  tone = 'spectrum',
  size = 40,            // height of the mark in px
  wordmark = 'ARCHITECT LAB',
  baseline = 'DESIGN · BUILD · PROTECT',
  style,
  ...rest
}) {
  const gid = React.useId ? React.useId().replace(/:/g, '') : 'al' + Math.random().toString(36).slice(2);
  const stroke =
    tone === 'mono-light' ? '#F5F7FA'
    : tone === 'mono-dark' ? '#0B1220'
    : `url(#alspec-${gid})`;
  const wordColor = tone === 'mono-dark' ? '#0B1220' : '#F5F7FA';

  const ratio = 120 / 80;
  const w = size * ratio;

  const Mark = (
    <svg width={w} height={size} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`alspec-${gid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#2ECC9A" />
          <stop offset="38%" stopColor="#2A6BF2" />
          <stop offset="70%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#E612D9" />
        </linearGradient>
      </defs>
      <path
        d="M14 14 L60 40 L106 14 L106 66 L60 40 L14 66 Z"
        stroke={stroke}
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'mark') {
    return (
      <span role="img" aria-label={wordmark} style={{ display: 'inline-flex', ...style }} {...rest}>
        {Mark}
      </span>
    );
  }

  if (variant === 'stacked') {
    return (
      <span role="img" aria-label={wordmark}
        style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.28, ...style }} {...rest}>
        {Mark}
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size * 0.6, letterSpacing: '-0.01em', color: wordColor, lineHeight: 1 }}>
            {wordmark}<span style={{ color: '#E612D9' }}>_</span>
          </span>
          {baseline ? (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size * 0.26, letterSpacing: '0.22em', color: '#8B97A8' }}>{baseline}</span>
          ) : null}
        </span>
      </span>
    );
  }

  // horizontal
  return (
    <span role="img" aria-label={wordmark}
      style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42, ...style }} {...rest}>
      {Mark}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size * 0.62, letterSpacing: '-0.01em', color: wordColor, lineHeight: 1 }}>
          {wordmark}<span style={{ color: '#E612D9' }}>_</span>
        </span>
        {baseline ? (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size * 0.24, letterSpacing: '0.22em', color: '#8B97A8' }}>{baseline}</span>
        ) : null}
      </span>
    </span>
  );
}

export default Logo;
