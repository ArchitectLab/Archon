import * as React from 'react';

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `mark` = bowtie only · `horizontal` = mark + wordmark inline · `stacked` = mark over wordmark. */
  variant?: 'mark' | 'horizontal' | 'stacked';
  /** `spectrum` = gradient stroke · `mono-light` = white · `mono-dark` = Deep Void (for light backgrounds). */
  tone?: 'spectrum' | 'mono-light' | 'mono-dark';
  /** Height of the mark in px. */
  size?: number;
  wordmark?: string;
  baseline?: string;
}

/** The Architect Lab logo — the Morphaius spectrum bowtie. Never tilt it; never reverse the spectrum. */
export declare function Logo(props: LogoProps): React.ReactElement;
export default Logo;
