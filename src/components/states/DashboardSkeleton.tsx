export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-14 rounded-xl bg-muted animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-28 rounded-2xl bg-muted animate-pulse" />
        <div className="h-28 rounded-2xl bg-muted animate-pulse" />
        <div className="h-28 rounded-2xl bg-muted animate-pulse" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-96 rounded-2xl bg-muted animate-pulse" />
        <div className="h-96 rounded-2xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}
