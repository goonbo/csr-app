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
  // Exact-match home routes ("/" and "/me") so they don't match descendants
  return pathname === item.href;
};

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const role = roleFromPath(pathname);
  const items = role === 'admin' ? NAV_ADMIN : NAV_EMP;

  const switchRole = (r: Role) => {
    if (r === role) return;
    router.push(r === 'admin' ? '/' : '/me');
  };

  return (
    <header
      className="px-4 sm:px-6 md:px-8"
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        paddingTop: 14, paddingBottom: 14,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(248, 244, 237, 0.9)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-3 md:gap-6"
        style={{ maxWidth: 1280, margin: '0 auto' }}
      >
        {/* Logo */}
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
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${C.sage}, ${C.sageLight})`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
            aria-hidden="true"
          >
            <Heart size={16} color="white" fill="white" strokeWidth={2.2} />
          </div>
          <div style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 18,
            color: C.ink,
            letterSpacing: '-0.01em',
          }}>
            VIEW
          </div>
        </Link>

        {/* Nav pills */}
        <nav
          aria-label="Primary"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: 4,
            borderRadius: 999,
            background: C.oat,
            border: `1px solid ${C.border}`,
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
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: active ? C.ink : C.muted,
                  background: active ? C.paper : 'transparent',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
              >
                <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role switch + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            role="group"
            aria-label="Switch role"
            style={{
              display: 'flex', padding: 2,
              borderRadius: 999,
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
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    color: isCurrent ? C.ink : C.muted,
                    background: isCurrent ? C.paper : 'transparent',
                    boxShadow: isCurrent ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
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
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 600,
              background: `linear-gradient(135deg, ${C.terracotta}, #B96B52)`,
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
