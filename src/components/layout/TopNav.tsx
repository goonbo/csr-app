'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home, Heart, Calendar, BarChart3,
  Users, Building2, HeartHandshake,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { C } from '@/lib/tokens';
import type { Workspace } from '@/lib/types';

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

const NAV_NP: NavItem[] = [
  { href: '/np',            label: 'Home',       icon: Home },
  { href: '/np/volunteers', label: 'Volunteers', icon: Users,         matchPrefix: '/np/volunteers' },
  { href: '/np/partners',   label: 'Partners',   icon: Building2,     matchPrefix: '/np/partners' },
  { href: '/np/donations',  label: 'Donations',  icon: HeartHandshake, matchPrefix: '/np/donations' },
];

const workspaceFromPath = (pathname: string): Workspace => {
  if (pathname === '/np' || pathname.startsWith('/np/')) return 'food-bank-np';
  if (pathname === '/me' || pathname.startsWith('/me/')) return 'cloudmotion-employee';
  return 'cloudmotion-admin';
};

const isItemActive = (item: NavItem, pathname: string): boolean => {
  if (item.matchPrefix) return pathname === item.matchPrefix || pathname.startsWith(item.matchPrefix + '/');
  return pathname === item.href;
};

interface WorkspaceMeta {
  label: string;
  shortLabel: string;
  pillLabel: string;
  homeHref: string;
  navItems: NavItem[];
  avatar: { initials: string; ariaLabel: string };
}

const WORKSPACES: Record<Workspace, WorkspaceMeta> = {
  'cloudmotion-admin': {
    label: 'CloudMotion · Admin',
    shortLabel: 'Admin',
    pillLabel: 'CloudMotion · Admin',
    homeHref: '/',
    navItems: NAV_ADMIN,
    avatar: { initials: 'SC', ariaLabel: 'Sarah Chen' },
  },
  'cloudmotion-employee': {
    label: 'CloudMotion · Employee',
    shortLabel: 'Employee',
    pillLabel: 'My View',
    homeHref: '/me',
    navItems: NAV_EMP,
    avatar: { initials: 'SC', ariaLabel: 'Sarah Chen' },
  },
  'food-bank-np': {
    label: 'Greater Austin Food Bank',
    shortLabel: 'Nonprofit',
    pillLabel: 'Greater Austin Food Bank',
    homeHref: '/np',
    navItems: NAV_NP,
    avatar: { initials: 'MV', ariaLabel: 'Maria Velasquez' },
  },
};

const SWITCHER_ORDER: Workspace[] = [
  'cloudmotion-admin',
  'cloudmotion-employee',
  'food-bank-np',
];

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const workspace = workspaceFromPath(pathname);
  const meta = WORKSPACES[workspace];

  const switchWorkspace = (next: Workspace) => {
    if (next === workspace) return;
    router.push(WORKSPACES[next].homeHref);
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
            href={meta.homeHref}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/view-logo.png"
              alt=""
              width={32}
              height={32}
              style={{ display: 'block', flexShrink: 0 }}
            />
            <span style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: '-0.01em',
            }}>
              VIEW
            </span>
          </Link>

          {/* Workspace pill — full org name, neutral surface, no toggle */}
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
            {meta.pillLabel}
          </span>
        </div>

        {/* Tab-style nav */}
        <nav
          aria-label="Primary"
          style={{
            display: 'flex', alignItems: 'center', gap: 2,
          }}
        >
          {meta.navItems.map(item => {
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

        {/* Workspace switcher + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            role="group"
            aria-label="Switch workspace"
            style={{
              display: 'flex', padding: 2,
              borderRadius: 6,
              background: C.oat,
              border: `1px solid ${C.border}`,
            }}
          >
            {SWITCHER_ORDER.map(w => {
              const wmeta = WORKSPACES[w];
              const isCurrent = workspace === w;
              return (
                <button
                  key={w}
                  onClick={() => switchWorkspace(w)}
                  aria-pressed={isCurrent}
                  aria-label={`Switch to ${wmeta.label}`}
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  {wmeta.shortLabel}
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
            aria-label={meta.avatar.ariaLabel}
          >
            {meta.avatar.initials}
          </div>
        </div>
      </div>
    </header>
  );
}
