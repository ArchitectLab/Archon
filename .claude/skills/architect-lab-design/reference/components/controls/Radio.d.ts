import * as React from 'react';

export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Fires with this radio's `value` (or `true`) when picked. */
  onChange?: (value: any) => void;
  label?: React.ReactNode;
  name?: string;
  value?: any;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Single radio with a scale-in spectrum dot. Drive a group from one state value. */
export declare function Radio(props: RadioProps): React.ReactElement;
export default Radio;
