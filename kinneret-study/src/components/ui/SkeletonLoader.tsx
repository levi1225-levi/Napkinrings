interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'circle' | 'bar';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const defaultDimensions: Record<string, { width: string; height: string; borderRadius: string }> = {
  text: { width: '100%', height: '14px', borderRadius: '6px' },
  card: { width: '100%', height: '120px', borderRadius: '16px' },
  circle: { width: '48px', height: '48px', borderRadius: '50%' },
  bar: { width: '100%', height: '32px', borderRadius: '8px' },
};

function SkeletonItem({
  variant = 'text',
  width,
  height,
  className = '',
}: Omit<SkeletonLoaderProps, 'count'>) {
  const defaults = defaultDimensions[variant];

  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width: width ?? defaults.width,
        height: height ?? defaults.height,
        borderRadius: defaults.borderRadius,
        background: 'linear-gradient(90deg, var(--bg-overlay) 25%, var(--bg-elevated) 50%, var(--bg-overlay) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: SkeletonLoaderProps) {
  if (count <= 1) {
    return (
      <SkeletonItem
        variant={variant}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonItem
          key={i}
          variant={variant}
          width={width}
          height={height}
          className={className}
        />
      ))}
    </div>
  );
}
