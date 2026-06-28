import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colour. `spectrum` clips the gradient to the text; named tones tint a single spectrum colour. */
  tone?: 'default' | 'spectrum' | 'green' | 'blue' | 'violet' | 'magenta';
  /** Draw the hairline pill border. */
  outlined?: boolean;
  children?: React.ReactNode;
}

/** Mono uppercase label/chip — categories, code refs, status, eyebrow tags. */
export declare function Tag(props: TagProps): React.ReactElement;
export default Tag;
