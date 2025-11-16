'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  elevated = false,
  hoverable = false,
  ...props
}) {
  const baseClass = 'card';
  const elevatedClass = elevated ? 'card-elevated' : '';
  const combinedClassName = `${baseClass} ${elevatedClass} ${className}`.trim();

  if (hoverable) {
    return (
      <motion.div
        className={combinedClassName}
        whileHover={{ borderColor: 'var(--color-gray-400)' }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
