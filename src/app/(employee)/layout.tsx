import { TopNav } from '@/components/layout/TopNav';

export default function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-theme="operator" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopNav />
      <main
        className="px-4 sm:px-6 md:px-8 py-8 md:py-10"
        style={{ maxWidth: 1280, margin: '0 auto' }}
      >
        {children}
      </main>
    </div>
  );
}
