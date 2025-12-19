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

  // Get clip color based on type
  const getClipColor = () => {
    switch (clip.type) {
      case 'video':
        return 'bg-blue-600 border-blue-500';
      case 'audio':
        return 'bg-green-600 border-green-500';
      case 'image':
        return 'bg-purple-600 border-purple-500';
      case 'text':
        return 'bg-orange-600 border-orange-500';
      default:
        return 'bg-gray-600 border-gray-500';
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
        absolute top-1 bottom-1 rounded border-2 overflow-hidden
        ${getClipColor()}
        ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-gray-900' : ''}
        ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:brightness-110'}
        transition-all
      `}
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Left resize handle */}
      {!locked && (
        <div
          className={`
            absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize
            hover:bg-white hover:bg-opacity-30 transition-colors
            ${isResizing === 'left' ? 'bg-white bg-opacity-30' : ''}
          `}
          onMouseDown={(e) => handleResizeStart('left', e)}
        />
      )}

      {/* Clip content */}
      <div className="h-full px-2 py-1 flex items-center gap-1 text-white text-xs font-medium select-none">
        {/* Clip icon */}
        <div className="flex-shrink-0">
          {getClipIcon()}
        </div>

        {/* Clip name */}
        <div className="flex-1 truncate">
          {clip.name}
        </div>

        {/* Status icons */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {clip.muted && <VolumeX size={12} />}
          {clip.locked && <Lock size={12} />}
        </div>
      </div>

      {/* Trim indicator */}
      {(clip.trimStart || clip.trimEnd) && (
        <div className="absolute inset-0 pointer-events-none">
          {clip.trimStart && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white bg-opacity-30" />
          )}
          {clip.trimEnd && (
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white bg-opacity-30" />
          )}
        </div>
      )}

      {/* Right resize handle */}
      {!locked && (
        <div
          className={`
            absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize
            hover:bg-white hover:bg-opacity-30 transition-colors
            ${isResizing === 'right' ? 'bg-white bg-opacity-30' : ''}
          `}
          onMouseDown={(e) => handleResizeStart('right', e)}
        />
      )}

      {/* Audio waveform preview (placeholder for now) */}
      {clip.type === 'audio' && (
        <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-30 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,50 Q10,30 20,50 T40,50 T60,50 T80,50 T100,50"
              stroke="white"
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
