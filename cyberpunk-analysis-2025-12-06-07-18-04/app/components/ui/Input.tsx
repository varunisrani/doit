import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth = false, className = '', ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-md text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${
              rightIcon ? 'pr-10' : ''
            } ${
              hasError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-700 focus:ring-blue-500'
            }`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={`mt-1.5 text-xs ${error ? 'text-red-500' : 'text-zinc-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
