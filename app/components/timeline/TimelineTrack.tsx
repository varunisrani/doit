'use client';

import { useCallback } from 'react';
import { Track, Clip } from '../../lib/store/timelineStore';
import { TimelineClip } from './TimelineClip';
import { Eye, EyeOff, Lock, Unlock, Volume2, VolumeX, Video, Music, Type } from 'lucide-react';

interface TimelineTrackProps {
  track: Track;
  zoom: number;
  selectedClipIds: Set<string>;
  onClipSelect: (clipId: string, multi: boolean) => void;
  onClipDragEnd: (clipId: string, trackId: string, startTime: number) => void;
  onClipResize: (clipId: string, edge: 'left' | 'right', newTime: number) => void;
  onToggleLock: () => void;
  onToggleMute: () => void;
  onToggleVisibility: () => void;
}

export function TimelineTrack({
  track,
  zoom,
  selectedClipIds,
  onClipSelect,
  onClipDragEnd,
  onClipResize,
  onToggleLock,
  onToggleMute,
  onToggleVisibility,
}: TimelineTrackProps) {
  const trackHeight = track.height || 60;

  // Get track icon based on type
  const getTrackIcon = () => {
    switch (track.type) {
      case 'video':
        return <Video size={16} />;
      case 'audio':
        return <Music size={16} />;
      case 'text':
        return <Type size={16} />;
      default:
        return null;
    }
  };

  // Get track color
  const getTrackColor = () => {
    switch (track.type) {
      case 'video':
        return 'border-blue-700';
      case 'audio':
        return 'border-green-700';
      case 'text':
        return 'border-orange-700';
      default:
        return 'border-gray-700';
    }
  };

  return (
    <div
      className={`flex border-b ${getTrackColor()} bg-gray-900`}
      style={{ height: `${trackHeight}px` }}
    >
      {/* Track header */}
      <div className="w-48 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Track name */}
        <div className="flex-1 px-3 py-2 flex items-center gap-2">
          <div className="text-gray-400">
            {getTrackIcon()}
          </div>
          <div className="flex-1 text-sm text-gray-200 font-medium truncate">
            {track.name}
          </div>
        </div>

        {/* Track controls */}
        <div className="px-2 pb-2 flex items-center gap-1">
          {/* Visibility toggle */}
          <button
            onClick={onToggleVisibility}
            className={`
              p-1 rounded hover:bg-gray-700 transition-colors
              ${track.visible ? 'text-gray-400' : 'text-gray-600'}
            `}
            title={track.visible ? 'Hide track' : 'Show track'}
          >
            {track.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>

          {/* Mute toggle (for audio/video tracks) */}
          {(track.type === 'audio' || track.type === 'video') && (
            <button
              onClick={onToggleMute}
              className={`
                p-1 rounded hover:bg-gray-700 transition-colors
                ${track.muted ? 'text-red-500' : 'text-gray-400'}
              `}
              title={track.muted ? 'Unmute track' : 'Mute track'}
            >
              {track.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          )}

          {/* Lock toggle */}
          <button
            onClick={onToggleLock}
            className={`
              p-1 rounded hover:bg-gray-700 transition-colors
              ${track.locked ? 'text-yellow-500' : 'text-gray-400'}
            `}
            title={track.locked ? 'Unlock track' : 'Lock track'}
          >
            {track.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        </div>
      </div>

      {/* Clips area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Grid lines (every 5 seconds) */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.ceil(100 / 5) }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gray-800"
              style={{ left: `${i * 5 * zoom}px` }}
            />
          ))}
        </div>

        {/* Clips */}
        {track.clips.map((clip) => (
          <TimelineClip
            key={clip.id}
            clip={clip}
            zoom={zoom}
            isSelected={selectedClipIds.has(clip.id)}
            trackLocked={track.locked}
            onSelect={onClipSelect}
            onDragEnd={onClipDragEnd}
            onResize={onClipResize}
          />
        ))}

        {/* Drop zone overlay (when locked) */}
        {track.locked && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
