"use client";

/**
 * TopNav — workspace chrome.
 *
 * Three responsibilities:
 *   1. Brand mark + active-workspace pill (left)
 *   2. Tab nav for the active workspace (center)
 *   3. Workspace switcher + avatar (right)
 *
 * The workspace itself is derived from the current pathname:
 * `/me/*` → cloudmotion-employee, `/np/*` → food-bank-np,
 * everything else → cloudmotion-admin. Switching navigates to the
 * home of the chosen workspace; the route-group layouts handle the
 * `data-theme` flip from there.
 *
 * Stays Operator chrome on Operator/Blueprint workspaces and Field
 * chrome on the nonprofit workspace via the cascading theme variables.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home, Heart, Calendar, BarChart3,
  Users, Building2, HandCoins,
  type LucideIcon,
} from "lucide-react";
import type { Workspace } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** When set, the item is active for any pathname starting with this prefix. */
  matchPrefix?: string;
}

interface WorkspaceConfig {
  id: Workspace;
  /** Switcher label — single word. */
  switcherLabel: string;
  /** Pill label shown next to the brand mark. */
  contextLabel: string;
  /** Where the switcher routes to. */
  homeRoute: string;
  /** User initials in the avatar. */
  avatarInitials: string;
  /** Tab items shown for this workspace. */
  nav: readonly NavItem[];
}

const WORKSPACES: Record<Workspace, WorkspaceConfig> = {
  "cloudmotion-admin": {
    id: "cloudmotion-admin",
    switcherLabel: "Admin",
    contextLabel: "CloudMotion · Admin",
    homeRoute: "/",
    avatarInitials: "SC",
    nav: [
      { href: "/",         label: "Home",     icon: Home },
      { href: "/partners", label: "Partners", icon: Heart,    matchPrefix: "/partners" },
      { href: "/events",   label: "Events",   icon: Calendar, matchPrefix: "/events" },
      { href: "/reports",  label: "Reports",  icon: BarChart3 },
    ],
  },
  "cloudmotion-employee": {
    id: "cloudmotion-employee",
    switcherLabel: "Employee",
    contextLabel: "My View",
    homeRoute: "/me",
    avatarInitials: "SC",
    nav: [
      { href: "/me",                label: "My Home",       icon: Home },
      { href: "/me/opportunities",  label: "Opportunities", icon: Heart,     matchPrefix: "/me/opportunities" },
      { href: "/me/profile",        label: "My Impact",     icon: BarChart3, matchPrefix: "/me/profile" },
    ],
  },
  "food-bank-np": {
    id: "food-bank-np",
    switcherLabel: "Nonprofit",
    contextLabel: "Greater Austin Food Bank",
    homeRoute: "/np",
    avatarInitials: "MV",
    nav: [
      { href: "/np",            label: "Home",       icon: Home },
      { href: "/np/volunteers", label: "Volunteers", icon: Users,     matchPrefix: "/np/volunteers" },
      { href: "/np/partners",   label: "Partners",   icon: Building2, matchPrefix: "/np/partners" },
      { href: "/np/donations",  label: "Donations",  icon: HandCoins, matchPrefix: "/np/donations" },
    ],
  },
};

const SWITCHER_ORDER: readonly Workspace[] = [
  "cloudmotion-admin",
  "cloudmotion-employee",
  "food-bank-np",
];

function workspaceFromPath(pathname: string): Workspace {
  if (pathname === "/np" || pathname.startsWith("/np/")) return "food-bank-np";
  if (pathname === "/me" || pathname.startsWith("/me/")) return "cloudmotion-employee";
  return "cloudmotion-admin";
}

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) {
    return pathname === item.matchPrefix || pathname.startsWith(item.matchPrefix + "/");
  }
  return pathname === item.href;
}

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const workspace = workspaceFromPath(pathname);
  const config = WORKSPACES[workspace];

  return (
    <header
      data-slot="top-nav"
      className={cn(
        "sticky top-0 z-30",
        "border-b border-border bg-background/80 backdrop-blur",
        "px-4 sm:px-6 md:px-8",
      )}
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 py-3 md:gap-6">
        {/* Brand + workspace pill */}
        <div className="flex items-center gap-3">
          <Link
            href={config.homeRoute}
            aria-label="VIEW home"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/view-logo.png"
              alt=""
              width={32}
              height={32}
              className="block shrink-0"
            />
            <span className="text-sm font-bold tracking-tight text-foreground">VIEW</span>
          </Link>
          <span
            data-slot="workspace-pill"
            className="hidden md:inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {config.contextLabel}
          </span>
        </div>

        {/* Tab nav */}
        <nav aria-label="Primary" className="flex items-center gap-1">
          {config.nav.map((item) => {
            const active = isItemActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5",
                  "text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Workspace switcher + avatar */}
        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Switch workspace"
            data-slot="workspace-switcher"
            className="flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5"
          >
            {SWITCHER_ORDER.map((id) => {
              const isCurrent = workspace === id;
              const target = WORKSPACES[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (!isCurrent) router.push(target.homeRoute);
                  }}
                  aria-pressed={isCurrent}
                  className={cn(
                    "rounded px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    isCurrent
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {target.switcherLabel}
                </button>
              );
            })}
          </div>
          <Avatar className="size-8 ring-1 ring-border">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-[11px] font-bold text-primary-foreground">
              {config.avatarInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export { WORKSPACES };
