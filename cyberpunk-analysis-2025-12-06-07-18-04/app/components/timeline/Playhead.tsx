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
      {/* Playhead line */}
      <div className="relative w-0 h-full">
        <div className="absolute top-0 left-0 w-0.5 h-full bg-red-500 shadow-lg" />
      </div>

      {/* Playhead handle */}
      <div
        className="absolute -top-1 -left-3 w-6 h-6 pointer-events-auto cursor-ew-resize group"
        onMouseDown={handleMouseDown}
      >
        {/* Triangle handle */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="drop-shadow-md"
        >
          <path
            d="M12 2 L20 10 L12 10 L4 10 Z"
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth="1"
          />
        </svg>

        {/* Time tooltip */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {formatTime(currentTime * 1000)}
        </div>
      </div>
    </div>
  );
}
