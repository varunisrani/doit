'use client';

import { useRef, useCallback } from 'react';
import { formatTime } from '../../lib/timeline/timeUtils';

interface PlayheadProps {
  currentTime: number; // in seconds
  zoom: number; // pixels per second
  height: number;
  onDrag: (time: number) => void;
}

export function Playhead({ currentTime, zoom, height, onDrag }: PlayheadProps) {
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;

      const rect = containerRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const x = moveEvent.clientX - rect.left;
      const newTime = Math.max(0, x / zoom);
      onDrag(newTime);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [zoom, onDrag]);

  const leftPosition = currentTime * zoom;

  return (
    <div
      ref={containerRef}
      className="absolute top-0 z-50 pointer-events-none"
      style={{
        left: `${leftPosition}px`,
        height: `${height}px`,
      }}
    >
      {/* Playhead line with glow effect */}
      <div className="relative w-full h-full">
        {/* Main line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full transition-all duration-100"
          style={{
            background: 'var(--playhead)',
            boxShadow: `0 0 6px var(--playhead), 0 0 12px var(--playhead)60`,
          }}
        />

        {/* Animated pulse effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full animate-pulse opacity-30"
          style={{
            background: 'var(--playhead)',
          }}
        />
      </div>

      {/* Playhead handle */}
      <div
        className="absolute -top-2 -left-4 w-8 h-8 pointer-events-auto cursor-ew-resize group"
        onMouseDown={handleMouseDown}
      >
        {/* Diamond handle with modern design */}
        <div
          className="absolute inset-0 transform rotate-45 transition-all duration-200 group-hover:scale-110"
          style={{
            background: 'var(--playhead)',
            boxShadow: `0 2px 8px var(--playhead)60, 0 0 0 1px var(--playhead)40`,
          }}
        />

        {/* Inner diamond for visual depth */}
        <div
          className="absolute inset-1 transform rotate-45"
          style={{
            background: 'var(--playhead)',
            opacity: 0.8,
          }}
        />

        {/* Time tooltip */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-mono rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none"
          style={{
            background: 'var(--surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateX(-50%) translateY(4px)',
          }}
        >
          {formatTime(currentTime * 1000)}
        </div>

        {/* Hover state indicator */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: 'var(--playhead)',
            opacity: 0.2,
          }}
        />
      </div>
    </div>
  );
}
