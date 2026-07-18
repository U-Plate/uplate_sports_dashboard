import { Check } from 'lucide-react';

export function Toast({ message }: { message: string }) {
  return (
    <div className="uplate-toast" role="status" aria-live="polite">
      <span style={{ display: 'inline-flex', color: 'var(--status-on-track)' }} aria-hidden>
        <Check size={16} strokeWidth={2} />
      </span>
      {message}
    </div>
  );
}
