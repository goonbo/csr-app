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
    <div style={{ marginBottom: 40 }}>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          {greeting && (
            <div style={{
              fontFamily: 'var(--font-serif), serif',
              fontStyle: 'italic',
              fontSize: 15,
              color: C.muted,
              marginBottom: 6,
            }}>
              {greeting}
            </div>
          )}
          <h1 style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 38,
            fontWeight: 400,
            color: C.ink,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            margin: 0,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              marginTop: 10,
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
