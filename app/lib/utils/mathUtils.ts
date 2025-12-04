/**
 * Math utility functions for common calculations
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Clamps a value between a minimum and maximum value
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns The interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Maps a value from one range to another
 * @param value - The value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns The mapped value
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculates the distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns The distance between the points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the angle between two points in radians
 * @param p1 - First point
 * @param p2 - Second point
 * @returns The angle in radians
 */
export function angleBetween(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Normalizes an angle to be between 0 and 2π
 * @param angle - The angle in radians
 * @returns The normalized angle
 */
export function normalizeAngle(angle: number): number {
  const TWO_PI = Math.PI * 2;
  let normalized = angle % TWO_PI;
  if (normalized < 0) {
    normalized += TWO_PI;
  }
  return normalized;
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Rounds a number to a specified number of decimal places
 * @param value - The value to round
 * @param decimals - Number of decimal places
 * @returns The rounded value
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Checks if a number is within a range (inclusive)
 * @param value - The value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if value is within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Calculates the midpoint between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns The midpoint
 */
export function midpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/**
 * Rotates a point around a center point
 * @param point - The point to rotate
 * @param center - The center of rotation
 * @param angle - The angle in radians
 * @returns The rotated point
 */
export function rotatePoint(point: Point, center: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

/**
 * Snaps a value to the nearest step
 * @param value - The value to snap
 * @param step - The step size
 * @returns The snapped value
 */
export function snapToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Calculates percentage of a value relative to a total
 * @param value - The value
 * @param total - The total
 * @returns The percentage (0-100)
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Gets a random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Gets a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
