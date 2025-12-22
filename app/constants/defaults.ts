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
  backgroundColor: '#ffffff',
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
  color: '#1a1a1a',           // Dark text on light background
  backgroundColor: '#f8f9fa', // Light gray background
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

// Shape Defaults - RED THEME
export const DEFAULT_SHAPE_PROPERTIES = {
  fillColor: '#dc2626',         // Red 600 - Updated to match red theme
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

// Modern Design System Color Palette
export const COLOR_PALETTE = {
  // Brand Colors - Red Theme
  primary: '#dc2626',           // Red 600 - Main brand color
  primaryLight: '#ef4444',      // Red 500 - Hover states
  primaryDark: '#b91c1c',       // Red 700 - Active/pressed states

  accent: '#f87171',            // Red 400 - Secondary accent
  accentLight: '#fca5a5',       // Red 300 - Light accents
  accentDark: '#dc2626',        // Red 600 - Dark accents

  // Semantic Colors
  success: '#059669',           // Emerald 600
  successLight: '#10b981',      // Emerald 500
  successBg: '#ecfdf5',         // Light green background

  warning: '#ea580c',           // Orange 600
  warningLight: '#f97316',      // Orange 500
  warningBg: '#fffbeb',         // Light orange background

  error: '#dc2626',             // Red 600
  errorLight: '#ef4444',        // Red 500
  errorBg: '#fef2f2',           // Light red background

  info: '#0891b2',              // Cyan 600
  infoLight: '#06b6d4',         // Cyan 500
  infoBg: '#ecfeff',            // Light cyan background

  // Surface Colors - RED THEME
  background: '#fefefe',        // Very subtle red-tinted white
  surface: '#fdf2f2',           // Red 50 - Light red surface
  surfaceElevated: '#ffffff',   // Pure white for elevation
  surfaceHover: '#fef1f1',      // Slightly warmer hover state

  // Text Hierarchy - For white background
  textPrimary: '#1a1a1a',       // Near-black primary text
  textSecondary: '#5f6368',     // Medium gray secondary text
  textTertiary: '#9aa0a6',      // Light gray tertiary/disabled text
  textInverse: '#ffffff',       // White text on colored backgrounds

  // Border System - RED THEME
  borderPrimary: '#fecaca',     // Red 200 - Light red borders
  borderSecondary: '#f87171',   // Red 400 - Secondary borders
  borderFocus: '#dc2626',       // Red focus borders
  borderError: '#991b1b',       // Red 800 - Error borders

  // Timeline Colors - RED THEME
  timelineBg: '#fdf2f2',        // Light red background
  timelineTrack: '#fecaca',     // Red 200 - Track background
  timelineTrackHover: '#fca5a5', // Red 300 - Hover state
  playhead: '#dc2626',          // Red 600 - Playhead
  rulerText: '#5f6368',
  canvasBorder: '#fecaca',      // Red 200 - Canvas border

  // Track Type Colors (for timeline) - RED THEME
  trackColors: [
    '#dc2626', // red - video (updated to match red theme)
    '#10b981', // green - audio
    '#f59e0b', // orange - text
    '#7c2d92', // purple with red undertone - effects
    '#ec4899', // pink - transitions
    '#06b6d4', // cyan - overlays
    '#ef4444', // red - markers
    '#6366f1', // indigo - subtitles
  ],
} as const;

// Timeline Track Types - RED THEME
export const TRACK_TYPE_COLORS = {
  video: '#dc2626',      // Red 600 - Updated to match red theme
  audio: '#10b981',      // Emerald 500
  text: '#f59e0b',       // Orange 500
  effect: '#7c2d92',     // Purple with red undertone
  transition: '#ec4899', // Pink 500
  overlay: '#06b6d4',    // Cyan 500
  marker: '#ef4444',     // Red 500
  subtitle: '#6366f1',   // Indigo 500
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

// ========== DESIGN SYSTEM CONSTANTS ==========

// Spacing System (8-point grid)
export const SPACING = {
  0: 0,
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  16: 64,  // 4rem
  20: 80,  // 5rem
  24: 96,  // 6rem
  32: 128, // 8rem
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,    // 0.75rem
    sm: 14,    // 0.875rem
    base: 16,  // 1rem
    lg: 18,    // 1.125rem
    xl: 20,    // 1.25rem
    '2xl': 24, // 1.5rem
    '3xl': 30, // 1.875rem
    '4xl': 36, // 2.25rem
    '5xl': 48, // 3rem
    '6xl': 60, // 3.75rem
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

// Border Radius System
export const BORDER_RADIUS = {
  none: 0,
  sm: 2,     // 0.125rem
  DEFAULT: 4, // 0.25rem
  md: 6,     // 0.375rem
  lg: 8,     // 0.5rem
  xl: 12,    // 0.75rem
  '2xl': 16, // 1rem
  full: 9999,
} as const;

// Shadow System
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.5)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.6)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.7)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
} as const;

// Animation Easing
export const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Transition Durations
export const TRANSITION_DURATION = {
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

// Z-Index Scale
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  skipLink: 10000,
} as const;

// Breakpoints (for reference)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
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
