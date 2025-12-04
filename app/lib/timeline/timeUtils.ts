/**
 * Time utility functions for timeline operations
 */

/**
 * Formats time in milliseconds to MM:SS:FF format
 * @param ms - Time in milliseconds
 * @param fps - Frames per second (default: 30)
 * @returns Formatted time string
 */
export function formatTime(ms: number, fps: number = 30): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const frames = Math.floor((ms % 1000) / (1000 / fps));

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
}

/**
 * Formats time in milliseconds to seconds with decimal
 * @param ms - Time in milliseconds
 * @param decimals - Number of decimal places
 * @returns Formatted time string
 */
export function formatTimeSeconds(ms: number, decimals: number = 2): string {
  return (ms / 1000).toFixed(decimals) + 's';
}

/**
 * Parses a time string (MM:SS:FF) to milliseconds
 * @param timeString - Time string in MM:SS:FF format
 * @param fps - Frames per second (default: 30)
 * @returns Time in milliseconds
 */
export function parseTime(timeString: string, fps: number = 30): number {
  const parts = timeString.split(':').map(Number);

  if (parts.length !== 3) {
    throw new Error('Invalid time format. Expected MM:SS:FF');
  }

  const [minutes, seconds, frames] = parts;
  const totalMs =
    minutes * 60 * 1000 +
    seconds * 1000 +
    (frames / fps) * 1000;

  return totalMs;
}

/**
 * Snaps time to the nearest grid interval
 * @param time - Time in milliseconds
 * @param gridInterval - Grid interval in milliseconds
 * @returns Snapped time
 */
export function snapToGrid(time: number, gridInterval: number): number {
  return Math.round(time / gridInterval) * gridInterval;
}

/**
 * Calculates frame number from time
 * @param time - Time in milliseconds
 * @param fps - Frames per second
 * @returns Frame number
 */
export function timeToFrame(time: number, fps: number = 30): number {
  return Math.floor((time / 1000) * fps);
}

/**
 * Calculates time from frame number
 * @param frame - Frame number
 * @param fps - Frames per second
 * @returns Time in milliseconds
 */
export function frameToTime(frame: number, fps: number = 30): number {
  return (frame / fps) * 1000;
}

/**
 * Calculates the duration between two times
 * @param startTime - Start time in milliseconds
 * @param endTime - End time in milliseconds
 * @returns Duration in milliseconds
 */
export function getDuration(startTime: number, endTime: number): number {
  return Math.abs(endTime - startTime);
}

/**
 * Converts milliseconds to a readable duration string
 * @param ms - Time in milliseconds
 * @returns Human-readable duration
 */
export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Gets the grid interval based on zoom level
 * @param zoom - Zoom level (pixels per second)
 * @returns Grid interval in milliseconds
 */
export function getGridInterval(zoom: number): number {
  // Define zoom thresholds and corresponding grid intervals
  const intervals = [
    { threshold: 10, interval: 5000 },   // 5 seconds
    { threshold: 20, interval: 1000 },   // 1 second
    { threshold: 50, interval: 500 },    // 500ms
    { threshold: 100, interval: 100 },   // 100ms
    { threshold: 200, interval: 50 },    // 50ms
    { threshold: Infinity, interval: 10 }, // 10ms
  ];

  const match = intervals.find(({ threshold }) => zoom < threshold);
  return match ? match.interval : 10;
}

/**
 * Clamps time between minimum and maximum bounds
 * @param time - Time to clamp
 * @param min - Minimum time
 * @param max - Maximum time
 * @returns Clamped time
 */
export function clampTime(time: number, min: number = 0, max: number = Infinity): number {
  return Math.max(min, Math.min(max, time));
}

/**
 * Checks if a time is within a range
 * @param time - Time to check
 * @param start - Range start
 * @param end - Range end
 * @returns True if time is within range
 */
export function isTimeInRange(time: number, start: number, end: number): boolean {
  return time >= start && time <= end;
}

/**
 * Calculates playback position as a percentage
 * @param currentTime - Current playback time
 * @param duration - Total duration
 * @returns Percentage (0-100)
 */
export function getPlaybackPercentage(currentTime: number, duration: number): number {
  if (duration === 0) return 0;
  return Math.min((currentTime / duration) * 100, 100);
}

/**
 * Converts pixel position to time based on zoom
 * @param pixels - Pixel position
 * @param zoom - Zoom level (pixels per second)
 * @returns Time in milliseconds
 */
export function pixelsToTime(pixels: number, zoom: number): number {
  return (pixels / zoom) * 1000;
}

/**
 * Converts time to pixel position based on zoom
 * @param time - Time in milliseconds
 * @param zoom - Zoom level (pixels per second)
 * @returns Pixel position
 */
export function timeToPixels(time: number, zoom: number): number {
  return (time / 1000) * zoom;
}

/**
 * Gets the nearest frame time
 * @param time - Time in milliseconds
 * @param fps - Frames per second
 * @returns Time snapped to nearest frame
 */
export function snapToFrame(time: number, fps: number = 30): number {
  const frame = timeToFrame(time, fps);
  return frameToTime(frame, fps);
}

/**
 * Calculates time offset with playback speed
 * @param time - Time in milliseconds
 * @param speed - Playback speed multiplier
 * @returns Adjusted time
 */
export function adjustTimeForSpeed(time: number, speed: number): number {
  return time * speed;
}
