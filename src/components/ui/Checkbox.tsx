import React, { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <div className="flex items-center">
        <input
          id={inputId}
          type="checkbox"
          className={`
            h-5 w-5 rounded border-2 transition-all duration-200 cursor-pointer
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
            text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-150"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Checkbox;
