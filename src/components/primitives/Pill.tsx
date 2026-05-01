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
  neutral:    { bg: C.oat,             color: C.inkLight,        border: C.borderStrong },
  sage:       { bg: C.sageGlow,        color: C.sageDeep,        border: '#A8C09E' },
  terracotta: { bg: C.terracottaGlow,  color: C.terracottaDeep,  border: '#D8A88E' },
  amber:      { bg: '#F5E8C8',         color: '#6B4E1A',         border: '#D4B96A' },
  rose:       { bg: '#F4D6D6',         color: '#7A2222',         border: '#D89494' },
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
