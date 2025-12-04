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
      className="absolute"
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
          w-3 h-3 cursor-move transition-all
          ${selected ? 'scale-125' : 'scale-100'}
          ${isDragging ? 'scale-150' : ''}
        `}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      >
        <svg viewBox="0 0 12 12" className="w-full h-full">
          <path
            d="M 6 0 L 12 6 L 6 12 L 0 6 Z"
            fill={selected ? '#3b82f6' : '#8b5cf6'}
            stroke={selected ? '#1d4ed8' : '#6d28d9'}
            strokeWidth="1"
            className="transition-colors"
          />
        </svg>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                     bg-gray-900 text-white text-xs rounded px-2 py-1.5
                     whitespace-nowrap pointer-events-none shadow-lg z-50"
        >
          <div className="font-semibold mb-0.5">
            {formatTime(keyframe.time)}
          </div>
          <div className="text-gray-300">
            Value: {formatValue(keyframe.value, keyframe.property)}
          </div>
          <div className="text-gray-400 text-[10px] mt-0.5">
            {easingLabels[keyframe.easing]}
          </div>
          {/* Tooltip Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full
                       w-0 h-0 border-l-4 border-r-4 border-t-4
                       border-transparent border-t-gray-900"
          />
        </div>
      )}
    </div>
  );
};
