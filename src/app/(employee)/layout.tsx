import { TopNav } from "@/components/view/TopNav";

export default function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-theme="operator" className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
