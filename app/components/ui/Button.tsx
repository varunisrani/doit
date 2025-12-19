import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    // Base styles using design tokens
    const baseStyles = [
      // Layout
      'inline-flex items-center justify-center',
      'gap-2', // Consistent with CSS var(--space-2)

      // Typography
      'font-medium',
      'text-sm', // Base font size

      // Spacing & Sizing
      'min-h-[44px]', // WCAG touch target
      'px-4 py-2', // Default padding

      // Border & Radius
      'border',
      'rounded-md', // Consistent with CSS var(--md)

      // Transitions
      'transition-all duration-200',
      'ease-in-out',

      // Focus states
      'focus:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-[var(--focus-ring)]',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-offset-[var(--background)]',

      // Disabled states
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none',

      // Interactive states
      'relative overflow-hidden',
    ].join(' ');

    // Variant styles using design tokens
    const variants = {
      primary: [
        'bg-[var(--primary)]',
        'text-[var(--text-inverse)]',
        'border-[var(--primary)]',
        'hover:bg-[var(--primary-light)]',
        'hover:border-[var(--primary-light)]',
        'hover:shadow-lg',
        'hover:-translate-y-px',
        'active:bg-[var(--primary-dark)]',
        'active:border-[var(--primary-dark)]',
        'active:translate-y-0',
      ].join(' '),

      secondary: [
        'bg-[var(--surface)]',
        'text-[var(--text-primary)]',
        'border-[var(--border-primary)]',
        'hover:bg-[var(--surface-hover)]',
        'hover:border-[var(--border-secondary)]',
        'hover:shadow-md',
      ].join(' '),

      ghost: [
        'bg-transparent',
        'text-[var(--text-secondary)]',
        'border-transparent',
        'hover:bg-[var(--surface-hover)]',
        'hover:text-[var(--text-primary)]',
        'hover:border-transparent',
      ].join(' '),

      danger: [
        'bg-[var(--error)]',
        'text-[var(--text-inverse)]',
        'border-[var(--error)]',
        'hover:bg-[var(--error-light)]',
        'hover:border-[var(--error-light)]',
        'hover:shadow-lg',
        'hover:-translate-y-px',
        'active:bg-[var(--error)]',
        'active:border-[var(--error)]',
        'active:translate-y-0',
      ].join(' '),

      accent: [
        'bg-[var(--accent)]',
        'text-[var(--text-inverse)]',
        'border-[var(--accent)]',
        'hover:bg-[var(--accent-light)]',
        'hover:border-[var(--accent-light)]',
        'hover:shadow-lg',
        'hover:-translate-y-px',
        'active:bg-[var(--accent-dark)]',
        'active:border-[var(--accent-dark)]',
        'active:translate-y-0',
      ].join(' '),
    };

    // Size styles
    const sizes = {
      sm: [
        'px-3 py-1.5',
        'text-xs',
        'min-h-[36px]',
        'rounded-sm',
      ].join(' '),

      md: [
        'px-4 py-2',
        'text-sm',
        'min-h-[44px]',
        'rounded-md',
      ].join(' '),

      lg: [
        'px-6 py-3',
        'text-base',
        'min-h-[52px]',
        'rounded-lg',
      ].join(' '),

      xl: [
        'px-8 py-4',
        'text-lg',
        'min-h-[60px]',
        'rounded-xl',
      ].join(' '),
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const loadingState = loading ? 'cursor-wait opacity-75' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingState} ${className}`}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? 'loading-description' : undefined}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Loading description for screen readers */}
        {loading && (
          <span id="loading-description" className="sr-only">
            Loading, please wait...
          </span>
        )}

        {leftIcon}
        <span className="truncate">{children}</span>
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
