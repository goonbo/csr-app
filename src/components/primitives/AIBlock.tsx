'use client';

import type { ReactNode } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { C } from '@/lib/tokens';

interface AIBlockProps {
  children: ReactNode;
  label?: string;
  onRegen?: () => void;
}

export function AIBlock({ children, label = 'AI-generated', onRegen }: AIBlockProps) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 12,
      padding: 16,
      background: `linear-gradient(135deg, ${C.sageGlow}, color-mix(in srgb, ${C.sageGlow} 50%, transparent))`,
      border: `1px solid ${C.sage}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: C.sageDeep,
        }}>
          <Sparkles size={11} strokeWidth={2.2} aria-hidden="true" /> {label}
        </span>
        {onRegen && (
          <button
            onClick={onRegen}
            className="view-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: C.muted,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
            }}
          >
            <RefreshCw size={11} aria-hidden="true" /> Regenerate
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
