import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  className?: string;
  maxWidth?: number;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  showArrow?: boolean;
  interactive?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  align = 'center',
  delay = 300,
  hideDelay = 100,
  disabled = false,
  className = '',
  maxWidth = 250,
  variant = 'default',
  showArrow = true,
  interactive = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [arrowCoords, setArrowCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = React.useId();

  // Variant styles
  const variants = {
    default: 'bg-[var(--surface-elevated)] border-[var(--border-primary)] text-[var(--text-primary)]',
    accent: 'bg-[var(--accent)] border-[var(--accent)] text-[var(--text-inverse)]',
    success: 'bg-[var(--success)] border-[var(--success)] text-[var(--text-inverse)]',
    warning: 'bg-[var(--warning)] border-[var(--warning)] text-[var(--text-inverse)]',
    error: 'bg-[var(--error)] border-[var(--error)] text-[var(--text-inverse)]',
  };

  // Arrow colors
  const arrowColors = {
    default: 'border-[var(--border-primary)]',
    accent: 'border-[var(--accent)]',
    success: 'border-[var(--success)]',
    warning: 'border-[var(--warning)]',
    error: 'border-[var(--error)]',
  };

  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const showTooltip = () => {
    if (disabled) return;

    clearAllTimeouts();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearAllTimeouts();
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const updatePosition = () => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const arrowSize = 6;
    const gap = 8;

    let x = 0;
    let y = 0;
    let arrowX = 0;
    let arrowY = 0;

    // Calculate position based on position prop
    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - gap;

        // Adjust for alignment
        if (align === 'start') {
          x = triggerRect.left;
        } else if (align === 'end') {
          x = triggerRect.right - tooltipRect.width;
        }

        arrowX = triggerRect.left + triggerRect.width / 2 - x - arrowSize / 2;
        arrowY = tooltipRect.height - 1;
        break;

      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + gap;

        // Adjust for alignment
        if (align === 'start') {
          x = triggerRect.left;
        } else if (align === 'end') {
          x = triggerRect.right - tooltipRect.width;
        }

        arrowX = triggerRect.left + triggerRect.width / 2 - x - arrowSize / 2;
        arrowY = -arrowSize + 1;
        break;

      case 'left':
        x = triggerRect.left - tooltipRect.width - gap;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;

        // Adjust for alignment
        if (align === 'start') {
          y = triggerRect.top;
        } else if (align === 'end') {
          y = triggerRect.bottom - tooltipRect.height;
        }

        arrowX = tooltipRect.width - 1;
        arrowY = triggerRect.top + triggerRect.height / 2 - y - arrowSize / 2;
        break;

      case 'right':
        x = triggerRect.right + gap;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;

        // Adjust for alignment
        if (align === 'start') {
          y = triggerRect.top;
        } else if (align === 'end') {
          y = triggerRect.bottom - tooltipRect.height;
        }

        arrowX = -arrowSize + 1;
        arrowY = triggerRect.top + triggerRect.height / 2 - y - arrowSize / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setCoords({ x, y });
    setArrowCoords({ x: arrowX, y: arrowY });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();

      // Add resize listener to update position on window resize
      const handleResize = () => updatePosition();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible, position, align]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const getArrowClass = () => {
    const baseClass = 'absolute w-0 h-0 border-solid';
    const colorClass = arrowColors[variant];

    switch (position) {
      case 'top':
        return `${baseClass} border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent border-t-[${arrowSize}px] border-t-[var(--surface-elevated)]`;
      case 'bottom':
        return `${baseClass} border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent border-b-[${arrowSize}px] border-b-[var(--surface-elevated)]`;
      case 'left':
        return `${baseClass} border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent border-l-[${arrowSize}px] border-l-[var(--surface-elevated)]`;
      case 'right':
        return `${baseClass} border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent border-r-[${arrowSize}px] border-r-[var(--surface-elevated)]`;
      default:
        return baseClass;
    }
  };

  const arrowSize = 6;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
        aria-describedby={isVisible && !disabled ? tooltipId : undefined}
      >
        {children}
      </div>

      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`
            fixed z-[var(--tooltip)]
            px-3 py-2 text-sm
            rounded-lg border
            shadow-[var(--shadow-lg)]
            pointer-events-none
            animate-in fade-in zoom-in-95
            duration-200 ease-out
            ${variants[variant]}
            ${!interactive && 'pointer-events-none'}
          `}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            maxWidth: `${maxWidth}px`,
          }}
          onMouseEnter={interactive ? () => clearAllTimeouts() : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          <div className="relative">
            <div className="max-w-xs break-words">
              {content}
            </div>

            {showArrow && (
              <div
                className={`
                  absolute w-0 h-0 border-solid
                  ${position === 'top' && `bottom-[-${arrowSize}px] left-[${arrowCoords.x}px] border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent border-t-[${arrowSize}px] border-t-[var(--surface-elevated)]`}
                  ${position === 'bottom' && `top-[-${arrowSize}px] left-[${arrowCoords.x}px] border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent border-b-[${arrowSize}px] border-b-[var(--surface-elevated)]`}
                  ${position === 'left' && `right-[-${arrowSize}px] top-[${arrowCoords.y}px] border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent border-l-[${arrowSize}px] border-l-[var(--surface-elevated)]`}
                  ${position === 'right' && `left-[-${arrowSize}px] top-[${arrowCoords.y}px] border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent border-r-[${arrowSize}px] border-r-[var(--surface-elevated)]`}
                `}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
