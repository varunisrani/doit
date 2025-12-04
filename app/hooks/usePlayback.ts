/**
 * Playback hook for timeline video editor
 * Manages play, pause, stop, seek, speed control, and frame stepping
 */

import { useEffect, useRef, useCallback } from 'react';
import { useTimelineStore } from '../lib/store/timelineStore';
import { useEditorStore } from '../lib/store/editorStore';
import { PlaybackController, createPlaybackController } from '../lib/timeline/playback';

export interface PlaybackSpeed {
  value: number;
  label: string;
}

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

export interface UsePlaybackOptions {
  onRender?: (currentTime: number) => void;
  onComplete?: () => void;
}

export function usePlayback(options: UsePlaybackOptions = {}) {
  const {
    currentTime,
    duration,
    isPlaying,
    loop,
    setCurrentTime,
    play: playStore,
    pause: pauseStore,
    stop: stopStore,
    setLoop,
  } = useTimelineStore();

  const { project } = useEditorStore();
  const playbackControllerRef = useRef<PlaybackController | null>(null);
  const playbackSpeedRef = useRef<number>(1);

  // Initialize playback controller
  useEffect(() => {
    const controller = createPlaybackController({
      fps: project.fps || 30,
      loop: loop,
      speed: playbackSpeedRef.current,
      onUpdate: (time) => {
        // Convert from milliseconds to seconds
        const timeInSeconds = time / 1000;
        setCurrentTime(timeInSeconds);

        // Trigger canvas render callback
        options.onRender?.(timeInSeconds);
      },
      onStateChange: (state) => {
        if (state === 'playing') {
          playStore();
        } else {
          pauseStore();
        }
      },
      onComplete: () => {
        stopStore();
        options.onComplete?.();
      },
    });

    // Set initial duration (convert seconds to milliseconds)
    controller.setDuration(duration * 1000);
    controller.seek(currentTime * 1000);

    playbackControllerRef.current = controller;

    return () => {
      controller.destroy();
      playbackControllerRef.current = null;
    };
  }, [project.fps, loop, duration, setCurrentTime, playStore, pauseStore, stopStore, options]);

  // Sync loop state
  useEffect(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.setLoop(loop);
    }
  }, [loop]);

  // Sync duration changes
  useEffect(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.setDuration(duration * 1000);
    }
  }, [duration]);

  /**
   * Play from current position
   */
  const play = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.play();
    }
  }, []);

  /**
   * Pause at current position
   */
  const pause = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.pause();
    }
  }, []);

  /**
   * Stop and reset to beginning
   */
  const stop = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.stop();
    }
  }, []);

  /**
   * Toggle between play and pause
   */
  const togglePlayPause = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.togglePlayPause();
    }
  }, []);

  /**
   * Seek to specific time (in seconds)
   */
  const seek = useCallback((time: number) => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.seek(time * 1000);
    }
  }, []);

  /**
   * Jump to start
   */
  const jumpToStart = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.jumpToStart();
    }
  }, []);

  /**
   * Jump to end
   */
  const jumpToEnd = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.jumpToEnd();
    }
  }, []);

  /**
   * Step forward by one frame
   */
  const stepForward = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.stepForward();
    }
  }, []);

  /**
   * Step backward by one frame
   */
  const stepBackward = useCallback(() => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.stepBackward();
    }
  }, []);

  /**
   * Set playback speed
   */
  const setSpeed = useCallback((speed: number) => {
    if (playbackControllerRef.current) {
      playbackControllerRef.current.setSpeed(speed);
      playbackSpeedRef.current = speed;
    }
  }, []);

  /**
   * Toggle loop mode
   */
  const toggleLoop = useCallback(() => {
    setLoop(!loop);
  }, [loop, setLoop]);

  /**
   * Skip forward by a specific amount (in seconds)
   */
  const skipForward = useCallback((amount: number = 5) => {
    if (playbackControllerRef.current) {
      const newTime = Math.min(duration, currentTime + amount);
      playbackControllerRef.current.seek(newTime * 1000);
    }
  }, [currentTime, duration]);

  /**
   * Skip backward by a specific amount (in seconds)
   */
  const skipBackward = useCallback((amount: number = 5) => {
    if (playbackControllerRef.current) {
      const newTime = Math.max(0, currentTime - amount);
      playbackControllerRef.current.seek(newTime * 1000);
    }
  }, [currentTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'j':
          e.preventDefault();
          stepBackward();
          break;
        case 'l':
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            e.preventDefault();
            jumpToStart();
          } else {
            e.preventDefault();
            skipBackward(1);
          }
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            e.preventDefault();
            jumpToEnd();
          } else {
            e.preventDefault();
            skipForward(1);
          }
          break;
        case 'Home':
          e.preventDefault();
          jumpToStart();
          break;
        case 'End':
          e.preventDefault();
          jumpToEnd();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, stepBackward, stepForward, jumpToStart, jumpToEnd, skipBackward, skipForward]);

  return {
    // State
    currentTime,
    duration,
    isPlaying,
    loop,
    playbackSpeed: playbackSpeedRef.current,

    // Playback controls
    play,
    pause,
    stop,
    togglePlayPause,
    seek,

    // Navigation
    jumpToStart,
    jumpToEnd,
    skipForward,
    skipBackward,
    stepForward,
    stepBackward,

    // Settings
    setSpeed,
    toggleLoop,
    setLoop,

    // Available speeds
    availableSpeeds: PLAYBACK_SPEEDS,
  };
}
