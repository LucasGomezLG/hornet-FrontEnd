function Shimmer({ className = '' }) {
  return (
    <div
      className={`rounded-sm ${className}`}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-neutral-200 bg-white flex flex-col">
      <Shimmer className="aspect-square w-full" />
      <div className="p-3 flex flex-col gap-2">
        <Shimmer className="h-3 w-1/3" />
        <Shimmer className="h-4 w-4/5" />
        <Shimmer className="h-4 w-3/5" />
        <Shimmer className="h-6 w-2/5 mt-2" />
        <Shimmer className="h-3 w-1/4" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
