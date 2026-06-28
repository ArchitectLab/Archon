import * as React from 'react';

export interface SwitchProps {
  /** Controlled on/off. Omit for uncontrolled (see `defaultChecked`). */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Toggle switch — the spectrum track lights when on. */
export declare function Switch(props: SwitchProps): React.ReactElement;
export default Switch;
