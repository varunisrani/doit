'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Transition,
  TransitionDirection,
  transitionMetadata
} from '@/app/lib/effects/transitions';

interface ClipTransitionProps {
  transition: Transition;
  clipWidth: number;
  clipDuration: number;
  position: 'start' | 'end';
  onDurationChange?: (newDuration: number) => void;
  onRemove?: () => void;
  isSelected?: boolean;
}

export default function ClipTransition({
  transition,
  clipWidth,
  clipDuration,
  position,
  onDurationChange,
  onRemove,
  isSelected = false
}: ClipTransitionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dragStartX = useRef(0);
  const initialDuration = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const metadata = transitionMetadata[transition.type];

  // Calculate visual width based on transition duration
  const pixelsPerMs = clipWidth / clipDuration;
  const transitionWidth = Math.max(20, Math.min(transition.duration * pixelsPerMs, clipWidth * 0.5));

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    initialDuration.current = transition.duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!onDurationChange) return;

      const deltaX = moveEvent.clientX - dragStartX.current;
      const deltaDuration = deltaX / pixelsPerMs;

      // Different calculation based on position
      let newDuration: number;
      if (position === 'start') {
        newDuration = initialDuration.current + deltaDuration;
      } else {
        newDuration = initialDuration.current - deltaDuration;
      }

      // Clamp duration between 100ms and half the clip duration
      newDuration = Math.max(100, Math.min(newDuration, clipDuration * 0.5));

      onDurationChange(Math.round(newDuration));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 bottom-0 flex items-center ${
        position === 'start' ? 'left-0' : 'right-0'
      }`}
      style={{ width: `${transitionWidth}px` }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Transition Indicator */}
      <div
        className={`relative h-full w-full ${
          position === 'start'
            ? 'bg-gradient-to-r from-blue-500/40 to-transparent'
            : 'bg-gradient-to-l from-blue-500/40 to-transparent'
        } ${isDragging ? 'cursor-ew-resize' : 'cursor-pointer'} ${
          isSelected ? 'ring-2 ring-blue-400' : ''
        } transition-all hover:from-blue-500/60 hover:to-transparent`}
      >
        {/* Transition Icon */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            position === 'start' ? 'left-1' : 'right-1'
          }`}
        >
          <div className="text-white text-xs bg-blue-600 rounded px-1 py-0.5 shadow-lg">
            {metadata.icon}
          </div>
        </div>

        {/* Duration Handle */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-blue-500 hover:bg-blue-400 cursor-ew-resize ${
            position === 'start' ? 'right-0' : 'left-0'
          } ${isDragging ? 'bg-blue-400' : ''}`}
          onMouseDown={handleMouseDown}
        >
          {/* Handle Grip */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-8 flex items-center justify-center">
            <div className="w-0.5 h-4 bg-white/50 rounded" />
          </div>
        </div>

        {/* Diagonal Stripes Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`stripe-${transition.id}`}
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform={`rotate(${position === 'start' ? 45 : -45})`}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#stripe-${transition.id})`}
          />
        </svg>

        {/* Remove Button (on hover) */}
        {showTooltip && onRemove && (
          <button
            onClick={handleRemoveClick}
            className={`absolute top-1 ${
              position === 'start' ? 'right-1' : 'left-1'
            } w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs shadow-lg transition-all z-10`}
            title="Remove transition"
          >
            ×
          </button>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`absolute ${
            position === 'start' ? 'left-0' : 'right-0'
          } top-full mt-1 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap z-20 pointer-events-none`}
        >
          <div className="font-semibold">{metadata.name}</div>
          <div className="text-gray-400">
            {transition.direction === 'in' ? 'In' : 'Out'} • {transition.duration}ms
          </div>
          <div className="text-gray-500 text-[10px] mt-0.5">
            {position === 'start' ? 'Drag right edge →' : 'Drag left edge ←'} to adjust
          </div>
        </div>
      )}
    </div>
  );
}

// Component for displaying both transitions on a clip
interface ClipTransitionsProps {
  transitionIn?: Transition | null;
  transitionOut?: Transition | null;
  clipWidth: number;
  clipDuration: number;
  onTransitionInChange?: (duration: number) => void;
  onTransitionOutChange?: (duration: number) => void;
  onTransitionInRemove?: () => void;
  onTransitionOutRemove?: () => void;
  selectedTransition?: 'in' | 'out' | null;
}

export function ClipTransitions({
  transitionIn,
  transitionOut,
  clipWidth,
  clipDuration,
  onTransitionInChange,
  onTransitionOutChange,
  onTransitionInRemove,
  onTransitionOutRemove,
  selectedTransition
}: ClipTransitionsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Transition In */}
      {transitionIn && (
        <div className="pointer-events-auto">
          <ClipTransition
            transition={transitionIn}
            clipWidth={clipWidth}
            clipDuration={clipDuration}
            position="start"
            onDurationChange={onTransitionInChange}
            onRemove={onTransitionInRemove}
            isSelected={selectedTransition === 'in'}
          />
        </div>
      )}

      {/* Transition Out */}
      {transitionOut && (
        <div className="pointer-events-auto">
          <ClipTransition
            transition={transitionOut}
            clipWidth={clipWidth}
            clipDuration={clipDuration}
            position="end"
            onDurationChange={onTransitionOutChange}
            onRemove={onTransitionOutRemove}
            isSelected={selectedTransition === 'out'}
          />
        </div>
      )}
    </div>
  );
}

// Compact transition badge for smaller displays
interface TransitionBadgeProps {
  transition: Transition;
  position: 'start' | 'end';
  onClick?: () => void;
}

export function TransitionBadge({
  transition,
  position,
  onClick
}: TransitionBadgeProps) {
  const metadata = transitionMetadata[transition.type];

  return (
    <div
      onClick={onClick}
      className={`absolute ${
        position === 'start' ? 'left-1' : 'right-1'
      } top-1 bg-blue-600 text-white text-[10px] rounded px-1.5 py-0.5 cursor-pointer hover:bg-blue-500 transition-colors shadow-md`}
      title={`${metadata.name} ${transition.direction === 'in' ? 'In' : 'Out'} (${transition.duration}ms)`}
    >
      {metadata.icon}
    </div>
  );
}

// Timeline marker for transition boundaries
interface TransitionMarkerProps {
  type: 'in' | 'out';
  position: number; // pixels from left
  duration: number; // milliseconds
  clipDuration: number; // milliseconds
  onDurationChange?: (newDuration: number) => void;
}

export function TransitionMarker({
  type,
  position,
  duration,
  clipDuration,
  onDurationChange
}: TransitionMarkerProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onDurationChange) return;

    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX;
    const startDuration = duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Convert pixels to milliseconds (approximate)
      const pixelsPerMs = 0.1; // This should come from timeline scale
      const deltaDuration = deltaX / pixelsPerMs;

      const newDuration = Math.max(
        100,
        Math.min(startDuration + deltaDuration, clipDuration * 0.5)
      );

      onDurationChange(Math.round(newDuration));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`absolute top-0 bottom-0 w-0.5 ${
        isDragging ? 'bg-blue-400' : 'bg-blue-500'
      } cursor-ew-resize hover:bg-blue-400 transition-colors`}
      style={{ left: `${position}px` }}
      onMouseDown={handleMouseDown}
    >
      {/* Marker Handle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow" />

      {/* Label */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-white bg-gray-900 px-1 rounded whitespace-nowrap pointer-events-none">
        {type === 'in' ? 'In' : 'Out'}: {duration}ms
      </div>
    </div>
  );
}
