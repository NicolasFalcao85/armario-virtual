export function SkeletonCard() {
  return (
    <div className="garment-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="garment-info">
        <div className="skeleton skeleton-line" style={{ width: '70%' }} />
        <div className="skeleton skeleton-line" style={{ width: '45%' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <div className="garment-grid">
      {Array.from({ length: cantidad }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
