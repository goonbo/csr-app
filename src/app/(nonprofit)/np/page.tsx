import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
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

      {/* Phase 2 visual smoke-test — remove when consumers land */}
      <div style={{ marginTop: 20 }}>
        <Card style={{ padding: 24 }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: C.muted, marginBottom: 12,
          }}>
            ViewSourcePill — Phase 2 primitive
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: C.ink }}>
              Maria Velasquez
            </span>
            <ViewSourcePill partner="CloudMotion" />
            <span style={{ fontSize: 13, color: C.ink, marginLeft: 16 }}>
              Hours
            </span>
            <ViewSourcePill partner="CloudMotion" size="sm" />
            <span style={{ fontSize: 13, color: C.ink, marginLeft: 16 }}>
              Generic
            </span>
            <ViewSourcePill />
            <ViewSourcePill label="auto-confirmed" hideIcon size="sm" />
          </div>
        </Card>
      </div>
    </div>
  );
}
