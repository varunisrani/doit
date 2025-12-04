import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  tooltip?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'default', size = 'md', active = false, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: active
        ? 'bg-zinc-700 text-white'
        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white',
      primary: active
        ? 'bg-blue-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white',
      danger: active
        ? 'bg-red-700 text-white'
        : 'bg-red-600 hover:bg-red-700 text-white',
      ghost: active
        ? 'bg-zinc-800 text-white'
        : 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white'
    };

    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        <span className={iconSizes[size]}>
          {icon}
        </span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
