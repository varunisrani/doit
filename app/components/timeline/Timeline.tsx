'use client';

import { useRef, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useTimelineStore } from '../../lib/store/timelineStore';
import { useSelectionStore } from '../../lib/store/selectionStore';
import { useTimeline } from '../../hooks/useTimeline';
import { TimelineControls } from './TimelineControls';
import { TimeRuler } from './TimeRuler';
import { TimelineTrack } from './TimelineTrack';
import { Playhead } from './Playhead';

export function Timeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tracksContainerRef = useRef<HTMLDivElement>(null);

  const {
    tracks,
    currentTime,
    duration,
    zoom,
    isPlaying,
    play,
    pause,
    stop,
    toggleTrackLock,
    toggleTrackMute,
    toggleTrackVisibility,
    setCurrentTime,
  } = useTimelineStore();

  const {
    selectedClipIds,
    selectClip,
    clearClipSelection,
    setMultiSelectMode,
  } = useSelectionStore();

  const {
    handleClipDrag,
    handleClipResize,
    handlePlayheadDrag,
    zoomIn,
    zoomOut,
    setZoom,
    addTrack,
  } = useTimeline();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Multi-select mode
      if (e.ctrlKey || e.metaKey) {
        setMultiSelectMode(true);
      }

      // Space to play/pause
      if (e.code === 'Space' && !e.target) {
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      }

      // Delete selected clips
      if (e.code === 'Delete' || e.code === 'Backspace') {
        const selected = Array.from(selectedClipIds);
        if (selected.length > 0) {
          e.preventDefault();
          selected.forEach(clipId => {
            useTimelineStore.getState().removeClip(clipId);
          });
          clearClipSelection();
        }
      }

      // Zoom shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.code === 'Equal' || e.code === 'NumpadAdd') {
          e.preventDefault();
          zoomIn();
        } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
          e.preventDefault();
          zoomOut();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setMultiSelectMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, play, pause, selectedClipIds, clearClipSelection, zoomIn, zoomOut, setMultiSelectMode]);

  // Auto-scroll to keep playhead visible during playback
  useEffect(() => {
    if (!isPlaying || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const playheadPosition = currentTime * zoom;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Scroll if playhead is near edge
    if (playheadPosition > scrollLeft + containerWidth - 100) {
      container.scrollLeft = playheadPosition - containerWidth + 100;
    } else if (playheadPosition < scrollLeft + 100) {
      container.scrollLeft = playheadPosition - 100;
    }
  }, [currentTime, zoom, isPlaying]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentFrameTime: number) => {
      const deltaTime = (currentFrameTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentFrameTime;

      const newTime = currentTime + deltaTime;

      if (newTime >= duration) {
        // Stop at end
        stop();
      } else {
        setCurrentTime(newTime);
      }

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, currentTime, duration, setCurrentTime, stop]);

  const handleClipSelect = useCallback((clipId: string, multi: boolean) => {
    if (multi) {
      setMultiSelectMode(true);
      selectClip(clipId);
    } else {
      setMultiSelectMode(false);
      clearClipSelection();
      selectClip(clipId);
    }
  }, [selectClip, clearClipSelection, setMultiSelectMode]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // Clear selection when clicking empty area
    if (e.target === e.currentTarget) {
      clearClipSelection();
    }
  }, [clearClipSelection]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
  }, [setCurrentTime]);

  const totalHeight = tracks.reduce((sum, track) => sum + (track.height || 60), 0);
  const timelineWidth = duration * zoom;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Controls */}
      <TimelineControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        zoom={zoom}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        onZoomChange={setZoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onAddTrack={addTrack}
      />

      {/* Timeline area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Time ruler */}
        <div className="relative flex">
          {/* Track header spacer */}
          <div className="w-48 flex-shrink-0 bg-gray-800 border-r border-b border-gray-700" />

          {/* Scrollable ruler */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            <TimeRuler
              duration={duration}
              zoom={zoom}
              onSeek={handleSeek}
            />
          </div>
        </div>

        {/* Tracks area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tracks container */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            onClick={handleContainerClick}
          >
            <div className="flex">
              {/* Track list */}
              <div className="flex-shrink-0">
                {tracks.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No tracks yet. Click "Add Track" to get started.</p>
                  </div>
                ) : (
                  tracks.map((track) => (
                    <TimelineTrack
                      key={track.id}
                      track={track}
                      zoom={zoom}
                      selectedClipIds={selectedClipIds}
                      onClipSelect={handleClipSelect}
                      onClipDragEnd={handleClipDrag}
                      onClipResize={handleClipResize}
                      onToggleLock={() => toggleTrackLock(track.id)}
                      onToggleMute={() => toggleTrackMute(track.id)}
                      onToggleVisibility={() => toggleTrackVisibility(track.id)}
                    />
                  ))
                )}
              </div>

              {/* Scrollable timeline content */}
              <div
                ref={tracksContainerRef}
                className="relative"
                style={{
                  width: `${timelineWidth}px`,
                  height: tracks.length > 0 ? `${totalHeight}px` : 'auto',
                }}
              >
                {/* Playhead */}
                {tracks.length > 0 && (
                  <Playhead
                    currentTime={currentTime}
                    zoom={zoom}
                    height={totalHeight}
                    onDrag={handlePlayheadDrag}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
