export function ProfileSkeleton() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/4 mb-8 animate-pulse" />

            <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-6" />

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-muted rounded w-1/4" />
                            <div className="h-10 bg-muted rounded" />
                        </div>
                    ))}
                    <div className="h-10 bg-muted rounded w-32 mt-6" />
                </div>
            </div>
        </div>
    );
}
