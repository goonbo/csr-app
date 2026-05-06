import Link from "next/link";

/**
 * Phase 1 root page — placeholder during the shadcn rebuild.
 * The real workbench lands in Phase 4 once domain primitives exist.
 */
export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          VIEW · shadcn rebuild · Phase 1
        </p>
        <h1 className="font-sans text-3xl font-semibold tracking-tight">
          Foundation only.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Token system, fonts, and theme scopes land in Phase 1.
          Domain primitives in Phase 2; routes in Phase 4.
        </p>
        <Link
          href="/swatches"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Theme swatches →
        </Link>
      </div>
    </main>
  );
}
