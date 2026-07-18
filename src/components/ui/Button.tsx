import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const base = variant === 'primary' ? 'uplate-btn-primary' : 'uplate-btn-ghost';
  return <button type="button" className={`${base}${className ? ` ${className}` : ''}`} {...rest} />;
}
