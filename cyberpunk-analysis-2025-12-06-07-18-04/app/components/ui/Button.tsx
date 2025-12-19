import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, leftIcon, rightIcon, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-zinc-700 hover:bg-zinc-600 text-white',
      ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-3 text-base rounded-lg'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={disabled}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
