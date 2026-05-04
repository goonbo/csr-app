'use client';

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { C } from '@/lib/tokens';

interface CardProps {
  children: ReactNode;
  soft?: boolean;
  ai?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  role?: string;
  ariaLabel?: string;
}

export function Card({
  children,
  soft = false,
  ai = false,
  onClick,
  style = {},
  role,
  ariaLabel,
}: CardProps) {
  const [hover, setHover] = useState(false);
  const interactive = !!onClick;

  // Hover effect lives in box-shadow only. Updating any border-related
  // property on rerender clashes with callers that pass per-side shorthand
  // (`borderLeft`, `borderTop`) and triggers React's shorthand/longhand
  // warning, so the border is held static.
  const borderColor = ai ? C.sage : C.border;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={interactive ? 'button' : role}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={ariaLabel}
      className={interactive ? 'view-interactive' : ''}
      style={{
        borderRadius: 16,
        background: ai ? C.sageGlow : (soft ? C.oat : C.paper),
        // Per-side shorthands instead of the `border` parent shorthand, so
        // callers can override one side via `borderLeft`/`borderTop` without
        // tripping React's parent/child shorthand warning on rerender.
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderLeft: `1px solid ${borderColor}`,
        boxShadow: ai
          ? '0 1px 3px rgba(10,26,46,0.04), 0 0 0 4px var(--accent-glow)'
          : interactive && hover
            ? '0 4px 16px rgba(10,26,46,0.06)'
            : '0 1px 2px rgba(10,26,46,0.03)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow 150ms ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
