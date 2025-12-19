'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Clip } from '../../lib/store/timelineStore';
import { Volume2, VolumeX, Lock, Image, Video, Type } from 'lucide-react';

interface TimelineClipProps {
  clip: Clip;
  zoom: number; // pixels per second
  isSelected: boolean;
  trackLocked?: boolean;
  onSelect: (clipId: string, multi: boolean) => void;
  onDragEnd: (clipId: string, trackId: string, startTime: number) => void;
  onResize: (clipId: string, edge: 'left' | 'right', newTime: number) => void;
}

export function TimelineClip({
  clip,
  zoom,
  isSelected,
  trackLocked,
  onSelect,
  onDragEnd,
  onResize,
}: TimelineClipProps) {
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const locked = clip.locked || trackLocked;

  // Calculate dimensions
  const width = clip.duration * zoom;
  const left = clip.startTime * zoom;

  // Get clip color using design tokens
  const getClipColors = () => {
    switch (clip.type) {
      case 'video':
        return {
          background: 'var(--track-video)',
          backgroundHover: '#1d4ed8', // track-video darker
          border: '#1d4ed8',
          text: 'var(--text-inverse)'
        };
      case 'audio':
        return {
          background: 'var(--track-audio)',
          backgroundHover: '#047857', // track-audio darker
          border: '#047857',
          text: 'var(--text-inverse)'
        };
      case 'image':
        return {
          background: '#7c3aed', // Purple 600
          backgroundHover: '#6d28d9', // Purple 700
          border: '#6d28d9',
          text: 'var(--text-inverse)'
        };
      case 'text':
        return {
          background: 'var(--track-text)',
          backgroundHover: '#b45309', // track-text darker
          border: '#b45309',
          text: 'var(--text-inverse)'
        };
      default:
        return {
          background: 'var(--track-effect)',
          backgroundHover: '#6d28d9', // track-effect darker
          border: '#6d28d9',
          text: 'var(--text-inverse)'
        };
    }
  };

  // Get clip icon
  const getClipIcon = () => {
    switch (clip.type) {
      case 'video':
        return <Video size={14} />;
      case 'audio':
        return <Volume2 size={14} />;
      case 'image':
        return <Image size={14} />;
      case 'text':
        return <Type size={14} />;
      default:
        return null;
    }
  };

  const clipColors = getClipColors();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (locked) return;

    e.stopPropagation();
    const multi = e.ctrlKey || e.metaKey;
    onSelect(clip.id, multi);

    // Start dragging
    isDraggingRef.current = true;
    const startX = e.clientX;
    const startLeft = left;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const newLeft = startLeft + deltaX;
      const newStartTime = newLeft / zoom;

      // Visual feedback during drag
      if (clipRef.current) {
        clipRef.current.style.transform = `translateX(${deltaX}px)`;
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = upEvent.clientX - startX;
      const newLeft = startLeft + deltaX;
      const newStartTime = Math.max(0, newLeft / zoom);

      onDragEnd(clip.id, clip.trackId, newStartTime);

      // Reset transform
      if (clipRef.current) {
        clipRef.current.style.transform = '';
      }

      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [clip.id, clip.trackId, left, zoom, locked, onSelect, onDragEnd]);

  const handleResizeStart = useCallback((edge: 'left' | 'right', e: React.MouseEvent) => {
    if (locked) return;

    e.stopPropagation();
    setIsResizing(edge);

    const startX = e.clientX;
    const startTime = edge === 'left' ? clip.startTime : clip.startTime + clip.duration;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newTime = startTime + (deltaX / zoom);

      onResize(clip.id, edge, newTime);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [clip.id, clip.startTime, clip.duration, zoom, locked, onResize]);

  return (
    <div
      ref={clipRef}
      className={`
        absolute top-2 bottom-2 rounded-lg overflow-hidden group
        ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-move'}
        transition-all duration-200 shadow-md hover:shadow-lg
      `}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        background: clipColors.background,
        border: `2px solid ${clipColors.border}`,
        boxShadow: isSelected
          ? `0 0 0 3px ${clipColors.backgroundHover}40, var(--shadow-lg)`
          : 'var(--shadow)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={(e) => {
        if (!locked) {
          e.currentTarget.style.background = clipColors.backgroundHover;
          e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 12px ${clipColors.background}40`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = clipColors.background;
        e.currentTarget.style.boxShadow = isSelected
          ? `0 0 0 3px ${clipColors.backgroundHover}40, var(--shadow-lg)`
          : 'var(--shadow)';
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            border: `2px solid var(--selected)`,
            boxShadow: `0 0 0 1px var(--selected)40`,
          }}
        />
      )}

      {/* Left resize handle */}
      {!locked && (
        <div
          className={`
            absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-10
            opacity-0 group-hover:opacity-100 transition-all duration-200
          `}
          style={{
            background: isResizing === 'left'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
          onMouseDown={(e) => handleResizeStart('left', e)}
        >
          {/* Handle grip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-full opacity-60" />
        </div>
      )}

      {/* Clip content */}
      <div className="h-full px-3 py-2 flex items-center gap-2 text-xs font-medium select-none"
           style={{ color: clipColors.text }}>
        {/* Clip icon */}
        <div className="flex-shrink-0 opacity-90">
          {getClipIcon()}
        </div>

        {/* Clip name */}
        <div className="flex-1 truncate leading-tight">
          {clip.name}
        </div>

        {/* Status icons */}
        <div className="flex-shrink-0 flex items-center gap-1.5 opacity-80">
          {clip.muted && <VolumeX size={12} />}
          {clip.locked && <Lock size={12} />}
        </div>
      </div>

      {/* Duration indicator */}
      <div className="absolute bottom-1 right-2 text-xs opacity-60"
           style={{ color: clipColors.text }}>
        {Math.round(clip.duration)}s
      </div>

      {/* Trim indicator */}
      {(clip.trimStart || clip.trimEnd) && (
        <div className="absolute inset-0 pointer-events-none">
          {clip.trimStart && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1 opacity-40"
              style={{ background: clipColors.text }}
            />
          )}
          {clip.trimEnd && (
            <div
              className="absolute right-0 top-0 bottom-0 w-1 opacity-40"
              style={{ background: clipColors.text }}
            />
          )}
        </div>
      )}

      {/* Right resize handle */}
      {!locked && (
        <div
          className={`
            absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize z-10
            opacity-0 group-hover:opacity-100 transition-all duration-200
          `}
          style={{
            background: isResizing === 'right'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
          onMouseDown={(e) => handleResizeStart('right', e)}
        >
          {/* Handle grip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-full opacity-60" />
        </div>
      )}

      {/* Audio waveform preview (placeholder for now) */}
      {clip.type === 'audio' && (
        <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-30 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`waveform-${clip.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: clipColors.text, stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: clipColors.text, stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>
            <path
              d={`M0,50 ${Array.from({ length: 20 }, (_, i) =>
                `${i * 5},${50 + Math.sin(i * 0.8) * 20}`
              ).join(' ')} 100,50`}
              stroke={`url(#waveform-${clip.id})`}
              strokeWidth="1"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
