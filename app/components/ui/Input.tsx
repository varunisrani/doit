import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
  }, ref) => {
    const hasError = Boolean(error);
    const inputId = React.useId();

    // Container styles
    const containerStyles = [
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    // Label styles
    const labelStyles = [
      'block text-sm font-medium mb-2',
      hasError ? 'text-[var(--error)]' : 'text-[var(--text-secondary)]',
    ].join(' ');

    // Base input styles
    const baseInputStyles = [
      // Layout
      'w-full',

      // Typography
      'text-sm',
      'text-[var(--text-primary)]',
      'placeholder:text-[var(--text-tertiary)]',

      // Spacing & Sizing
      'min-h-[44px]', // WCAG touch target

      // Border & Radius
      'rounded-md',
      'border',

      // Transitions
      'transition-all duration-200',
      'ease-in-out',

      // Focus states
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-offset-[var(--background)]',

      // Disabled states
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',

      // Icon spacing
      leftIcon ? 'pl-11' : 'pl-4',
      rightIcon ? 'pr-11' : 'pr-4',
    ].join(' ');

    // Variant styles
    const variantStyles = {
      default: [
        'bg-[var(--surface)]',
        'border-[var(--border-primary)]',
        hasError
          ? 'focus:border-[var(--border-error)] focus:ring-[var(--error)]'
          : 'focus:border-[var(--border-focus)] focus:ring-[var(--focus-ring)]',
      ].join(' '),

      filled: [
        'bg-[var(--surface-hover)]',
        'border-transparent',
        'focus:bg-[var(--surface)]',
        hasError
          ? 'focus:border-[var(--border-error)] focus:ring-[var(--error)]'
          : 'focus:border-[var(--border-focus)] focus:ring-[var(--focus-ring)]',
      ].join(' '),

      outlined: [
        'bg-transparent',
        'border-[var(--border-primary)]',
        'focus:bg-[var(--surface)]',
        hasError
          ? 'focus:border-[var(--border-error)] focus:ring-[var(--error)]'
          : 'focus:border-[var(--border-focus)] focus:ring-[var(--focus-ring)]',
      ].join(' '),
    };

    // Size styles
    const sizeStyles = {
      sm: [
        'px-3 py-1.5',
        'text-xs',
        'min-h-[36px]',
        'rounded-sm',
        leftIcon ? 'pl-9' : 'pl-3',
        rightIcon ? 'pr-9' : 'pr-3',
      ].join(' '),

      md: [
        'px-4 py-2',
        'text-sm',
        'min-h-[44px]',
        'rounded-md',
      ].join(' '),

      lg: [
        'px-5 py-3',
        'text-base',
        'min-h-[52px]',
        'rounded-lg',
        leftIcon ? 'pl-13' : 'pl-5',
        rightIcon ? 'pr-13' : 'pr-5',
      ].join(' '),
    };

    // Icon container styles
    const iconContainerStyles = [
      'absolute top-1/2 -translate-y-1/2',
      'text-[var(--text-tertiary)]',
      'pointer-events-none',
      'z-10',
    ].join(' ');

    // Helper text styles
    const helperTextStyles = [
      'mt-1.5 text-xs',
      hasError ? 'text-[var(--error)]' : 'text-[var(--text-tertiary)]',
    ].join(' ');

    return (
      <div className={containerStyles}>
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
            {props.required && <span className="text-[var(--error)] ml-1" aria-label="required">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className={`${iconContainerStyles} left-4`}>
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`${baseInputStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className={`${iconContainerStyles} right-4`}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className={helperTextStyles} role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className={helperTextStyles}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
