/**
 * PlaybackController - Core playback engine for the video editor
 * Handles frame-by-frame updates using requestAnimationFrame
 */

import { useTimelineStore } from '../store/timelineStore';

export interface PlaybackOptions {
  fps?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onLoop?: () => void;
  onEnd?: () => void;
}

export class PlaybackController {
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private targetFps: number = 30;
  private frameInterval: number = 1000 / 30;
  private isRunning: boolean = false;

  // Callbacks
  private onTimeUpdate?: (currentTime: number) => void;
  private onPlayStateChange?: (isPlaying: boolean) => void;
  private onLoop?: () => void;
  private onEnd?: () => void;

  constructor(options: PlaybackOptions = {}) {
    this.targetFps = options.fps || 30;
    this.frameInterval = 1000 / this.targetFps;
    this.onTimeUpdate = options.onTimeUpdate;
    this.onPlayStateChange = options.onPlayStateChange;
    this.onLoop = options.onLoop;
    this.onEnd = options.onEnd;
  }

  /**
   * Start playback
   */
  start(): void {
    if (this.isRunning) return;

    const store = useTimelineStore.getState();

    // If at the end, restart from beginning
    if (store.currentTime >= store.duration) {
      store.setCurrentTime(0);
    }

    this.isRunning = true;
    store.play();
    this.lastFrameTime = performance.now();
    this.onPlayStateChange?.(true);
    this.tick();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    const store = useTimelineStore.getState();
    store.pause();
    this.onPlayStateChange?.(false);

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Stop playback and reset to beginning
   */
  stop(): void {
    this.pause();
    const store = useTimelineStore.getState();
    store.setCurrentTime(0);
    this.onTimeUpdate?.(0);
  }

  /**
   * Toggle play/pause
   */
  toggle(): void {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  /**
   * Seek to a specific time
   */
  seek(time: number): void {
    const store = useTimelineStore.getState();
    const clampedTime = Math.max(0, Math.min(store.duration, time));
    store.setCurrentTime(clampedTime);
    this.onTimeUpdate?.(clampedTime);
  }

  /**
   * Skip forward by specified seconds
   */
  skipForward(seconds: number = 5): void {
    const store = useTimelineStore.getState();
    const newTime = Math.min(store.duration, store.currentTime + seconds);
    store.setCurrentTime(newTime);
    this.onTimeUpdate?.(newTime);
  }

  /**
   * Skip backward by specified seconds
   */
  skipBackward(seconds: number = 5): void {
    const store = useTimelineStore.getState();
    const newTime = Math.max(0, store.currentTime - seconds);
    store.setCurrentTime(newTime);
    this.onTimeUpdate?.(newTime);
  }

  /**
   * Step forward one frame
   */
  stepForward(): void {
    const store = useTimelineStore.getState();
    const frameTime = 1 / this.targetFps;
    const newTime = Math.min(store.duration, store.currentTime + frameTime);
    store.setCurrentTime(newTime);
    this.onTimeUpdate?.(newTime);
  }

  /**
   * Step backward one frame
   */
  stepBackward(): void {
    const store = useTimelineStore.getState();
    const frameTime = 1 / this.targetFps;
    const newTime = Math.max(0, store.currentTime - frameTime);
    store.setCurrentTime(newTime);
    this.onTimeUpdate?.(newTime);
  }

  /**
   * Jump to start
   */
  jumpToStart(): void {
    const store = useTimelineStore.getState();
    store.setCurrentTime(0);
    this.onTimeUpdate?.(0);
  }

  /**
   * Jump to end
   */
  jumpToEnd(): void {
    const store = useTimelineStore.getState();
    store.setCurrentTime(store.duration);
    this.onTimeUpdate?.(store.duration);
  }

  /**
   * Set FPS
   */
  setFps(fps: number): void {
    this.targetFps = Math.max(1, Math.min(120, fps));
    this.frameInterval = 1000 / this.targetFps;
  }

  /**
   * Get current playback state
   */
  getState(): { isPlaying: boolean; currentTime: number; duration: number } {
    const store = useTimelineStore.getState();
    return {
      isPlaying: this.isRunning,
      currentTime: store.currentTime,
      duration: store.duration,
    };
  }

  /**
   * Main animation loop
   */
  private tick = (): void => {
    if (!this.isRunning) return;

    const currentFrameTime = performance.now();
    const deltaTime = currentFrameTime - this.lastFrameTime;

    // Only update if enough time has passed for the target FPS
    if (deltaTime >= this.frameInterval) {
      const store = useTimelineStore.getState();
      const deltaSeconds = deltaTime / 1000;
      const newTime = store.currentTime + deltaSeconds;

      if (newTime >= store.duration) {
        if (store.loop) {
          // Loop back to beginning
          store.setCurrentTime(0);
          this.onLoop?.();
          this.onTimeUpdate?.(0);
        } else {
          // Stop at end
          store.setCurrentTime(store.duration);
          this.onTimeUpdate?.(store.duration);
          this.onEnd?.();
          this.pause();
          return;
        }
      } else {
        store.setCurrentTime(newTime);
        this.onTimeUpdate?.(newTime);
      }

      this.lastFrameTime = currentFrameTime - (deltaTime % this.frameInterval);
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Cleanup
   */
  destroy(): void {
    this.pause();
    this.onTimeUpdate = undefined;
    this.onPlayStateChange = undefined;
    this.onLoop = undefined;
    this.onEnd = undefined;
  }
}

// Singleton instance for global access
let playbackControllerInstance: PlaybackController | null = null;

export function getPlaybackController(options?: PlaybackOptions): PlaybackController {
  if (!playbackControllerInstance) {
    playbackControllerInstance = new PlaybackController(options);
  }
  return playbackControllerInstance;
}

export function resetPlaybackController(): void {
  if (playbackControllerInstance) {
    playbackControllerInstance.destroy();
    playbackControllerInstance = null;
  }
}

export default PlaybackController;
