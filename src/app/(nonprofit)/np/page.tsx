import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { C } from '@/lib/tokens';

export default function NonprofitHomePage() {
  return (
    <div>
      <PageHeader
        greeting="Good morning, Maria"
        title="The week ahead."
        subtitle="A workspace for Greater Austin Food Bank — volunteers, corporate partners, donations. Workbench coming together over the next phases."
      />

      <Card style={{ padding: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: C.sageDeep,
          marginBottom: 12,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: C.sage,
            boxShadow: `0 0 0 3px ${C.sageGlow}`,
          }} aria-hidden="true" />
          Field theme · phase 1 placeholder
        </div>
        <h2 style={{
          fontFamily: 'var(--font-h1), sans-serif',
          fontSize: 22, fontWeight: 600,
          color: C.ink, margin: 0,
          letterSpacing: '-0.015em',
        }}>
          Switcher works, theme works, route resolves.
        </h2>
        <p style={{
          fontSize: 14, color: C.muted, lineHeight: 1.6,
          margin: '10px 0 0', maxWidth: 560,
        }}>
          The next phase wires up the ViewSourcePill primitive, then the five
          screens go in: workbench home, volunteer list and detail, corporate
          partners, donations, and a nonprofit-side recap.
        </p>
      </Card>
    </div>
  );
}
