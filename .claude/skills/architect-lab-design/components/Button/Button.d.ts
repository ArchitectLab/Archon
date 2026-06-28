import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` = solid blue, `spectrum` = full gradient (use sparingly), `secondary` = outline, `ghost` = text only. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'spectrum';
  size?: 'sm' | 'md' | 'lg';
  /** Animated accent treatment. `sweep` = spectrum gloss, `glow` = spectrum bloom, `scanline` = materialisation line, `draw` = cartouche brackets. Use sparingly. */
  fx?: 'sweep' | 'glow' | 'scanline' | 'draw';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** Architect Lab button. The spectrum variant is the hero action — keep it to one per view. */
export declare function Button(props: ButtonProps): React.ReactElement;
export default Button;
