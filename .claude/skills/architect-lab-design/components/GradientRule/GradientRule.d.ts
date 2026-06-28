import * as React from 'react';

export interface GradientRuleProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Length along the main axis (CSS length). */
  width?: number | string;
  /** Thickness in px. */
  height?: number;
  vertical?: boolean;
  rounded?: boolean;
  /** Use the darkened, print-safe spectrum. */
  print?: boolean;
}

/** The signature spectrum bar — section breaks, title underlines, thin tracks. */
export declare function GradientRule(props: GradientRuleProps): React.ReactElement;
export default GradientRule;
