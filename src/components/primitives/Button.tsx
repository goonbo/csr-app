'use client';

import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { C } from '@/lib/tokens';

export type ButtonVariant = 'primary' | 'accent' | 'soft' | 'ghost' | 'ai';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const sizes: Record<ButtonSize, { padding: string; fontSize: number; iconSize: number }> = {
  sm: { padding: '6px 14px', fontSize: 13, iconSize: 13 },
  md: { padding: '10px 20px', fontSize: 14, iconSize: 15 },
  lg: { padding: '12px 24px', fontSize: 15, iconSize: 16 },
};

const variants: Record<ButtonVariant, { background: string; color: string; border: string; hoverBg: string }> = {
  primary: {
    background: C.sage,
    color: '#FFFFFF',
    border: `1px solid ${C.sage}`,
    hoverBg: C.sageLight,
  },
  accent: {
    background: C.terracotta,
    color: '#FFFFFF',
    border: `1px solid ${C.terracotta}`,
    hoverBg: C.terracottaDeep,
  },
  soft: {
    background: C.paper,
    color: C.ink,
    border: `1px solid ${C.border}`,
    hoverBg: C.oat,
  },
  ghost: {
    background: 'transparent',
    color: C.inkLight,
    border: '1px solid transparent',
    hoverBg: C.oat,
  },
  ai: {
    background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageLight} 100%)`,
    color: '#FFFFFF',
    border: `1px solid ${C.sage}`,
    hoverBg: C.sage,
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled,
  full,
  type = 'button',
}: ButtonProps) {
  const s = sizes[size];
  const v = variants[variant];
  const [hover, setHover] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="view-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 500,
        fontFamily: 'inherit',
        borderRadius: 999,
        background: hover && !disabled ? v.hoverBg : v.background,
        color: v.color,
        border: v.border,
        boxShadow:
          variant === 'primary' ? '0 1px 2px rgba(10,26,46,0.10)' :
          variant === 'accent'  ? '0 1px 2px rgba(10,26,46,0.10)' :
          variant === 'ai'      ? `0 0 0 4px ${C.sageGlow}` :
          'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 150ms ease, box-shadow 150ms ease',
        width: full ? '100%' : 'auto',
        whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={s.iconSize} strokeWidth={2.2} aria-hidden="true" />}
      {children}
    </button>
  );
}
