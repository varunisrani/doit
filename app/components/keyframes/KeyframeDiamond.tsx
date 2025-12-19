'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Keyframe } from '@/app/lib/effects/animations';
import { easingLabels } from '@/app/lib/effects/easing';

interface KeyframeDiamondProps {
  keyframe: Keyframe;
  selected: boolean;
  pixelsPerMs: number;
  onSelect: (keyframeId: string) => void;
  onMove: (keyframeId: string, newTime: number) => void;
  onDelete: (keyframeId: string) => void;
  trackWidth: number;
}

export const KeyframeDiamond: React.FC<KeyframeDiamondProps> = ({
  keyframe,
  selected,
  pixelsPerMs,
  onSelect,
  onMove,
  onDelete,
  trackWidth,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dragStartX = useRef(0);
  const initialTime = useRef(0);

  const position = keyframe.time * pixelsPerMs;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click - start dragging
      e.stopPropagation();
      setIsDragging(true);
      dragStartX.current = e.clientX;
      initialTime.current = keyframe.time;
      onSelect(keyframe.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(keyframe.id);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;
      const deltaTime = deltaX / pixelsPerMs;
      const newTime = Math.max(0, initialTime.current + deltaTime);
      onMove(keyframe.id, Math.round(newTime));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, keyframe.id, onMove, pixelsPerMs]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  const formatValue = (value: number, property: string): string => {
    if (property === 'opacity') {
      return `${(value * 100).toFixed(0)}%`;
    }
    if (property === 'rotation') {
      return `${value.toFixed(1)}°`;
    }
    if (property === 'scaleX' || property === 'scaleY') {
      return `${value.toFixed(2)}x`;
    }
    return `${value.toFixed(0)}px`;
  };

  return (
    <div
      className="absolute group"
      style={{
        left: `${position}px`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: selected ? 20 : 10,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Keyframe Diamond */}
      <div
        className={`
          w-4 h-4 cursor-move transition-all duration-200 transform
          ${selected ? 'scale-125' : 'scale-100 hover:scale-110'}
          ${isDragging ? 'scale-150' : ''}
        `}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(keyframe.id);
          } else if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            onDelete(keyframe.id);
          }
        }}
        aria-label={`Keyframe at ${formatTime(keyframe.time)} for ${keyframe.property}`}
        aria-selected={selected}
      >
        <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-sm">
          <path
            d="M 8 2 L 14 8 L 8 14 L 2 8 Z"
            fill={selected ? '#3b82f6' : '#8b5cf6'}
            stroke={selected ? '#1e40af' : '#6d28d9'}
            strokeWidth="1.5"
            className="transition-all duration-200"
            filter={selected ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5)))' : 'none'}
          />
          {selected && (
            <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.8" />
          )}
        </svg>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3
                     bg-zinc-900 text-white text-xs rounded-lg px-3 py-2.5
                     whitespace-nowrap pointer-events-none shadow-xl z-50
                     border border-zinc-700 backdrop-blur-sm"
        >
          <div className="font-semibold mb-1 text-blue-400">
            {formatTime(keyframe.time)}
          </div>
          <div className="text-zinc-300 text-xs">
            Value: <span className="font-medium text-zinc-200">{formatValue(keyframe.value, keyframe.property)}</span>
          </div>
          <div className="text-zinc-400 text-[10px] mt-1 italic">
            {easingLabels[keyframe.easing]}
          </div>
          {/* Tooltip Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full
                       w-0 h-0 border-l-4 border-r-4 border-t-4
                       border-transparent border-t-zinc-700"
          />
        </div>
      )}

      {/* Focus Ring for Accessibility */}
      {selected && (
        <div
          className="absolute inset-0 w-6 h-6 -m-1 rounded-full
                     border-2 border-blue-400 border-opacity-50
                     pointer-events-none animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
};
