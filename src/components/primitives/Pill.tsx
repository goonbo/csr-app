import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { C } from '@/lib/tokens';
import type { PillTone } from '@/lib/types';

interface PillProps {
  children: ReactNode;
  tone?: PillTone;
  icon?: LucideIcon;
}

const tones: Record<PillTone, { bg: string; color: string; border: string }> = {
  neutral:    { bg: C.oat,                color: C.inkLight,          border: C.borderStrong },
  sage:       { bg: C.sageGlow,           color: C.sageDeep,          border: C.sage },
  terracotta: { bg: C.terracottaGlow,     color: C.terracottaDeep,    border: C.terracotta },
  amber:      { bg: 'var(--amber-bg)',    color: 'var(--amber-fg)',   border: 'var(--amber)' },
  rose:       { bg: 'var(--rose-bg)',     color: 'var(--rose-fg)',    border: 'var(--rose)' },
};

export function Pill({ children, tone = 'neutral', icon: Icon }: PillProps) {
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 600,
      borderRadius: 999,
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.border}`,
      whiteSpace: 'nowrap',
    }}>
      {Icon && <Icon size={11} strokeWidth={2.2} aria-hidden="true" />}
      {children}
    </span>
  );
}
