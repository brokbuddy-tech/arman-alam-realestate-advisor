import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main role="status" aria-live="polite" aria-busy="true" className="site-surface min-h-screen px-4 pb-12 pt-28 sm:px-6">
      <div className="glass-panel mx-auto flex max-w-7xl items-center gap-3 p-5 text-sm text-neutral-600"><LoaderCircle className="h-5 w-5 animate-spin text-emerald-900" />Loading properties…</div>
    </main>
  );
}
