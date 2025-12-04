// Default Values and Constants

import type {
  ProjectSettings,
  EditorState,
  PlaybackState,
  ViewportState,
  UIState,
  GridConfig,
  Ruler,
} from '../types';

// Default Project Settings
export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 60000, // 60 seconds in ms
  backgroundColor: '#000000',
  aspectRatio: '16:9',
};

// Canvas Size Presets
export const CANVAS_PRESETS = {
  // Video Resolutions
  '4K': { width: 3840, height: 2160, aspectRatio: '16:9' },
  '1440p': { width: 2560, height: 1440, aspectRatio: '16:9' },
  '1080p': { width: 1920, height: 1080, aspectRatio: '16:9' },
  '720p': { width: 1280, height: 720, aspectRatio: '16:9' },
  '480p': { width: 854, height: 480, aspectRatio: '16:9' },

  // Social Media
  'Instagram Post': { width: 1080, height: 1080, aspectRatio: '1:1' },
  'Instagram Story': { width: 1080, height: 1920, aspectRatio: '9:16' },
  'TikTok': { width: 1080, height: 1920, aspectRatio: '9:16' },
  'YouTube Thumbnail': { width: 1280, height: 720, aspectRatio: '16:9' },
  'Facebook Post': { width: 1200, height: 630, aspectRatio: '1.91:1' },
  'Twitter Post': { width: 1200, height: 675, aspectRatio: '16:9' },

  // Classic
  '4:3': { width: 1024, height: 768, aspectRatio: '4:3' },
  'Square': { width: 1080, height: 1080, aspectRatio: '1:1' },
} as const;

// FPS Options
export const FPS_OPTIONS = [24, 25, 30, 50, 60] as const;

export const DEFAULT_FPS = 30;

// Default Editor State
export const DEFAULT_EDITOR_STATE: EditorState = {
  currentTool: 'select',
  selectedElementIds: [],
  selectedClipIds: [],
  zoom: 1.0,
  gridVisible: true,
  snapToGrid: true,
  gridSize: 20,
  guidesVisible: true,
  playbackState: {
    isPlaying: false,
    isPaused: false,
    isStopped: true,
    playbackSpeed: 1.0,
    loop: false,
    startTime: 0,
    endTime: 0,
  },
  currentTime: 0,
  isDragging: false,
  isResizing: false,
  isRotating: false,
  canvasOffset: { x: 0, y: 0 },
};

// Default Playback State
export const DEFAULT_PLAYBACK_STATE: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  isStopped: true,
  playbackSpeed: 1.0,
  loop: false,
  startTime: 0,
  endTime: 0,
};

// Playback Speed Options
export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0] as const;

// Default Viewport State
export const DEFAULT_VIEWPORT_STATE: ViewportState = {
  width: 1920,
  height: 1080,
  zoom: 1.0,
  offsetX: 0,
  offsetY: 0,
  fitMode: 'fit',
};

// Zoom Limits
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5.0;
export const ZOOM_STEP = 0.1;
export const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0] as const;

// Default UI State
export const DEFAULT_UI_STATE: UIState = {
  leftPanelOpen: true,
  rightPanelOpen: true,
  timelineHeight: 250,
  activePanel: null,
  modalsOpen: {
    export: false,
    project: false,
    settings: false,
    shortcuts: false,
  },
  notifications: [],
};

// Panel Dimensions
export const PANEL_DIMENSIONS = {
  LEFT_PANEL_WIDTH: 300,
  RIGHT_PANEL_WIDTH: 320,
  MIN_TIMELINE_HEIGHT: 150,
  MAX_TIMELINE_HEIGHT: 600,
  DEFAULT_TIMELINE_HEIGHT: 250,
  TRACK_HEIGHT: 60,
  MIN_TRACK_HEIGHT: 40,
  MAX_TRACK_HEIGHT: 120,
} as const;

// Grid Configuration
export const DEFAULT_GRID_CONFIG: GridConfig = {
  enabled: true,
  size: 20,
  color: '#333333',
  opacity: 0.5,
  snap: true,
};

// Ruler Configuration
export const DEFAULT_RULER_CONFIG: Ruler = {
  enabled: true,
  color: '#ffffff',
  backgroundColor: '#1a1a1a',
  fontSize: 10,
  unit: 'px',
};

// Timeline Defaults
export const TIMELINE_DEFAULTS = {
  ZOOM: 0.1, // pixels per millisecond
  MIN_ZOOM: 0.01,
  MAX_ZOOM: 1.0,
  SNAP_THRESHOLD: 100, // ms
  PLAYHEAD_WIDTH: 2,
  PLAYHEAD_COLOR: '#ff0000',
  MARKER_HEIGHT: 12,
  TIME_RULER_HEIGHT: 30,
} as const;

// Snap Threshold
export const SNAP_THRESHOLD = 10; // pixels

// Selection Handle Size
export const SELECTION_HANDLE_SIZE = 8;

// Transform Defaults
export const DEFAULT_TRANSFORM = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  anchorX: 0.5,
  anchorY: 0.5,
  flipX: false,
  flipY: false,
} as const;

// Element Style Defaults
export const DEFAULT_ELEMENT_STYLE = {
  opacity: 1,
  blendMode: 'normal' as const,
  zIndex: 0,
} as const;

// Text Defaults
export const DEFAULT_TEXT_PROPERTIES = {
  content: 'Double-click to edit',
  fontFamily: 'Inter',
  fontSize: 48,
  fontWeight: 400 as const,
  fontStyle: 'normal' as const,
  textDecoration: 'none' as const,
  color: '#ffffff',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
  lineHeight: 1.2,
  letterSpacing: 0,
  wordSpacing: 0,
  autoSize: true,
} as const;

// Available Fonts (System + Google Fonts)
export const AVAILABLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Bebas Neue',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
] as const;

// Shape Defaults
export const DEFAULT_SHAPE_PROPERTIES = {
  fillColor: '#3b82f6',
  strokeColor: '#000000',
  strokeWidth: 2,
} as const;

// Filter Defaults
export const DEFAULT_FILTER_VALUES = {
  brightness: 0,      // -100 to 100
  contrast: 0,        // -100 to 100
  saturation: 0,      // -100 to 100
  blur: 0,            // 0 to 50
  hueRotate: 0,       // 0 to 360
  grayscale: 0,       // 0 to 100
  sepia: 0,           // 0 to 100
  invert: 0,          // 0 to 100
  opacity: 100,       // 0 to 100
} as const;

// Transition Defaults
export const DEFAULT_TRANSITION_DURATION = 500; // ms

// Animation Defaults
export const DEFAULT_ANIMATION_DURATION = 1000; // ms
export const DEFAULT_EASING = 'easeInOut' as const;

// History Settings
export const MAX_HISTORY_SIZE = 50;

// Auto-save Settings
export const AUTO_SAVE_INTERVAL = 60000; // 60 seconds
export const MAX_AUTO_SAVE_VERSIONS = 10;

// Export Defaults
export const DEFAULT_EXPORT_SETTINGS = {
  format: 'mp4' as const,
  resolution: '1080p' as const,
  fps: 30,
  quality: 'high' as const,
  includeAudio: true,
} as const;

// File Upload Limits
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_DIMENSION = 4096; // 4K max
export const SUPPORTED_IMAGE_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'] as const;
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm'] as const;
export const SUPPORTED_AUDIO_FORMATS = ['audio/mp3', 'audio/wav', 'audio/ogg'] as const;

// Performance Settings
export const PERFORMANCE = {
  MAX_CANVAS_SIZE: 4096,
  MAX_ELEMENTS: 1000,
  MAX_TRACKS: 20,
  MAX_CLIPS: 500,
  DEBOUNCE_DELAY: 100, // ms
  THROTTLE_DELAY: 16,  // ms (~60fps)
  RENDER_BATCH_SIZE: 10,
} as const;

// Layer Limits
export const MIN_LAYER_ORDER = 0;
export const MAX_LAYER_ORDER = 9999;

// Color Palette (for UI)
export const COLOR_PALETTE = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',

  // Track Colors
  trackColors: [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // orange
    '#10b981', // green
    '#06b6d4', // cyan
    '#ef4444', // red
    '#6366f1', // indigo
  ],
} as const;

// Timeline Track Types
export const TRACK_TYPE_COLORS = {
  video: '#3b82f6',
  audio: '#10b981',
  text: '#f59e0b',
  effect: '#8b5cf6',
} as const;

// Notification Duration
export const NOTIFICATION_DURATION = 5000; // ms

// Cursor Styles
export const CURSORS = {
  default: 'default',
  pointer: 'pointer',
  move: 'move',
  text: 'text',
  crosshair: 'crosshair',
  'ns-resize': 'ns-resize',
  'ew-resize': 'ew-resize',
  'nesw-resize': 'nesw-resize',
  'nwse-resize': 'nwse-resize',
  grab: 'grab',
  grabbing: 'grabbing',
  'not-allowed': 'not-allowed',
} as const;

// Version
export const APP_VERSION = '1.0.0';
export const PROJECT_VERSION = '1.0';

// LocalStorage Keys
export const STORAGE_KEYS = {
  PROJECT: 'video-editor-project',
  SETTINGS: 'video-editor-settings',
  AUTO_SAVE: 'video-editor-autosave',
  RECENT_PROJECTS: 'video-editor-recent',
  UI_STATE: 'video-editor-ui-state',
} as const;
