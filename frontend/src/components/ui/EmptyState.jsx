'use client';

import { motion } from 'framer-motion';

export default function EmptyState({ title, description, action, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-title mb-2">{title}</h3>
      {description && (
        <p className="text-small text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}
