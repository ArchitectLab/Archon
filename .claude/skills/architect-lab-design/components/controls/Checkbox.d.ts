import * as React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Checkbox — spectrum-blue fill with a drawing tick when checked. */
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
export default Checkbox;
