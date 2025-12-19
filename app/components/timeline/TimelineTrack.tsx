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

  // Get track color using design tokens
  const getTrackColor = () => {
    switch (track.type) {
      case 'video':
        return 'var(--track-video)';
      case 'audio':
        return 'var(--track-audio)';
      case 'text':
        return 'var(--track-text)';
      default:
        return 'var(--track-effect)';
    }
  };

  const getTrackBgColor = () => {
    switch (track.type) {
      case 'video':
        return 'rgba(59, 130, 246, 0.1)'; // track-video with opacity
      case 'audio':
        return 'rgba(16, 185, 129, 0.1)'; // track-audio with opacity
      case 'text':
        return 'rgba(245, 158, 11, 0.1)'; // track-text with opacity
      default:
        return 'rgba(139, 92, 246, 0.1)'; // track-effect with opacity
    }
  };

  return (
    <div
      className="flex border-b transition-all duration-200"
      style={{
        height: `${trackHeight}px`,
        background: 'var(--timeline-track)',
        borderColor: 'var(--border-primary)',
        borderLeftWidth: '3px',
        borderLeftColor: getTrackColor()
      }}
    >
      {/* Track header */}
      <div
        className="w-48 flex-shrink-0 flex flex-col"
        style={{
          background: 'var(--surface-elevated)',
          borderRight: `1px solid var(--border-primary)`
        }}
      >
        {/* Track name */}
        <div className="flex-1 px-4 py-3 flex items-center gap-3">
          <div
            className="p-1.5 rounded-md transition-all duration-200"
            style={{
              background: getTrackBgColor(),
              color: getTrackColor()
            }}
          >
            {getTrackIcon()}
          </div>
          <div
            className="flex-1 text-sm font-medium truncate transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
          >
            {track.name}
          </div>
        </div>

        {/* Track controls */}
        <div className="px-3 pb-3 flex items-center gap-1">
          {/* Visibility toggle */}
          <button
            onClick={onToggleVisibility}
            className={`
              p-2 rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center
              ${track.visible
                ? 'hover:bg-[var(--surface-hover)]'
                : 'opacity-50 hover:bg-[var(--surface-hover)]'
              }
            `}
            style={{
              color: track.visible ? 'var(--text-secondary)' : 'var(--text-tertiary)'
            }}
            title={track.visible ? 'Hide track' : 'Show track'}
          >
            {track.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Mute toggle (for audio/video tracks) */}
          {(track.type === 'audio' || track.type === 'video') && (
            <button
              onClick={onToggleMute}
              className={`
                p-2 rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center
                ${track.muted
                  ? 'hover:bg-[var(--error-bg)]'
                  : 'hover:bg-[var(--surface-hover)]'
                }
              `}
              style={{
                color: track.muted ? 'var(--error)' : 'var(--text-secondary)'
              }}
              title={track.muted ? 'Unmute track' : 'Mute track'}
            >
              {track.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}

          {/* Lock toggle */}
          <button
            onClick={onToggleLock}
            className={`
              p-2 rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center
              ${track.locked
                ? 'hover:bg-[var(--warning-bg)]'
                : 'hover:bg-[var(--surface-hover)]'
              }
            `}
            style={{
              color: track.locked ? 'var(--warning)' : 'var(--text-secondary)'
            }}
            title={track.locked ? 'Unlock track' : 'Lock track'}
          >
            {track.locked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>
      </div>

      {/* Clips area */}
      <div
        className="flex-1 relative transition-colors duration-200"
        style={{
          background: track.locked ? 'var(--surface)' : 'var(--timeline-track)',
        }}
        onMouseEnter={(e) => {
          if (!track.locked) {
            e.currentTarget.style.background = 'var(--timeline-track-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = track.locked
            ? 'var(--surface)'
            : 'var(--timeline-track)';
        }}
      >
        {/* Grid lines (every 5 seconds) */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.ceil(100 / 5) }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 opacity-30"
              style={{
                left: `${i * 5 * zoom}px`,
                width: '1px',
                background: 'var(--border-secondary)'
              }}
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
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'var(--backdrop-blur)'
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                 style={{ background: 'var(--surface)', color: 'var(--text-tertiary)' }}>
              <Lock size={14} />
              <span className="text-xs font-medium">Track Locked</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
