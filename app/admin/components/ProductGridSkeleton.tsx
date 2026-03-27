'use client';

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-neutral-200 shadow-sm overflow-hidden animate-pulse"
          data-testid="skeleton-card"
        >
          {/* Image placeholder */}
          <div className="aspect-square bg-neutral-200" />

          {/* Content placeholder */}
          <div className="p-4 space-y-3">
            {/* Badge placeholder */}
            <div className="h-5 w-20 bg-neutral-200 rounded-full" />
            {/* Name placeholder */}
            <div className="h-4 w-3/4 bg-neutral-200 rounded" />
            {/* Price placeholder */}
            <div className="h-4 w-1/3 bg-neutral-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
