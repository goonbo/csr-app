import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { C } from '@/lib/tokens';

interface PlaceholderProps {
  title: string;
  greeting?: string;
  subtitle?: string;
  body?: string;
}

export function Placeholder({
  title,
  greeting,
  subtitle = 'Phase 1 scaffold — this screen lands in a later phase.',
  body = 'When you see this, the route, layout, fonts, and TopNav are all wired up. The screen content arrives next.',
}: PlaceholderProps) {
  return (
    <div>
      <PageHeader greeting={greeting} title={title} subtitle={subtitle} />
      <Card style={{ padding: 32 }}>
        <p style={{ fontSize: 14, color: C.inkLight, lineHeight: 1.6, margin: 0 }}>
          {body}
        </p>
      </Card>
    </div>
  );
}
