/**
 * Playback controller for timeline
 */

export type PlaybackState = 'playing' | 'paused' | 'stopped';

export interface PlaybackOptions {
  fps?: number;
  loop?: boolean;
  speed?: number;
  onUpdate?: (time: number) => void;
  onStateChange?: (state: PlaybackState) => void;
  onComplete?: () => void;
}

/**
 * Playback controller class for managing timeline playback
 */
export class PlaybackController {
  private currentTime: number = 0;
  private duration: number = 0;
  private state: PlaybackState = 'stopped';
  private fps: number;
  private loop: boolean;
  private speed: number;
  private animationFrameId: number | null = null;
  private lastUpdateTime: number = 0;

  private onUpdate?: (time: number) => void;
  private onStateChange?: (state: PlaybackState) => void;
  private onComplete?: () => void;

  constructor(options: PlaybackOptions = {}) {
    this.fps = options.fps ?? 30;
    this.loop = options.loop ?? false;
    this.speed = options.speed ?? 1.0;
    this.onUpdate = options.onUpdate;
    this.onStateChange = options.onStateChange;
    this.onComplete = options.onComplete;
  }

  /**
   * Sets the duration of the playback
   * @param duration - Duration in milliseconds
   */
  setDuration(duration: number): void {
    this.duration = duration;
    if (this.currentTime > duration) {
      this.currentTime = duration;
    }
  }

  /**
   * Gets the current duration
   * @returns Duration in milliseconds
   */
  getDuration(): number {
    return this.duration;
  }

  /**
   * Starts or resumes playback
   */
  play(): void {
    if (this.state === 'playing') return;

    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }

    this.setState('playing');
    this.lastUpdateTime = performance.now();
    this.tick();
  }

  /**
   * Pauses playback
   */
  pause(): void {
    if (this.state !== 'playing') return;

    this.setState('paused');
    this.stopTick();
  }

  /**
   * Stops playback and resets to beginning
   */
  stop(): void {
    this.setState('stopped');
    this.stopTick();
    this.seek(0);
  }

  /**
   * Seeks to a specific time
   * @param time - Time in milliseconds
   */
  seek(time: number): void {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    this.onUpdate?.(this.currentTime);
  }

  /**
   * Gets the current playback time
   * @returns Current time in milliseconds
   */
  getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * Gets the current playback state
   * @returns Current state
   */
  getState(): PlaybackState {
    return this.state;
  }

  /**
   * Sets the playback speed
   * @param speed - Speed multiplier (1.0 = normal speed)
   */
  setSpeed(speed: number): void {
    this.speed = Math.max(0.1, Math.min(speed, 4.0));
  }

  /**
   * Gets the current playback speed
   * @returns Speed multiplier
   */
  getSpeed(): number {
    return this.speed;
  }

  /**
   * Sets whether playback should loop
   * @param loop - True to enable looping
   */
  setLoop(loop: boolean): void {
    this.loop = loop;
  }

  /**
   * Gets whether playback is looping
   * @returns True if looping is enabled
   */
  isLooping(): boolean {
    return this.loop;
  }

  /**
   * Checks if playback is currently playing
   * @returns True if playing
   */
  isPlaying(): boolean {
    return this.state === 'playing';
  }

  /**
   * Steps forward by one frame
   */
  stepForward(): void {
    const frameTime = 1000 / this.fps;
    this.seek(this.currentTime + frameTime);
  }

  /**
   * Steps backward by one frame
   */
  stepBackward(): void {
    const frameTime = 1000 / this.fps;
    this.seek(this.currentTime - frameTime);
  }

  /**
   * Jumps to the start
   */
  jumpToStart(): void {
    this.seek(0);
  }

  /**
   * Jumps to the end
   */
  jumpToEnd(): void {
    this.seek(this.duration);
  }

  /**
   * Toggles between play and pause
   */
  togglePlayPause(): void {
    if (this.state === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Destroys the playback controller and cleans up resources
   */
  destroy(): void {
    this.stopTick();
    this.onUpdate = undefined;
    this.onStateChange = undefined;
    this.onComplete = undefined;
  }

  /**
   * Main tick function for playback loop
   */
  private tick = (): void => {
    if (this.state !== 'playing') return;

    const now = performance.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    // Update current time based on delta and speed
    this.currentTime += deltaTime * this.speed;

    // Check if we've reached the end
    if (this.currentTime >= this.duration) {
      if (this.loop) {
        this.currentTime = this.currentTime % this.duration;
      } else {
        this.currentTime = this.duration;
        this.setState('stopped');
        this.stopTick();
        this.onComplete?.();
        return;
      }
    }

    this.onUpdate?.(this.currentTime);

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Stops the animation frame loop
   */
  private stopTick(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Sets the playback state and notifies listeners
   */
  private setState(state: PlaybackState): void {
    if (this.state === state) return;
    this.state = state;
    this.onStateChange?.(state);
  }
}

/**
 * Creates a new playback controller
 * @param options - Playback options
 * @returns New playback controller instance
 */
export function createPlaybackController(
  options?: PlaybackOptions
): PlaybackController {
  return new PlaybackController(options);
}
