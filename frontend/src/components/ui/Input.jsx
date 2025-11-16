'use client';

import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`.trim()}>
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? 'border-red-500' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <p className="error-text">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-small text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
