'use client';

export default function Skeleton({ className = '', width, height }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={style}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="20px" className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="40px" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
