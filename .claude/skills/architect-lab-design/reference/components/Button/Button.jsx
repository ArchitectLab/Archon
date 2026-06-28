import React from 'react';

/**
 * Architect Lab — Button
 * The primary action carries the spectrum; everything else stays
 * blueprint-quiet. Corners are crisp, the focus ring glows blue.
 */
export function Button({
  children,
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'spectrum'
  size = 'md',           // 'sm' | 'md' | 'lg'
  fx,                    // 'sweep' | 'glow' | 'scanline' | 'draw' — animated accents
  iconLeft,
  iconRight,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: '8px 14px',  fontSize: 13, gap: 6 },
    md: { padding: '11px 20px', fontSize: 15, gap: 8 },
    lg: { padding: '15px 28px', fontSize: 17, gap: 10 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '-0.01em',
    border: '1px solid transparent',
    borderRadius: 'var(--al-radius-sm, 6px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background .15s ease, border-color .15s ease, color .15s ease, transform .05s ease, box-shadow .25s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  const variants = {
    primary: {
      background: '#2A6BF2',
      color: '#F5F7FA',
      borderColor: '#2A6BF2',
    },
    spectrum: {
      background: 'linear-gradient(90deg,#2ECC9A 0%,#2A6BF2 38%,#8A2BE2 70%,#E612D9 100%)',
      color: '#FFFFFF',
      borderColor: 'transparent',
    },
    secondary: {
      background: 'transparent',
      color: '#F5F7FA',
      borderColor: '#3A4A66',
    },
    ghost: {
      background: 'transparent',
      color: '#8B97A8',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={(fx ? 'al-fx--' + fx : '') + (className ? ' ' + className : '')}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      {...rest}
    >
      {iconLeft ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{iconLeft}</span> : null}
      {children}
      {iconRight ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{iconRight}</span> : null}
    </button>
  );
}

export default Button;
