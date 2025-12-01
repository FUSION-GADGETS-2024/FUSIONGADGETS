// Server Component - Product Row Skeleton for Suspense fallback
export function ProductRowSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-3 animate-pulse">
            <div className="aspect-square bg-surface rounded-lg mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-surface rounded w-1/4" />
              <div className="h-4 bg-surface rounded w-3/4" />
              <div className="h-3 bg-surface rounded w-1/2" />
              <div className="h-5 bg-surface rounded w-1/3" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-3 bg-surface rounded w-1/4" />
                <div className="h-9 bg-surface rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
