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
    <div
      className={`flex flex-col gap-4 p-6 transition-all duration-200 ${className}`}
      style={{
        background: 'var(--surface-elevated)',
        border: `1px solid var(--border-primary)`,
        borderRadius: 'var(--lg)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
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

      <div className="flex items-center justify-between gap-6">
        {/* Time Display */}
        {showTimeDisplay && (
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg min-w-[160px]"
            style={{
              background: 'var(--surface)',
              border: `1px solid var(--border-primary)`,
            }}
          >
            <div className="flex items-center gap-2 text-sm font-mono">
              <span
                className="font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatTime(currentTime)}
              </span>
              <span
                className="opacity-60"
                style={{ color: 'var(--text-tertiary)' }}
              >
                /
              </span>
              <span
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatTime(duration)}
              </span>
            </div>
          </div>
        )}

        {/* Main Playback Controls */}
        <div className="flex items-center gap-2 flex-1 justify-center">
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
              variant="secondary"
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
            className="transition-all duration-200 hover:scale-105"
          />

          {/* Stop */}
          <IconButton
            icon={<Square />}
            size="md"
            variant="secondary"
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
              variant="secondary"
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
        <div className="flex items-center gap-3 min-w-[180px] justify-end">
          {/* Loop Toggle */}
          {showLoopButton && (
            <IconButton
              icon={<Repeat />}
              size="md"
              variant={loop ? "primary" : "ghost"}
              onClick={toggleLoop}
              aria-label="Toggle loop"
              title={loop ? 'Loop enabled' : 'Loop disabled'}
              className="transition-all duration-200"
            />
          )}

          {/* Speed Control */}
          {showSpeedControl && (
            <div className="w-24">
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

      {/* Progress indicator */}
      {showScrubber && (
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-1 rounded-full overflow-hidden"
            style={{
              background: 'var(--surface)',
            }}
          >
            <div
              className="h-full transition-all duration-200 rounded-full"
              style={{
                width: `${(currentTime / duration) * 100}%`,
                background: 'var(--primary)',
              }}
            />
          </div>
          <div
            className="text-xs font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {Math.round((currentTime / duration) * 100)}%
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Info (optional, can be toggled) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="text-xs pt-4 border-t"
          style={{
            color: 'var(--text-tertiary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div className="flex items-center gap-2">
              <kbd
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                Space/K
              </kbd>
              <span>Play/Pause</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                J/L
              </kbd>
              <span>Previous/Next Frame</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                ←/→
              </kbd>
              <span>Skip 1s</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                Home/End
              </kbd>
              <span>Start/End</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
