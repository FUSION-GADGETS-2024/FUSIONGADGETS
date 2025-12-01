export function WishlistSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-muted rounded w-3/4" />
                        <div className="h-6 bg-muted rounded w-1/2" />
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-muted rounded w-16" />
                            <div className="h-4 bg-muted rounded w-12" />
                        </div>
                        <div className="h-10 bg-muted rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
