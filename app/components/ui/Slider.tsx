import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  showMinMax?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent' | 'success';
  showTooltip?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  showMinMax = false,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default',
  showTooltip = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const sliderId = React.useId();

  const percentage = ((value - min) / (max - min)) * 100;
  const isAtMin = value <= min;
  const isAtMax = value >= max;

  // Variant colors
  const variantColors = {
    default: 'var(--primary)',
    accent: 'var(--accent)',
    success: 'var(--success)',
  };

  // Size configurations
  const sizeConfigs = {
    sm: {
      trackHeight: 'h-1.5',
      thumbSize: 'w-3 h-3',
      thumbScale: 'scale-110',
      valueText: 'text-xs',
    },
    md: {
      trackHeight: 'h-2',
      thumbSize: 'w-4 h-4',
      thumbScale: 'scale-125',
      valueText: 'text-sm',
    },
    lg: {
      trackHeight: 'h-2.5',
      thumbSize: 'w-5 h-5',
      thumbScale: 'scale-125',
      valueText: 'text-base',
    },
  };

  const currentSize = sizeConfigs[size];
  const currentColor = variantColors[variant];

  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percent * (max - min);
    const steppedValue = Math.round(newValue / step) * step;

    const finalValue = Math.max(min, Math.min(max, steppedValue));
    onChange(finalValue);
  }, [min, max, step, onChange, disabled]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);

    // Focus the thumb for keyboard navigation
    thumbRef.current?.focus();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onChangeEnd?.(value);
    }
  }, [isDragging, onChangeEnd, value]);

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    const touch = e.touches[0];
    setIsDragging(true);
    updateValue(touch.clientX);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      updateValue(touch.clientX);
    }
  }, [isDragging, updateValue]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    const largeStep = (max - min) * 0.1; // 10% of range

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = e.shiftKey ? value + largeStep : value + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = e.shiftKey ? value - largeStep : value - step;
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      case 'PageUp':
        e.preventDefault();
        newValue = Math.min(max, value + largeStep);
        break;
      case 'PageDown':
        e.preventDefault();
        newValue = Math.max(min, value - largeStep);
        break;
    }

    if (newValue !== value) {
      onChange(Math.max(min, Math.min(max, Math.round(newValue / step) * step)));
    }
  };

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Format value display
  const formatValue = (val: number) => {
    if (Number.isInteger(val)) {
      return val.toString();
    }
    return val.toFixed(1);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label
              htmlFor={sliderId}
              className={`${currentSize.valueText} font-medium text-[var(--text-secondary)]`}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className={`${currentSize.valueText} font-mono text-[var(--text-primary)]`}>
              {formatValue(value)}
            </span>
          )}
        </div>
      )}

      {/* Slider Track */}
      <div
        className="relative select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          ref={sliderRef}
          className={`
            relative w-full ${currentSize.trackHeight} rounded-full
            bg-[var(--border-primary)]
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-colors duration-200
          `}
        >
          {/* Active Track */}
          <div
            className={`
              absolute top-0 left-0 h-full rounded-full
              bg-[${currentColor}]
              transition-all duration-200 ease-out
            `}
            style={{ width: `${percentage}%` }}
          />

          {/* Track Marks */}
          {showMinMax && (
            <>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-4 bg-[var(--border-secondary)] rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-4 bg-[var(--border-secondary)] rounded-full" />
            </>
          )}

          {/* Thumb */}
          <div
            ref={thumbRef}
            id={sliderId}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label || 'Slider'}
            className={`
              absolute top-1/2 -translate-y-1/2
              ${currentSize.thumbSize}
              bg-[var(--surface-elevated)]
              border-2 border-[${currentColor}]
              rounded-full
              shadow-md
              transition-all duration-200 ease-out
              ${!disabled && (isDragging || isHovered) ? `${currentSize.thumbScale} shadow-lg` : ''}
              ${!disabled && 'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]'}
              ${disabled && 'cursor-not-allowed opacity-50'}
            `}
            style={{
              left: `calc(${percentage}% - ${parseInt(currentSize.thumbSize.split(' ')[0].replace('w-', '')) * 2}px)`
            }}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => !disabled && setIsHovered(false)}
            onKeyDown={handleKeyDown}
          />

          {/* Tooltip */}
          {showTooltip && !disabled && (isDragging || isHovered) && (
            <div
              className={`
                absolute -top-8 left-1/2 -translate-x-1/2
                px-2 py-1
                bg-[var(--surface-elevated)]
                border border-[var(--border-primary)]
                rounded
                text-xs font-mono text-[var(--text-primary)]
                shadow-md
                pointer-events-none
                z-10
                animate-in fade-in slide-in-from-bottom-1
                duration-150
              `}
            >
              {formatValue(value)}
            </div>
          )}
        </div>
      </div>

      {/* Min/Max Labels */}
      {showMinMax && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[var(--text-tertiary)] font-mono">
            {formatValue(min)}
          </span>
          <span className="text-xs text-[var(--text-tertiary)] font-mono">
            {formatValue(max)}
          </span>
        </div>
      )}
    </div>
  );
};
