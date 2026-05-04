import { C } from '@/lib/tokens';
import { READINESS_TAGS, tagFromScore } from '@/lib/seed/pipeline';
import type { ReadinessTagId } from '@/lib/types';

interface ReadinessTagProps {
  tag?: ReadinessTagId;
  score?: number | null;
  size?: 'md' | 'lg';
}

const tones = {
  sage:    { bg: C.sageGlow,           color: C.sageDeep,         border: C.sage },
  amber:   { bg: 'var(--amber-bg)',    color: 'var(--amber-fg)',  border: 'var(--amber)' },
  neutral: { bg: C.oat,                color: C.inkLight,         border: C.borderStrong },
};

export function ReadinessTag({ tag, score, size = 'md' }: ReadinessTagProps) {
  const t = tag || tagFromScore(score);
  const cfg = READINESS_TAGS[t] || READINESS_TAGS['not-assessed'];
  const tone = tones[cfg.tone];
  const padY = size === 'lg' ? 5 : 3;
  const padX = size === 'lg' ? 12 : 10;
  const fontSize = size === 'lg' ? 12 : 11;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: `${padY}px ${padX}px`,
        fontSize,
        fontWeight: 600,
        borderRadius: 999,
        background: tone.bg,
        color: tone.color,
        border: `1px solid ${tone.border}`,
        whiteSpace: 'nowrap',
      }}
      role="img"
      aria-label={`Readiness: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

// Legacy alias kept so any historical references resolve cleanly.
export const Readiness = ReadinessTag;
