'use client';

import { useState } from 'react';
import { Play, Pause, Square, ZoomIn, ZoomOut, Plus, ChevronDown } from 'lucide-react';
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
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center gap-4 px-4">
      {/* Playback controls */}
      <div className="flex items-center gap-2">
        <IconButton
          icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
          onClick={isPlaying ? onPause : onPlay}
          variant="primary"
          size="md"
          title={isPlaying ? 'Pause' : 'Play'}
        />
        <IconButton
          icon={<Square size={20} />}
          onClick={onStop}
          variant="default"
          size="md"
          title="Stop"
        />
      </div>

      {/* Time display */}
      <div className="flex items-center gap-2 text-sm">
        <div className="font-mono text-gray-300 min-w-[80px]">
          {formatTime(currentTime * 1000)}
        </div>
        <div className="text-gray-500">/</div>
        <div className="font-mono text-gray-400 min-w-[80px]">
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
          variant="default"
          size="sm"
          title="Zoom out"
        />

        <div className="w-32">
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
          variant="default"
          size="sm"
          title="Zoom in"
        />

        <div className="text-xs text-gray-400 min-w-[60px] text-center">
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
          <ChevronDown size={14} className="ml-1" />
        </Button>

        {showAddMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowAddMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-50 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  onAddTrack('video');
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Video Track
              </button>
              <button
                onClick={() => {
                  onAddTrack('audio');
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Audio Track
              </button>
              <button
                onClick={() => {
                  onAddTrack('text');
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Text Track
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
