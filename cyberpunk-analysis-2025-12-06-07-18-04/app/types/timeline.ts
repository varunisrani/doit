// Timeline Types

import type { CanvasElement } from './elements';
import type { Transition } from './effects';
import type { Keyframe } from './effects';

export type TrackType = 'video' | 'audio' | 'text' | 'effect';

export interface Timeline {
  tracks: Track[];
  duration: number;        // Total timeline duration in ms
  zoom: number;            // Timeline zoom level (px per second)
  scrollPosition: number;  // Horizontal scroll position in px
  snapEnabled: boolean;
  snapThreshold: number;   // Snap distance in ms
  markers: TimelineMarker[];
}

export interface Track {
  id: string;
  type: TrackType;
  name: string;
  clips: Clip[];
  locked: boolean;         // Prevent editing
  visible: boolean;        // Show/hide track content
  muted: boolean;          // Mute audio tracks
  height: number;          // Track height in px
  color?: string;          // Track color for visual organization
  order: number;           // Stacking order (higher = on top)
  collapsed: boolean;      // Minimize track height
}

export interface Clip {
  id: string;
  trackId: string;
  assetId: string | null;  // Reference to Asset in project
  startTime: number;       // Position on timeline in ms
  duration: number;        // Clip length in ms
  inPoint: number;         // Trim start in ms (relative to source)
  outPoint: number;        // Trim end in ms (relative to source)
  element: CanvasElement;  // Visual representation
  transitions: {
    in: Transition | null;
    out: Transition | null;
  };
  keyframes: Keyframe[];
  locked: boolean;
  muted: boolean;
  volume: number;          // 0 to 1
  speed: number;           // Playback speed (0.25 to 4.0)
  reversed: boolean;       // Play in reverse
}

export interface TimelineMarker {
  id: string;
  time: number;            // Position in ms
  label: string;
  color: string;
}

export interface TimelineState {
  playheadPosition: number; // Current time in ms
  selectedClipIds: string[];
  selectedTrackIds: string[];
  isDraggingClip: boolean;
  isResizingClip: boolean;
  dragStartPosition?: number;
  resizeDirection?: 'left' | 'right';
  hoverClipId?: string;
  hoverTrackId?: string;
}

export interface TimeRulerConfig {
  majorTickInterval: number;  // in ms
  minorTickInterval: number;  // in ms
  showFrames: boolean;
  timeFormat: 'ms' | 'frames' | 'timecode'; // Display format
}

export interface TrackGroup {
  id: string;
  name: string;
  trackIds: string[];
  collapsed: boolean;
  color?: string;
}

export interface ClipOperation {
  type: 'move' | 'resize' | 'trim' | 'split' | 'duplicate' | 'delete';
  clipId: string;
  data: any;
}

export interface SnapPoint {
  time: number;
  type: 'clip-start' | 'clip-end' | 'marker' | 'playhead';
  clipId?: string;
  markerId?: string;
}

export interface WaveformData {
  clipId: string;
  peaks: number[];         // Audio peak values
  duration: number;
  sampleRate: number;
  channels: number;
}
