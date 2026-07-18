import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, RefreshCw } from 'lucide-react';
import type { Team } from '../../types';
import { useApp } from '../../store/AppContext';
import { Button } from '../ui/Button';
import { Toast } from '../ui/Toast';

function inviteUrl(code: string): string {
  return `https://uplate.app/join/${code}`;
}

export function InviteLinkPanel({ team, onClose }: { team: Team; onClose: () => void }) {
  const { regenerateInvite } = useApp();
  const [copied, setCopied] = useState(false);
  const [confirmingRegenerate, setConfirmingRegenerate] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>('button, a, [tabindex]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [onClose]);

  async function copyLink() {
    await navigator.clipboard.writeText(inviteUrl(team.inviteCode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function confirmRegenerate() {
    setRegenerating(true);
    try {
      await regenerateInvite(team.id);
      setConfirmingRegenerate(false);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="uplate-drawer-backdrop">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
      />
      <div ref={panelRef} className="uplate-drawer-panel" role="dialog" aria-modal="true" aria-label={`Invite link for ${team.name}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--s-3)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 2 }}>Invite athletes</h2>
            <p style={{ fontSize: 'var(--type-meta)', color: 'var(--ink-3)' }}>{team.name}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{ width: 32, height: 32, border: 'none', background: 'transparent', color: 'var(--ink-2)', borderRadius: 'var(--r-sm)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <p style={{ fontSize: 'var(--type-body)', color: 'var(--ink-2)' }}>
          Share this link with your athletes. Opening it on their phone signs them into UPlate (creating an account
          if they don't have one yet) and adds them to this team.
        </p>

        <div className="uplate-invite-code">
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteUrl(team.inviteCode)}</span>
          <button
            type="button"
            onClick={() => void copyLink()}
            aria-label="Copy invite link"
            style={{ border: 'none', background: 'transparent', color: copied ? 'var(--status-on-track)' : 'var(--accent)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
          >
            {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={1.75} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', paddingTop: 'var(--s-5)', borderTop: '1px solid var(--hairline)' }}>
          {!confirmingRegenerate ? (
            <Button variant="ghost" onClick={() => setConfirmingRegenerate(true)} style={{ alignSelf: 'flex-start' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={15} strokeWidth={1.75} />
                Generate a new link
              </span>
            </Button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              <p style={{ fontSize: 'var(--type-meta)', color: 'var(--ink-2)' }}>
                The current link will stop working. Anyone who hasn't used it yet will need the new one.
              </p>
              <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
                <Button onClick={() => void confirmRegenerate()} disabled={regenerating}>
                  {regenerating ? 'Generating…' : 'Yes, generate new link'}
                </Button>
                <Button variant="ghost" onClick={() => setConfirmingRegenerate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {copied && <Toast message="Link copied" />}
    </div>
  );
}
