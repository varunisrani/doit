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
        className={`relative h-full w-full rounded-lg overflow-hidden transition-all duration-300 group ${
          isDragging ? 'cursor-ew-resize' : 'cursor-pointer'
        } ${
          isSelected ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-transparent' : ''
        } hover:scale-105`}
        style={{
          background: position === 'start'
            ? 'linear-gradient(90deg, var(--accent)40 0%, transparent 100%)'
            : 'linear-gradient(-90deg, var(--accent)40 0%, transparent 100%)',
          boxShadow: isSelected
            ? '0 0 12px var(--accent)40'
            : 'var(--shadow)',
        }}
      >
        {/* Transition Icon */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
            position === 'start' ? 'left-2' : 'right-2'
          }`}
        >
          <div
            className="text-sm rounded-md px-2 py-1 shadow-lg transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'var(--accent)',
              color: 'var(--text-inverse)',
              boxShadow: '0 2px 8px var(--accent)40',
            }}
          >
            {metadata.icon}
          </div>
        </div>

        {/* Duration Handle */}
        <div
          className={`absolute top-0 bottom-0 w-2 cursor-ew-resize transition-all duration-200 ${
            position === 'start' ? 'right-0' : 'left-0'
          } ${isDragging ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
          style={{
            background: isDragging ? 'var(--accent)' : 'var(--accent)60',
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Handle Grip */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-8 flex items-center justify-center">
            <div className="flex flex-col gap-1">
              <div
                className="w-0.5 h-3 rounded-full transition-all duration-200"
                style={{
                  background: 'var(--text-inverse)',
                  opacity: isDragging ? 1 : 0.6,
                }}
              />
              <div
                className="w-0.5 h-3 rounded-full transition-all duration-200"
                style={{
                  background: 'var(--text-inverse)',
                  opacity: isDragging ? 1 : 0.6,
                }}
              />
            </div>
          </div>

          {/* Handle hover indicator */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              background: 'var(--accent)',
            }}
          />
        </div>

        {/* Modern Diagonal Stripes Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`stripe-${transition.id}`}
              patternUnits="userSpaceOnUse"
              width="10"
              height="10"
              patternTransform={`rotate(${position === 'start' ? 45 : -45})`}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="var(--text-inverse)"
                strokeWidth="1.5"
                opacity="0.3"
              />
            </pattern>
            <linearGradient
              id={`transition-gradient-${transition.id}`}
              x1="0%"
              y1="0%"
              x2={position === 'start' ? '100%' : '0%'}
              y2="0%"
            >
              <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#transition-gradient-${transition.id})`} />
          <rect width="100%" height="100%" fill={`url(#stripe-${transition.id})`} />
        </svg>

        {/* Remove Button (on hover) */}
        {showTooltip && onRemove && (
          <button
            onClick={handleRemoveClick}
            className={`absolute top-2 transition-all duration-300 ${
              position === 'start' ? 'right-2' : 'left-2'
            } w-5 h-5 rounded-full flex items-center justify-center text-xs z-20 hover:scale-110`}
            style={{
              background: 'var(--error)',
              color: 'var(--text-inverse)',
              boxShadow: '0 2px 8px var(--error)40',
            }}
            title="Remove transition"
          >
            ×
          </button>
        )}

        {/* Hover effect overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: position === 'start'
              ? 'linear-gradient(90deg, var(--accent)20 0%, transparent 100%)'
              : 'linear-gradient(-90deg, var(--accent)20 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Enhanced Tooltip */}
      {showTooltip && (
        <div
          className={`absolute z-30 transition-all duration-300 ${
            position === 'start' ? 'left-0' : 'right-0'
          } top-full mt-2 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none`}
          style={{
            background: 'var(--surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-xl)',
            transform: position === 'start'
              ? 'translateX(0) translateY(0)'
              : 'translateX(100%) translateY(0)',
          }}
        >
          <div className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
            {metadata.name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {transition.direction === 'in' ? 'In' : 'Out'} • {transition.duration}ms
          </div>
          <div className="text-[10px] mt-1 italic" style={{ color: 'var(--text-tertiary)' }}>
            {position === 'start' ? 'Drag right edge →' : '← Drag left edge'} to adjust
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
