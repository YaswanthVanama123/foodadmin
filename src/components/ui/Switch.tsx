import React from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  enabled,
  onChange,
  label,
  error,
  helperText,
  disabled = false,
  className = '',
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <HeadlessSwitch
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
            ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
            ${className}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
              ${enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </HeadlessSwitch>
        {label && (
          <label className="ml-3 block text-sm font-medium text-gray-700">
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

export default Switch;
