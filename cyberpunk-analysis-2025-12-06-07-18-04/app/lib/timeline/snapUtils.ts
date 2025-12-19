/**
 * Snapping utility functions for timeline interactions
 */

export interface SnapPoint {
  time: number;
  type: 'grid' | 'clip-start' | 'clip-end' | 'playhead' | 'marker';
  label?: string;
}

export interface SnapResult {
  snapped: boolean;
  time: number;
  snapPoint?: SnapPoint;
}

/**
 * Default snap threshold in milliseconds
 */
export const DEFAULT_SNAP_THRESHOLD = 100;

/**
 * Checks if snapping should occur based on threshold
 * @param distance - Distance from snap point
 * @param threshold - Snap threshold
 * @returns True if should snap
 */
export function shouldSnap(distance: number, threshold: number = DEFAULT_SNAP_THRESHOLD): boolean {
  return Math.abs(distance) <= threshold;
}

/**
 * Finds the nearest snap point to a given time
 * @param time - Target time
 * @param snapPoints - Available snap points
 * @param threshold - Snap threshold in milliseconds
 * @returns Snap result with nearest point
 */
export function findNearestSnapPoint(
  time: number,
  snapPoints: SnapPoint[],
  threshold: number = DEFAULT_SNAP_THRESHOLD
): SnapResult {
  if (snapPoints.length === 0) {
    return { snapped: false, time };
  }

  let nearest: SnapPoint | undefined;
  let minDistance = Infinity;

  for (const snapPoint of snapPoints) {
    const distance = Math.abs(time - snapPoint.time);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = snapPoint;
    }
  }

  if (nearest && shouldSnap(minDistance, threshold)) {
    return {
      snapped: true,
      time: nearest.time,
      snapPoint: nearest,
    };
  }

  return { snapped: false, time };
}

/**
 * Generates grid snap points
 * @param duration - Total duration in milliseconds
 * @param interval - Grid interval in milliseconds
 * @returns Array of grid snap points
 */
export function generateGridSnapPoints(
  duration: number,
  interval: number
): SnapPoint[] {
  const points: SnapPoint[] = [];
  for (let time = 0; time <= duration; time += interval) {
    points.push({
      time,
      type: 'grid',
    });
  }
  return points;
}

/**
 * Creates snap points from clip boundaries
 * @param clips - Array of clips with start and end times
 * @returns Array of clip snap points
 */
export function generateClipSnapPoints(
  clips: Array<{ id: string; startTime: number; endTime: number; }>
): SnapPoint[] {
  const points: SnapPoint[] = [];

  for (const clip of clips) {
    points.push({
      time: clip.startTime,
      type: 'clip-start',
      label: `Start: ${clip.id}`,
    });
    points.push({
      time: clip.endTime,
      type: 'clip-end',
      label: `End: ${clip.id}`,
    });
  }

  return points;
}

/**
 * Snaps a time value to grid
 * @param time - Time to snap
 * @param gridInterval - Grid interval in milliseconds
 * @param threshold - Snap threshold
 * @returns Snapped time
 */
export function snapToGrid(
  time: number,
  gridInterval: number,
  threshold: number = DEFAULT_SNAP_THRESHOLD
): SnapResult {
  const snappedTime = Math.round(time / gridInterval) * gridInterval;
  const distance = Math.abs(time - snappedTime);

  if (shouldSnap(distance, threshold)) {
    return {
      snapped: true,
      time: snappedTime,
      snapPoint: { time: snappedTime, type: 'grid' },
    };
  }

  return { snapped: false, time };
}

/**
 * Snaps a time range (start and end) to available snap points
 * @param startTime - Start time
 * @param endTime - End time
 * @param snapPoints - Available snap points
 * @param threshold - Snap threshold
 * @returns Object with snapped start and end times
 */
export function snapTimeRange(
  startTime: number,
  endTime: number,
  snapPoints: SnapPoint[],
  threshold: number = DEFAULT_SNAP_THRESHOLD
): { start: SnapResult; end: SnapResult } {
  return {
    start: findNearestSnapPoint(startTime, snapPoints, threshold),
    end: findNearestSnapPoint(endTime, snapPoints, threshold),
  };
}

/**
 * Calculates snap threshold based on zoom level
 * @param zoom - Zoom level (pixels per second)
 * @param baseThreshold - Base threshold in pixels
 * @returns Threshold in milliseconds
 */
export function calculateSnapThreshold(
  zoom: number,
  baseThreshold: number = 10
): number {
  // Convert pixel threshold to time threshold based on zoom
  return (baseThreshold / zoom) * 1000;
}

/**
 * Merges multiple snap point arrays into one, removing duplicates
 * @param snapPointArrays - Arrays of snap points to merge
 * @returns Merged and deduplicated snap points
 */
export function mergeSnapPoints(...snapPointArrays: SnapPoint[][]): SnapPoint[] {
  const merged: SnapPoint[] = [];
  const timeMap = new Map<number, SnapPoint>();

  for (const points of snapPointArrays) {
    for (const point of points) {
      // Keep the first occurrence of each time
      if (!timeMap.has(point.time)) {
        timeMap.set(point.time, point);
        merged.push(point);
      }
    }
  }

  return merged.sort((a, b) => a.time - b.time);
}

/**
 * Filters snap points to only include those within a time range
 * @param snapPoints - Snap points to filter
 * @param startTime - Range start time
 * @param endTime - Range end time
 * @returns Filtered snap points
 */
export function filterSnapPointsInRange(
  snapPoints: SnapPoint[],
  startTime: number,
  endTime: number
): SnapPoint[] {
  return snapPoints.filter(
    (point) => point.time >= startTime && point.time <= endTime
  );
}

/**
 * Gets snap points by type
 * @param snapPoints - All snap points
 * @param type - Type to filter by
 * @returns Filtered snap points
 */
export function getSnapPointsByType(
  snapPoints: SnapPoint[],
  type: SnapPoint['type']
): SnapPoint[] {
  return snapPoints.filter((point) => point.type === type);
}

/**
 * Checks if two snap points are at the same time
 * @param point1 - First snap point
 * @param point2 - Second snap point
 * @param tolerance - Time tolerance in milliseconds
 * @returns True if points are at same time
 */
export function areSnapPointsEqual(
  point1: SnapPoint,
  point2: SnapPoint,
  tolerance: number = 1
): boolean {
  return Math.abs(point1.time - point2.time) <= tolerance;
}
