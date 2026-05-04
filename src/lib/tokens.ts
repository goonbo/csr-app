// Color tokens — proxies for theme CSS variables defined in globals.css.
//
// The active theme is set via `[data-theme]` on a wrapper element
// (Operator is the :root default; Blueprint and Pulse are wrappers).
// All hex values live in globals.css; this file only names them.
//
// Legacy keys (cream/sage/terracotta/etc.) kept so existing call sites
// continue to work. They map onto the new semantic vars below.

export const C = {
  // Surfaces
  cream:    'var(--bg)',       // app background
  oat:      'var(--soft)',     // soft fills, panels
  paper:    'var(--surface)',  // emphasis surface, cards

  // Brand (was sage) → primary action / focus / AI signal
  sage:      'var(--accent)',
  sageLight: 'var(--accent-hover)',
  sageGlow:  'var(--accent-glow)',
  sageDeep:  'var(--accent-deep)',

  // Accent (was terracotta) — same cyan in the new system; alias retained
  terracotta:     'var(--accent)',
  terracottaGlow: 'var(--accent-glow)',
  terracottaDeep: 'var(--accent-deep)',

  // Type
  ink:        'var(--ink)',
  inkLight:   'var(--ink-light)',
  muted:      'var(--ink-muted)',
  mutedLight: 'var(--ink-faint)',

  // Structure
  border:       'var(--border)',
  borderStrong: 'var(--border-strong)',

  // Functional
  rose: 'var(--rose)',
  amber:'var(--amber)',

  // Focus ring
  focus: 'var(--focus)',
} as const;
