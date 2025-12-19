// Core Editor Types

export type Tool =
  | 'select'
  | 'text'
  | 'shape'
  | 'crop'
  | 'zoom'
  | 'pan';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface ProjectSettings {
  width: number;           // Canvas width (e.g., 1920)
  height: number;          // Canvas height (e.g., 1080)
  fps: number;             // Frames per second (e.g., 30)
  duration: number;        // Total duration in milliseconds
  backgroundColor: string; // Background color (hex)
  aspectRatio?: string;    // e.g., "16:9", "4:3", "1:1"
}

export interface EditorState {
  currentTool: Tool;
  selectedElementIds: string[];
  selectedClipIds: string[];
  zoom: number;            // Canvas zoom level (0.1 to 5.0)
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;        // Grid cell size in pixels
  guidesVisible: boolean;
  playbackState: PlaybackState;
  currentTime: number;     // Current playhead position in ms
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
  canvasOffset: { x: number; y: number }; // Canvas pan offset
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  playbackSpeed: number;   // 0.25, 0.5, 1.0, 1.5, 2.0
  loop: boolean;
  startTime: number;       // Loop start time in ms
  endTime: number;         // Loop end time in ms
}

export interface ViewportState {
  width: number;
  height: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  fitMode: 'fit' | 'fill' | 'actual';
}

export interface SelectionState {
  type: 'element' | 'clip' | 'none';
  ids: string[];
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
}

export interface HistoryState {
  past: EditorSnapshot[];
  present: EditorSnapshot;
  future: EditorSnapshot[];
  maxHistorySize: number;
}

export interface EditorSnapshot {
  timestamp: number;
  action: string;
  data: any;
}

export interface UIState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  timelineHeight: number;
  activePanel: 'media' | 'properties' | 'layers' | 'transitions' | 'filters' | 'export' | null;
  modalsOpen: {
    export: boolean;
    project: boolean;
    settings: boolean;
    shortcuts: boolean;
  };
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  timestamp: number;
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif';
  resolution: ExportResolution;
  fps: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  codec?: string;
  bitrate?: number;
  includeAudio: boolean;
}

export type ExportResolution =
  | '480p'   // 854x480
  | '720p'   // 1280x720
  | '1080p'  // 1920x1080
  | '1440p'  // 2560x1440
  | '4K'     // 3840x2160
  | 'custom';

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'encoding' | 'complete' | 'error';
  progress: number;        // 0 to 100
  currentFrame: number;
  totalFrames: number;
  estimatedTimeRemaining?: number; // in seconds
  error?: string;
}
