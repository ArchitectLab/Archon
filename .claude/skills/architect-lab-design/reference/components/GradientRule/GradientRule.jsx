import React from 'react';

/**
 * Architect Lab — GradientRule
 * The signature spectrum bar. Use under titles, as a section break,
 * or as a thin progress/track element. Keep it to a sliver — the
 * spectrum should stay under ~10% of any composition.
 */
export function GradientRule({
  width = '100%',
  height = 4,
  vertical = false,
  rounded = true,
  print = false,        // use the print-safe (darkened) spectrum
  style,
  ...rest
}) {
  const spectrum = print
    ? 'linear-gradient(90deg,#1FA87C,#2A6BF2,#8A2BE2,#D012C8)'
    : 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)';
  const spectrumV = print
    ? 'linear-gradient(180deg,#1FA87C,#2A6BF2,#8A2BE2,#D012C8)'
    : 'linear-gradient(180deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)';

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width: vertical ? height : width,
        height: vertical ? width : height,
        background: vertical ? spectrumV : spectrum,
        borderRadius: rounded ? 999 : 0,
        ...style,
      }}
      {...rest}
    />
  );
}

export default GradientRule;
