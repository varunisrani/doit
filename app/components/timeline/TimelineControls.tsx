'use client';

import { useState } from 'react';
import { Play, Pause, Square, ZoomIn, ZoomOut, Plus, ChevronDown, Video, Music, Type } from 'lucide-react';
import { formatTime } from '../../lib/timeline/timeUtils';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Slider } from '../ui/Slider';

interface TimelineControlsProps {
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  zoom: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onZoomChange: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddTrack: (type: 'video' | 'audio' | 'text') => void;
}

export function TimelineControls({
  isPlaying,
  currentTime,
  duration,
  zoom,
  onPlay,
  onPause,
  onStop,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onAddTrack,
}: TimelineControlsProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div
      className="h-16 flex items-center gap-6 px-6 transition-all duration-200"
      style={{
        background: 'var(--surface-elevated)',
        borderBottom: `1px solid var(--border-primary)`,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Playback controls */}
      <div className="flex items-center gap-2">
        <IconButton
          icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
          onClick={isPlaying ? onPause : onPlay}
          variant="primary"
          size="md"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        />
        <IconButton
          icon={<Square size={20} />}
          onClick={onStop}
          variant="secondary"
          size="md"
          title="Stop (S)"
        />
      </div>

      {/* Time display */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg"
           style={{ background: 'var(--surface)' }}>
        <div
          className="font-mono text-sm font-semibold min-w-[90px] transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
        >
          {formatTime(currentTime * 1000)}
        </div>
        <div
          className="text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          /
        </div>
        <div
          className="font-mono text-sm min-w-[90px] transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          {formatTime(duration * 1000)}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-3">
        <IconButton
          icon={<ZoomOut size={16} />}
          onClick={onZoomOut}
          variant="ghost"
          size="sm"
          title="Zoom out (-)"
        />

        <div className="w-36">
          <Slider
            value={zoom}
            min={10}
            max={500}
            step={10}
            onChange={onZoomChange}
          />
        </div>

        <IconButton
          icon={<ZoomIn size={16} />}
          onClick={onZoomIn}
          variant="ghost"
          size="sm"
          title="Zoom in (+)"
        />

        <div
          className="text-xs font-mono font-medium min-w-[70px] text-center px-2 py-1 rounded-md"
          style={{
            color: 'var(--text-secondary)',
            background: 'var(--surface)',
          }}
        >
          {Math.round(zoom)}px/s
        </div>
      </div>

      {/* Add track button */}
      <div className="relative">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus size={16} />
          Add Track
          <ChevronDown
            size={14}
            className={`ml-1 transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`}
          />
        </Button>

        {showAddMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowAddMenu(false)}
            />
            <div
              className="absolute right-0 top-full mt-2 z-50 rounded-lg shadow-xl overflow-hidden border"
              style={{
                background: 'var(--surface-elevated)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <button
                onClick={() => {
                  onAddTrack('video');
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors duration-200 hover:bg-[var(--surface-hover)]"
                style={{ color: 'var(--text-primary)' }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: 'var(--track-video)'
                  }}
                >
                  <Video size={16} />
                </div>
                <div>
                  <div className="font-medium">Video Track</div>
                  <div className="text-xs opacity-60">For video clips and images</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onAddTrack('audio');
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors duration-200 hover:bg-[var(--surface-hover)]"
                style={{ color: 'var(--text-primary)' }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--track-audio)'
                  }}
                >
                  <Music size={16} />
                </div>
                <div>
                  <div className="font-medium">Audio Track</div>
                  <div className="text-xs opacity-60">For music and sound effects</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onAddTrack('text');
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors duration-200 hover:bg-[var(--surface-hover)]"
                style={{ color: 'var(--text-primary)' }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: 'var(--track-text)'
                  }}
                >
                  <Type size={16} />
                </div>
                <div>
                  <div className="font-medium">Text Track</div>
                  <div className="text-xs opacity-60">For titles and captions</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
