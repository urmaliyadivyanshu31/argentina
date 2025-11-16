'use client';

export default function Badge({ children, variant = 'default', className = '' }) {
  const baseClass = 'badge';
  const variantClass = {
    default: 'badge-default',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
  }[variant];

  return (
    <span className={`${baseClass} ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
