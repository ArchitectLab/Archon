import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label — required since the button has no text. */
  label?: string;
  children?: React.ReactNode;
}

/** Square icon-only button. Pair with a Lucide icon. */
export declare function IconButton(props: IconButtonProps): React.ReactElement;
export default IconButton;
