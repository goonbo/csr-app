import { Check } from 'lucide-react';
import { C } from '@/lib/tokens';

interface LoadingStepsProps {
  steps: string[];
  idx: number;
}

export function LoadingSteps({ steps, idx }: LoadingStepsProps) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      role="status"
      aria-live="polite"
    >
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'color 200ms ease',
            }}
          >
            {done ? (
              <div
                style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: C.sage,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                <Check size={9} color="white" strokeWidth={3} />
              </div>
            ) : active ? (
              <div
                style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${C.sage}`,
                  borderTopColor: 'transparent',
                  animation: 'spin 0.8s linear infinite',
                }}
                aria-hidden="true"
              />
            ) : (
              <div
                style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${C.borderStrong}`,
                }}
                aria-hidden="true"
              />
            )}
            <span style={{
              fontSize: 13,
              color: active ? C.ink : (done ? C.inkLight : C.muted),
              fontWeight: active ? 500 : 400,
            }}>
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}
