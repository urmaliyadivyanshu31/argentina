'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      disabled = false,
      loading = false,
      onClick,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClass = 'btn';
    const variantClass = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
    }[variant];

    const sizeClass = {
      sm: 'btn-sm',
      default: '',
      lg: 'btn-lg',
    }[size];

    const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

    return (
      <motion.button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={disabled || loading}
        onClick={onClick}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
