'use client';

import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { C } from '@/lib/tokens';

interface PageHeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  back?: string;
  onBack?: () => void;
}

export function PageHeader({ greeting, title, subtitle, action, back, onBack }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      {back && (
        <button
          onClick={onBack}
          className="view-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            margin: '-4px 0 12px -8px',
            padding: '4px 8px',
            fontSize: 13,
            fontFamily: 'inherit',
            color: C.muted,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 6,
          }}
        >
          <ArrowLeft size={14} aria-hidden="true" /> {back}
        </button>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          {greeting && (
            <div style={{
              fontFamily: 'var(--greeting-font), sans-serif',
              fontStyle: 'var(--greeting-style)' as React.CSSProperties['fontStyle'],
              fontSize: 13,
              color: C.muted,
              marginBottom: 6,
              letterSpacing: '0.01em',
            }}>
              {greeting}
            </div>
          )}
          <h1 style={{
            fontFamily: 'var(--font-h1), sans-serif',
            fontSize: 'var(--h1-size)' as React.CSSProperties['fontSize'],
            fontWeight: 'var(--h1-weight)' as React.CSSProperties['fontWeight'],
            color: C.ink,
            letterSpacing: 'var(--h1-tracking)' as React.CSSProperties['letterSpacing'],
            lineHeight: 1.05,
            margin: 0,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              marginTop: 12,
              fontSize: 14,
              color: C.inkLight,
              lineHeight: 1.55,
              maxWidth: 640,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
