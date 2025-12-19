import React from 'react';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  active?: boolean;
  loading?: boolean;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  showRipple?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({
    icon,
    variant = 'default',
    size = 'md',
    active = false,
    loading = false,
    tooltip,
    tooltipPosition = 'top',
    showRipple = false,
    className = '',
    disabled,
    children,
    ...props
  }, ref) => {
    const buttonId = React.useId();

    // Base styles using design tokens
    const baseStyles = [
      // Layout
      'inline-flex items-center justify-center',
      'relative',
      'overflow-hidden',

      // Border & Radius
      'rounded-lg',

      // Transitions
      'transition-all duration-200 ease-in-out',

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
      'group',
    ].join(' ');

    // Variant styles using design tokens
    const variants = {
      default: active
        ? [
            'bg-[var(--primary)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--primary)]',
            'shadow-md',
          ].join(' ')
        : [
            'bg-[var(--surface)]',
            'text-[var(--text-secondary)]',
            'border border-[var(--border-primary)]',
            'hover:bg-[var(--surface-hover)]',
            'hover:text-[var(--text-primary)]',
            'hover:border-[var(--border-secondary)]',
            'hover:shadow-md',
          ].join(' '),

      primary: active
        ? [
            'bg-[var(--primary-dark)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--primary-dark)]',
            'shadow-lg',
          ].join(' ')
        : [
            'bg-[var(--primary)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--primary)]',
            'hover:bg-[var(--primary-light)]',
            'hover:border-[var(--primary-light)]',
            'hover:shadow-lg',
            'hover:-translate-y-px',
          ].join(' '),

      secondary: active
        ? [
            'bg-[var(--surface-hover)]',
            'text-[var(--text-primary)]',
            'border border-[var(--border-secondary)]',
          ].join(' ')
        : [
            'bg-[var(--surface)]',
            'text-[var(--text-primary)]',
            'border border-[var(--border-primary)]',
            'hover:bg-[var(--surface-hover)]',
            'hover:border-[var(--border-secondary)]',
          ].join(' '),

      accent: active
        ? [
            'bg-[var(--accent-dark)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--accent-dark)]',
            'shadow-lg',
          ].join(' ')
        : [
            'bg-[var(--accent)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--accent)]',
            'hover:bg-[var(--accent-light)]',
            'hover:border-[var(--accent-light)]',
            'hover:shadow-lg',
            'hover:-translate-y-px',
          ].join(' '),

      danger: active
        ? [
            'bg-[var(--error)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--error)]',
            'shadow-lg',
          ].join(' ')
        : [
            'bg-[var(--error)]',
            'text-[var(--text-inverse)]',
            'border border-[var(--error)]',
            'hover:bg-[var(--error-light)]',
            'hover:border-[var(--error-light)]',
            'hover:shadow-lg',
            'hover:-translate-y-px',
          ].join(' '),

      ghost: active
        ? [
            'bg-[var(--surface-hover)]',
            'text-[var(--text-primary)]',
            'border border-transparent',
          ].join(' ')
        : [
            'bg-transparent',
            'text-[var(--text-secondary)]',
            'border border-transparent',
            'hover:bg-[var(--surface-hover)]',
            'hover:text-[var(--text-primary)]',
          ].join(' '),
    };

    // Size configurations with WCAG touch targets
    const sizes = {
      xs: [
        'w-8 h-8 min-w-[32px] min-h-[32px]', // Touch target
        'p-1.5',
      ].join(' '),

      sm: [
        'w-10 h-10 min-w-[40px] min-h-[40px]', // Touch target
        'p-2',
      ].join(' '),

      md: [
        'w-12 h-12 min-w-[48px] min-h-[48px]', // Touch target
        'p-2.5',
      ].join(' '),

      lg: [
        'w-14 h-14 min-w-[56px] min-h-[56px]', // Touch target
        'p-3',
      ].join(' '),

      xl: [
        'w-16 h-16 min-w-[64px] min-h-[64px]', // Touch target
        'p-4',
      ].join(' '),
    };

    // Icon sizes
    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    const buttonElement = (
      <button
        id={buttonId}
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        aria-label={props['aria-label'] || tooltip}
        aria-busy={loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="absolute animate-spin"
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

        {/* Icon */}
        <span className={`${iconSizes[size]} ${loading ? 'opacity-0' : ''} transition-opacity duration-200`}>
          {icon}
        </span>

        {/* Badge for notifications */}
        {children && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--error)] text-[var(--text-inverse)] text-xs font-bold rounded-full flex items-center justify-center">
            {children}
          </span>
        )}

        {/* Ripple effect */}
        {showRipple && (
          <span className="absolute inset-0 rounded-lg overflow-hidden">
            <span className="absolute inset-0 bg-[var(--text-primary)] opacity-0 group-active:opacity-20 transition-opacity duration-300" />
          </span>
        )}
      </button>
    );

    // Wrap with tooltip if provided
    if (tooltip) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  }
);

IconButton.displayName = 'IconButton';
