'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Heart, Calendar, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { C } from '@/lib/tokens';

type Role = 'admin' | 'employee';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

const NAV_ADMIN: NavItem[] = [
  { href: '/',         label: 'Home',     icon: Home },
  { href: '/partners', label: 'Partners', icon: Heart,     matchPrefix: '/partners' },
  { href: '/events',   label: 'Events',   icon: Calendar,  matchPrefix: '/events' },
  { href: '/reports',  label: 'Reports',  icon: BarChart3, matchPrefix: '/reports' },
];

const NAV_EMP: NavItem[] = [
  { href: '/me',                label: 'My Home',       icon: Home },
  { href: '/me/opportunities',  label: 'Opportunities', icon: Heart,     matchPrefix: '/me/opportunities' },
  { href: '/me/profile',        label: 'My Impact',     icon: BarChart3, matchPrefix: '/me/profile' },
];

const roleFromPath = (pathname: string): Role =>
  pathname === '/me' || pathname.startsWith('/me/') ? 'employee' : 'admin';

const isItemActive = (item: NavItem, pathname: string): boolean => {
  if (item.matchPrefix) return pathname === item.matchPrefix || pathname.startsWith(item.matchPrefix + '/');
  return pathname === item.href;
};

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const role = roleFromPath(pathname);
  const items = role === 'admin' ? NAV_ADMIN : NAV_EMP;
  const workspaceLabel = role === 'admin' ? 'CloudMotion · Admin' : 'My View';

  const switchRole = (r: Role) => {
    if (r === role) return;
    router.push(r === 'admin' ? '/' : '/me');
  };

  return (
    <header
      className="px-4 sm:px-6 md:px-8"
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        paddingTop: 12, paddingBottom: 12,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: `color-mix(in srgb, ${C.paper} 80%, transparent)`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-3 md:gap-6"
        style={{ maxWidth: 1280, margin: '0 auto' }}
      >
        {/* Logo + workspace pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href={role === 'admin' ? '/' : '/me'}
            className="view-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              borderRadius: 6,
            }}
            aria-label="VIEW home"
          >
            {/* Logo mark — small square with the brand cyan gradient + dot motif */}
            <span
              aria-hidden="true"
              style={{
                position: 'relative',
                width: 24, height: 24, borderRadius: 6,
                background: `linear-gradient(135deg, ${C.ink} 0%, #1E40AF 35%, ${C.sage} 75%, ${C.sageLight} 100%)`,
                boxShadow: `0 0 0 1px ${C.border}, 0 0 12px ${C.sageGlow}`,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 4, height: 4, borderRadius: '50%',
                  background: '#5EEAD4',
                  boxShadow: '0 0 6px rgba(94, 234, 212, 0.8)',
                }}
              />
              <span
                style={{
                  position: 'absolute', bottom: 5, left: 5,
                  width: 3, height: 3, borderRadius: '50%',
                  background: '#22D3EE',
                }}
              />
            </span>
            <span style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: '-0.01em',
            }}>
              VIEW
            </span>
          </Link>

          {/* Workspace pill */}
          <span
            className="hidden md:inline-flex"
            style={{
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: 6,
              background: C.oat,
              color: C.muted,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '-0.005em',
              whiteSpace: 'nowrap',
            }}
          >
            {workspaceLabel}
          </span>
        </div>

        {/* Tab-style nav */}
        <nav
          aria-label="Primary"
          style={{
            display: 'flex', alignItems: 'center', gap: 2,
          }}
        >
          {items.map(item => {
            const Icon = item.icon;
            const active = isItemActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className="view-btn flex items-center gap-1.5"
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: active ? C.ink : C.muted,
                  background: active ? C.oat : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
              >
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role switch + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            role="group"
            aria-label="Switch role"
            style={{
              display: 'flex', padding: 2,
              borderRadius: 6,
              background: C.oat,
              border: `1px solid ${C.border}`,
            }}
          >
            {(['admin', 'employee'] as const).map(r => {
              const label = r === 'admin' ? 'Admin' : 'Employee';
              const isCurrent = role === r;
              return (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  aria-pressed={isCurrent}
                  className="view-btn"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    color: isCurrent ? C.ink : C.muted,
                    background: isCurrent ? C.paper : 'transparent',
                    boxShadow: isCurrent ? '0 1px 2px rgba(10,26,46,0.06)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div
            style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.paper, fontSize: 11, fontWeight: 700,
              background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`,
              boxShadow: `0 0 0 1px ${C.border}`,
            }}
            aria-label="Sarah Chen"
          >
            SC
          </div>
        </div>
      </div>
    </header>
  );
}
