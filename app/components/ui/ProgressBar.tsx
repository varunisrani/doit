import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  showLabel?: boolean;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  showValue = true,
  label,
  animated = false,
  striped = false,
  indeterminate = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const progressId = React.useId();

  // Size configurations
  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  // Variant colors using design tokens
  const variants = {
    default: 'bg-[var(--primary)]',
    primary: 'bg-[var(--primary)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--error)]',
    accent: 'bg-[var(--accent)]',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header with label and value */}
      {(showLabel || showValue || label) && (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={progressId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label || 'Progress'}
          </label>
          {showValue && (
            <span className="text-sm font-mono text-[var(--text-primary)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        id={progressId}
        className={`
          relative w-full
          bg-[var(--border-primary)]
          rounded-full
          overflow-hidden
          ${sizes[size]}
        `}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        {/* Progress Fill */}
        <div
          className={`
            h-full rounded-full
            ${variants[variant]}
            transition-all duration-500 ease-out
            ${animated && 'animate-pulse'}
            ${striped && `
              relative overflow-hidden
              before:absolute before:inset-0
              before:bg-gradient-to-r
              before:from-transparent before:via-white/20 before:to-transparent
              before:translate-x-[-100%]
              ${animated && 'before:animate-[slide_2s_ease-in-out_infinite]'}
            `}
            ${indeterminate && `
              absolute inset-y-0 left-0
              animate-[indeterminate_1.5s_ease-in-out_infinite]
              bg-gradient-to-r
              from-transparent via-current to-transparent
              w-1/3
              ${variants[variant]}
            `}
          `}
          style={{
            width: indeterminate ? undefined : `${percentage}%`,
          }}
        />

        {/* Indeterminate animation keyframes */}
        {indeterminate && (
          <style jsx>{`
            @keyframes indeterminate {
              0% {
                left: -33.33%;
              }
              100% {
                left: 100%;
              }
            }
            @keyframes slide {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        )}
      </div>
    </div>
  );
};

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  showLabel?: boolean;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  showValue = true,
  label,
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const progressId = React.useId();

  // Variant colors using design tokens
  const variants = {
    default: 'stroke-[var(--primary)]',
    primary: 'stroke-[var(--primary)]',
    success: 'stroke-[var(--success)]',
    warning: 'stroke-[var(--warning)]',
    danger: 'stroke-[var(--error)]',
    accent: 'stroke-[var(--accent)]',
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Label */}
      {label && (
        <span className="text-sm font-medium text-[var(--text-secondary)] mb-2">
          {label}
        </span>
      )}

      {/* SVG Progress Circle */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Circular progress'}
        >
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-[var(--border-primary)]"
          />

          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`
              ${variants[variant]}
              transition-all duration-500 ease-out
              ${animated && 'animate-pulse'}
            `}
            style={{
              filter: 'drop-shadow(0 0 6px currentColor)',
            }}
          />
        </svg>

        {/* Center Content */}
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-[var(--text-primary)]">
              {showValue ? `${Math.round(percentage)}%` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
