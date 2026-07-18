import type { ReactNode } from 'react';

export function AuthFrame({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="uplate-auth">
      <div className="uplate-auth__column">
        <div className="uplate-auth__head">
          <span className="uplate-auth__wordmark">UPlate</span>
          <p className="uplate-auth__subtitle">{subtitle}</p>
        </div>
        <div className="uplate-card">
          <h1 style={{ fontSize: 'var(--type-headline)', marginBottom: 'var(--s-4)' }}>{title}</h1>
          {children}
        </div>
        {footer && <p className="uplate-auth__footer">{footer}</p>}
      </div>
    </div>
  );
}
