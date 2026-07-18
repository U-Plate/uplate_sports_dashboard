import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, ...rest }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="uplate-field">
      <label className="uplate-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="uplate-input"
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...rest}
      />
      {error && (
        <span id={errorId} className="uplate-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
