import React from 'react';

/**
 * Architect Lab — IconButton
 * A square, blueprint-quiet button for a single icon. Outline by
 * default; hover lights the spectrum-blue border.
 */
export function IconButton({
  children,
  variant = 'outline',   // 'outline' | 'ghost'
  size = 'md',           // 'sm' | 'md' | 'lg'
  label,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'al-iconbtn',
    variant === 'ghost' ? 'al-iconbtn--ghost' : '',
    size === 'sm' ? 'al-iconbtn--sm' : size === 'lg' ? 'al-iconbtn--lg' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type="button" aria-label={label} disabled={disabled} className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}

export default IconButton;
