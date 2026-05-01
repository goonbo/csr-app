// Color tokens — accessibility-audited.
// Body text: 4.5:1 minimum on every surface it appears on.
// Buttons: white-on-fill 4.5:1 minimum.
// Pills: text-on-glow 4.5:1 minimum.
//
// CRITICAL: never use these inside dynamic Tailwind classes like `bg-[${C.sage}]`.
// The Tailwind compiler can't resolve template literals and the class never gets generated.
// Use inline `style={{ background: C.sage }}` instead.

export const C = {
  // Surfaces
  cream:    '#F8F4ED', // app background — warm off-white
  oat:      '#F3EDE0', // soft-fill surfaces
  paper:    '#FFFFFF', // emphasis surfaces, recap document

  // Brand
  sage:     '#3F5A3F', // primary — darkened for AA on white text (was #5A7D5A)
  sageLight:'#5A7D5A', // hover state on primary
  sageGlow: '#DCE9D7', // tinted background for AI cards
  sageDeep: '#2A3D2A', // text color on sage-glow backgrounds (9.27:1)

  // Accent
  terracotta:    '#A0533C', // primary CTA — darkened for AA on white text
  terracottaGlow:'#F5E1D6',
  terracottaDeep:'#7A3F2D', // text color on terracotta-glow backgrounds

  // Type
  ink:        '#1F1B16', // primary text — 15.6:1 on cream
  inkLight:   '#4A443B', // body text — 8.78:1 on cream
  muted:      '#6B6457', // secondary text — 5.34:1 on cream
  mutedLight: '#857F71', // tertiary, large-text only — 3.63:1 on cream

  // Structure
  border:       '#E0D5C0', // subtle decorative borders
  borderStrong: '#9C8E70', // structural borders (close to 3:1 on cream)

  // Functional
  rose: '#A33333', // alert / error
  amber:'#A87E2E', // warning, darker for accessibility

  // Focus ring
  focus: '#A0533C', // terracotta — high contrast for keyboard users
} as const;
