import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `true` = spectrum hairline on top edge · `'left'` = spectrum bar on the left edge · `false` = none. */
  accent?: boolean | 'left';
  /** Print the 48px blueprint grid inside the card (sits on Deep Void instead of Panel). */
  blueprint?: boolean;
  padding?: number;
  children?: React.ReactNode;
}

/** Surface panel raised off the void. */
export declare function Card(props: CardProps): React.ReactElement;
export default Card;
