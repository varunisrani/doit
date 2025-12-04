/**
 * Timeline operations hook
 * Provides high-level operations for timeline manipulation
 */

import { useCallback } from 'react';
import { useTimelineStore, Clip } from '../lib/store/timelineStore';
import { useSelectionStore } from '../lib/store/selectionStore';
import { findNearestSnapPoint, generateClipSnapPoints, calculateSnapThreshold } from '../lib/timeline/snapUtils';
import { pixelsToTime, timeToPixels } from '../lib/timeline/timeUtils';

export function useTimeline() {
  const {
    tracks,
    zoom,
    currentTime,
    duration,
    snapToGrid,
    gridSize,
    addClip,
    removeClip,
    updateClip,
    moveClip,
    duplicateClip,
    splitClip,
    addTrack,
    removeTrack,
    updateTrack,
    setCurrentTime,
    setZoom,
  } = useTimelineStore();

  const {
    selectedClipIds,
    selectClip,
    clearClipSelection,
    isClipSelected,
    multiSelectMode,
  } = useSelectionStore();

  /**
   * Get all clips from all tracks for snap calculations
   */
  const getAllClips = useCallback((): Array<{ id: string; startTime: number; endTime: number }> => {
    return tracks.flatMap(track =>
      track.clips.map(clip => ({
        id: clip.id,
        startTime: clip.startTime,
        endTime: clip.startTime + clip.duration,
      }))
    );
  }, [tracks]);

  /**
   * Snap time to grid or other clips
   */
  const snapTime = useCallback((time: number, excludeClipIds: string[] = []): number => {
    if (!snapToGrid) return time;

    // Calculate snap threshold based on zoom
    const threshold = calculateSnapThreshold(zoom, 10); // 10px threshold

    // Get all snap points
    const allClips = getAllClips().filter(clip => !excludeClipIds.includes(clip.id));
    const clipSnapPoints = generateClipSnapPoints(allClips);

    // Add playhead snap point
    const snapPoints = [
      ...clipSnapPoints,
      { time: currentTime, type: 'playhead' as const },
    ];

    // Find nearest snap point
    const result = findNearestSnapPoint(time, snapPoints, threshold);
    return result.snapped ? result.time : time;
  }, [snapToGrid, zoom, currentTime, getAllClips]);

  /**
   * Handle clip drag operation
   */
  const handleClipDrag = useCallback((
    clipId: string,
    newTrackId: string,
    newStartTime: number
  ) => {
    const clip = useTimelineStore.getState().getClipById(clipId);
    if (!clip || clip.locked) return;

    // Snap to grid/clips
    const snappedTime = snapTime(newStartTime, [clipId]);

    // Move clip
    moveClip(clipId, newTrackId, Math.max(0, snappedTime));
  }, [moveClip, snapTime]);

  /**
   * Handle clip resize (trim)
   */
  const handleClipResize = useCallback((
    clipId: string,
    edge: 'left' | 'right',
    newTime: number
  ) => {
    const clip = useTimelineStore.getState().getClipById(clipId);
    if (!clip || clip.locked) return;

    const snappedTime = snapTime(newTime, [clipId]);

    if (edge === 'left') {
      // Resize from left (change startTime and duration)
      const newStartTime = Math.max(0, Math.min(snappedTime, clip.startTime + clip.duration - 0.1));
      const newDuration = (clip.startTime + clip.duration) - newStartTime;
      const trimStart = (clip.trimStart || 0) + (newStartTime - clip.startTime);

      updateClip(clipId, {
        startTime: newStartTime,
        duration: newDuration,
        trimStart: Math.max(0, trimStart),
      });
    } else {
      // Resize from right (change duration only)
      const newDuration = Math.max(0.1, snappedTime - clip.startTime);
      updateClip(clipId, {
        duration: newDuration,
      });
    }
  }, [updateClip, snapTime]);

  /**
   * Handle playhead drag
   */
  const handlePlayheadDrag = useCallback((newTime: number) => {
    const snappedTime = snapTime(newTime);
    setCurrentTime(Math.max(0, Math.min(duration, snappedTime)));
  }, [setCurrentTime, duration, snapTime]);

  /**
   * Handle timeline zoom
   */
  const handleZoom = useCallback((delta: number) => {
    const newZoom = zoom * (1 + delta);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  /**
   * Handle zoom in
   */
  const zoomIn = useCallback(() => {
    handleZoom(0.2); // 20% increase
  }, [handleZoom]);

  /**
   * Handle zoom out
   */
  const zoomOut = useCallback(() => {
    handleZoom(-0.2); // 20% decrease
  }, [handleZoom]);

  /**
   * Fit timeline to view
   */
  const zoomToFit = useCallback(() => {
    const containerWidth = 1000; // Default, should be passed from component
    const targetZoom = (containerWidth - 100) / duration * 1000; // Convert to px/second
    setZoom(targetZoom);
  }, [duration, setZoom]);

  /**
   * Convert pixel position to time
   */
  const pixelToTime = useCallback((pixels: number): number => {
    return pixelsToTime(pixels, zoom);
  }, [zoom]);

  /**
   * Convert time to pixel position
   */
  const timeToPixel = useCallback((time: number): number => {
    return timeToPixels(time, zoom);
  }, [zoom]);

  /**
   * Delete selected clips
   */
  const deleteSelectedClips = useCallback(() => {
    const clipIds = Array.from(selectedClipIds);
    clipIds.forEach(clipId => removeClip(clipId));
    clearClipSelection();
  }, [selectedClipIds, removeClip, clearClipSelection]);

  /**
   * Duplicate selected clips
   */
  const duplicateSelectedClips = useCallback(() => {
    const clipIds = Array.from(selectedClipIds);
    clipIds.forEach(clipId => duplicateClip(clipId));
  }, [selectedClipIds, duplicateClip]);

  /**
   * Split clip at current time
   */
  const splitClipAtPlayhead = useCallback((clipId: string) => {
    const clip = useTimelineStore.getState().getClipById(clipId);
    if (!clip) return;

    if (currentTime > clip.startTime && currentTime < clip.startTime + clip.duration) {
      splitClip(clipId, currentTime);
    }
  }, [currentTime, splitClip]);

  /**
   * Add new track
   */
  const handleAddTrack = useCallback((type: 'video' | 'audio' | 'text') => {
    const trackCount = tracks.filter(t => t.type === type).length;
    addTrack({
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${trackCount + 1}`,
      type,
    });
  }, [tracks, addTrack]);

  /**
   * Get clip at specific position
   */
  const getClipAtPosition = useCallback((trackId: string, time: number): Clip | undefined => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return undefined;

    return track.clips.find(clip =>
      time >= clip.startTime && time <= clip.startTime + clip.duration
    );
  }, [tracks]);

  return {
    // State
    tracks,
    zoom,
    currentTime,
    duration,
    snapToGrid,
    gridSize,
    selectedClipIds,

    // Clip operations
    addClip,
    removeClip,
    updateClip,
    moveClip,
    handleClipDrag,
    handleClipResize,
    duplicateSelectedClips,
    deleteSelectedClips,
    splitClipAtPlayhead,

    // Track operations
    addTrack: handleAddTrack,
    removeTrack,
    updateTrack,

    // Playhead operations
    setCurrentTime,
    handlePlayheadDrag,

    // Zoom operations
    setZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    handleZoom,

    // Utilities
    snapTime,
    pixelToTime,
    timeToPixel,
    getClipAtPosition,
    getAllClips,

    // Selection
    selectClip,
    isClipSelected,
    clearClipSelection,
    multiSelectMode,
  };
}
