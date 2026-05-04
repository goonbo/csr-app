import { TopNav } from '@/components/layout/TopNav';

export default function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-theme="pulse"
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient dot field — three radial gradients echoing the logo's particle motif */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: [
            'radial-gradient(900px circle at 18% 12%, rgba(34, 211, 238, 0.07), transparent 60%)',
            'radial-gradient(700px circle at 90% 80%, rgba(94, 234, 212, 0.06), transparent 55%)',
            'radial-gradient(circle at 25% 30%, rgba(94, 234, 212, 0.08) 1px, transparent 2px)',
            'radial-gradient(circle at 70% 60%, rgba(34, 211, 238, 0.08) 1px, transparent 2px)',
            'radial-gradient(circle at 50% 80%, rgba(94, 234, 212, 0.06) 1px, transparent 2px)',
          ].join(', '),
          backgroundSize:
            '100% 100%, 100% 100%, 280px 280px, 320px 320px, 220px 220px',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TopNav />
        <main
          className="px-4 sm:px-6 md:px-8 py-8 md:py-10"
          style={{ maxWidth: 1280, margin: '0 auto' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
