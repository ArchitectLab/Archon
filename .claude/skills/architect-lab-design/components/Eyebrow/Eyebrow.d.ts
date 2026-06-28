import * as React from 'react';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text colour of the label (the tick is always spectrum). */
  color?: string;
  children?: React.ReactNode;
}

/** Section eyebrow — spectrum tick + tracked uppercase label. */
export declare function Eyebrow(props: EyebrowProps): React.ReactElement;
export default Eyebrow;
