'use client';

import React, { useMemo } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { Dropdown, DropdownOption } from '../ui/Dropdown';
import { Slider } from '../ui/Slider';
import { usePlayback, PLAYBACK_SPEEDS } from '@/app/hooks/usePlayback';

export interface PlaybackControlsProps {
  className?: string;
  showFrameStep?: boolean;
  showSkipButtons?: boolean;
  showSpeedControl?: boolean;
  showLoopButton?: boolean;
  showTimeDisplay?: boolean;
  showScrubber?: boolean;
  onRender?: (currentTime: number) => void;
}

/**
 * Format time in seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  className = '',
  showFrameStep = true,
  showSkipButtons = true,
  showSpeedControl = true,
  showLoopButton = true,
  showTimeDisplay = true,
  showScrubber = true,
  onRender,
}) => {
  const {
    currentTime,
    duration,
    isPlaying,
    loop,
    playbackSpeed,
    play,
    pause,
    stop,
    togglePlayPause,
    seek,
    jumpToStart,
    jumpToEnd,
    skipForward,
    skipBackward,
    stepForward,
    stepBackward,
    setSpeed,
    toggleLoop,
    availableSpeeds,
  } = usePlayback({ onRender });

  // Convert playback speeds to dropdown options
  const speedOptions: DropdownOption[] = useMemo(
    () =>
      availableSpeeds.map((speed) => ({
        value: speed.value.toString(),
        label: speed.label,
      })),
    [availableSpeeds]
  );

  const currentSpeedValue = playbackSpeed.toString();

  const handleSpeedChange = (value: string) => {
    setSpeed(parseFloat(value));
  };

  const handleScrubberChange = (value: number) => {
    seek(value);
  };

  return (
    <div className={`flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4 ${className}`}>
      {/* Time scrubber */}
      {showScrubber && (
        <div className="w-full">
          <Slider
            value={currentTime}
            onChange={handleScrubberChange}
            min={0}
            max={duration}
            step={0.01}
            showValue={false}
            className="w-full"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Time Display */}
        {showTimeDisplay && (
          <div className="flex items-center gap-2 text-sm font-mono text-zinc-400 min-w-[140px]">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}

        {/* Main Playback Controls */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {/* Jump to Start */}
          {showSkipButtons && (
            <IconButton
              icon={<SkipBack />}
              size="md"
              variant="ghost"
              onClick={jumpToStart}
              aria-label="Jump to start"
              title="Jump to start (Home)"
            />
          )}

          {/* Rewind / Skip Backward */}
          {showSkipButtons && (
            <IconButton
              icon={<Rewind />}
              size="md"
              variant="ghost"
              onClick={() => skipBackward(5)}
              aria-label="Skip backward 5 seconds"
              title="Skip backward 5s (←)"
            />
          )}

          {/* Step Backward (Previous Frame) */}
          {showFrameStep && (
            <IconButton
              icon={<ChevronLeft />}
              size="md"
              variant="ghost"
              onClick={stepBackward}
              aria-label="Step backward one frame"
              title="Previous frame (J)"
            />
          )}

          {/* Play/Pause Toggle */}
          <IconButton
            icon={isPlaying ? <Pause /> : <Play />}
            size="lg"
            variant="primary"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause (Space/K)' : 'Play (Space/K)'}
          />

          {/* Stop */}
          <IconButton
            icon={<Square />}
            size="md"
            variant="ghost"
            onClick={stop}
            aria-label="Stop"
            title="Stop and reset"
          />

          {/* Step Forward (Next Frame) */}
          {showFrameStep && (
            <IconButton
              icon={<ChevronRight />}
              size="md"
              variant="ghost"
              onClick={stepForward}
              aria-label="Step forward one frame"
              title="Next frame (L)"
            />
          )}

          {/* Fast Forward / Skip Forward */}
          {showSkipButtons && (
            <IconButton
              icon={<FastForward />}
              size="md"
              variant="ghost"
              onClick={() => skipForward(5)}
              aria-label="Skip forward 5 seconds"
              title="Skip forward 5s (→)"
            />
          )}

          {/* Jump to End */}
          {showSkipButtons && (
            <IconButton
              icon={<SkipForward />}
              size="md"
              variant="ghost"
              onClick={jumpToEnd}
              aria-label="Jump to end"
              title="Jump to end (End)"
            />
          )}
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center gap-2 min-w-[160px] justify-end">
          {/* Loop Toggle */}
          {showLoopButton && (
            <IconButton
              icon={<Repeat />}
              size="md"
              variant="ghost"
              active={loop}
              onClick={toggleLoop}
              aria-label="Toggle loop"
              title={loop ? 'Loop enabled' : 'Loop disabled'}
            />
          )}

          {/* Speed Control */}
          {showSpeedControl && (
            <div className="w-20">
              <Dropdown
                options={speedOptions}
                value={currentSpeedValue}
                onChange={handleSpeedChange}
                placeholder="Speed"
              />
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Info (optional, can be toggled) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-zinc-600 mt-2 pt-2 border-t border-zinc-800">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>Space/K: Play/Pause</span>
            <span>J/L: Previous/Next Frame</span>
            <span>←/→: Skip 1s</span>
            <span>Shift+←/→: Start/End</span>
            <span>Home/End: Start/End</span>
          </div>
        </div>
      )}
    </div>
  );
};
