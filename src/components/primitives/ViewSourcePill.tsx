import { Sparkles } from 'lucide-react';

interface ViewSourcePillProps {
  /** Corporate partner the data flowed from, e.g. "CloudMotion".
   *  Becomes the trailing half of the label: "via VIEW · CloudMotion". */
  partner?: string;
  /** Override the entire label. Wins over `partner`. */
  label?: string;
  /** Default `md`. `sm` is the tiny inline form for dense list rows;
   *  `md` is the comfortable form for sitting alongside other Pill /
   *  ReadinessTag instances. */
  size?: 'sm' | 'md';
  /** Hide the sparkle icon — useful when the pill is appearing in
   *  Operator chrome, where the cyan tint already pops against the
   *  surrounding accent and the icon would crowd the row. */
  hideIcon?: boolean;
}

export function ViewSourcePill({
  partner,
  label,
  size = 'md',
  hideIcon = false,
}: ViewSourcePillProps) {
  const text = label ?? (partner ? `via VIEW · ${partner}` : 'via VIEW');
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? 3 : 4,
        padding: isSm ? '1px 7px' : '2px 9px',
        fontSize: isSm ? 10 : 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        borderRadius: 999,
        background: 'var(--view-source-bg)',
        color: 'var(--view-source-fg)',
        border: '1px solid var(--view-source)',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
        verticalAlign: 'middle',
      }}
      aria-label={text}
    >
      {!hideIcon && (
        <Sparkles
          size={isSm ? 9 : 10}
          strokeWidth={2.4}
          aria-hidden="true"
          style={{ color: 'var(--view-source)', flexShrink: 0 }}
        />
      )}
      {text}
    </span>
  );
}
