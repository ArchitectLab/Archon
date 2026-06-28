import * as React from 'react';

export type SegOption = string | { label: React.ReactNode; value: any };

export interface SegmentedControlProps {
  options: SegOption[];
  /** Controlled selected value. Omit for uncontrolled (see `defaultValue`). */
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  /** `spectrum` tints the sliding indicator spectrum-blue. */
  tone?: 'default' | 'spectrum';
  className?: string;
  style?: React.CSSProperties;
}

/** Segmented control with a sliding indicator — 2–5 short options. */
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;
export default SegmentedControl;
