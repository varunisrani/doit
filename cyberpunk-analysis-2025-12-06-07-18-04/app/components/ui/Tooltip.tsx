import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      setCoords({ x, y });
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-zinc-700 border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'top-[-4px] left-1/2 -translate-x-1/2 border-b-zinc-700 border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-[-4px] top-1/2 -translate-y-1/2 border-l-zinc-700 border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'left-[-4px] top-1/2 -translate-y-1/2 border-r-zinc-700 border-t-transparent border-b-transparent border-l-transparent';
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="fixed z-[9999] px-3 py-2 bg-zinc-700 border border-zinc-600 text-white text-xs rounded shadow-lg pointer-events-none animate-in fade-in duration-200"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`
          }}
        >
          {content}
          <div className={`absolute w-2 h-2 border-4 ${getArrowPosition()}`} />
        </div>
      )}
    </>
  );
};
