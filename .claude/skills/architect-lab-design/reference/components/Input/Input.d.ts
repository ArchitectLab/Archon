import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase label above the field. */
  label?: string;
  /** Helper text below (turns magenta when invalid). */
  hint?: string;
  /** Leading prompt glyph for terminal-style fields, e.g. "$" or ">". */
  prefix?: string;
  invalid?: boolean;
}

/** Text field — quiet on the void, spectrum-blue focus ring. */
export declare function Input(props: InputProps): React.ReactElement;
export default Input;
