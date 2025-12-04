/**
 * Comprehensive TypeScript Types for Transitions System
 */

import {
  TransitionType,
  TransitionDirection,
  Transition,
  TransitionProperties,
  TransitionCategory,
  TransitionMetadata,
  EasingFunction
} from '@/app/lib/effects/transitions';

// ==================== Clip Types ====================

export interface BaseClip {
  id: string;
  startTime: number;
  endTime: number;
  trackIndex: number;
}

export interface VideoClipTransitions {
  transitionIn?: Transition | null;
  transitionOut?: Transition | null;
}

export interface ClipWithTransitions extends BaseClip, VideoClipTransitions {
  type: 'video' | 'image' | 'audio';
  source: string;
  element?: HTMLVideoElement | HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ==================== Timeline Types ====================

export interface TimelineTransitionConfig {
  showTransitionHandles: boolean;
  showTransitionIcons: boolean;
  allowTransitionOverlap: boolean;
  minTransitionDuration: number;
  maxTransitionDuration: number;
  defaultTransitionDuration: number;
}

export interface TransitionHandle {
  clipId: string;
  direction: TransitionDirection;
  position: { x: number; y: number };
  isDragging: boolean;
}

// ==================== UI State Types ====================

export interface TransitionsPanelState {
  activeCategory: string;
  selectedTransition: TransitionType | null;
  transitionDuration: number;
  transitionDirection: TransitionDirection;
  selectedEasing: keyof typeof import('@/app/lib/effects/transitions').easingFunctions;
  previewPlaying: boolean;
}

export interface TransitionDragData {
  type: TransitionType;
  direction: TransitionDirection;
  duration: number;
  easing: string;
}

// ==================== Rendering Types ====================

export interface TransitionRenderContext {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  currentTime: number;
  pixelsPerMs: number;
}

export interface TransitionRenderOptions {
  quality: 'low' | 'medium' | 'high';
  antialiasing: boolean;
  showDebugInfo: boolean;
}

// ==================== Event Types ====================

export type TransitionEventType =
  | 'transition-added'
  | 'transition-removed'
  | 'transition-updated'
  | 'transition-duration-changed';

export interface TransitionEvent {
  type: TransitionEventType;
  clipId: string;
  transition: Transition | null;
  direction: TransitionDirection;
  timestamp: number;
}

export type TransitionEventHandler = (event: TransitionEvent) => void;

// ==================== Validation Types ====================

export interface TransitionValidationResult {
  valid: boolean;
  errors: TransitionValidationError[];
  warnings: TransitionValidationWarning[];
}

export interface TransitionValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface TransitionValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

// ==================== Preset Types ====================

export interface TransitionPresetConfig {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  transitionIn: TransitionConfig | null;
  transitionOut: TransitionConfig | null;
  tags: string[];
}

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  easing: keyof typeof import('@/app/lib/effects/transitions').easingFunctions;
  customProperties?: Record<string, any>;
}

// ==================== Animation Types ====================

export interface TransitionAnimation {
  id: string;
  transition: Transition;
  startTime: number;
  isPlaying: boolean;
  progress: number;
}

export interface TransitionAnimationFrame {
  timestamp: number;
  progress: number;
  properties: TransitionProperties;
}

export type AnimationFrameCallback = (frame: TransitionAnimationFrame) => void;

// ==================== Export/Import Types ====================

export interface SerializedTransition {
  id: string;
  type: TransitionType;
  direction: TransitionDirection;
  duration: number;
  easing: string;
  version: string;
}

export interface TransitionExportData {
  clipId: string;
  transitionIn: SerializedTransition | null;
  transitionOut: SerializedTransition | null;
  metadata: {
    exportedAt: number;
    exportedBy: string;
    version: string;
  };
}

export interface ProjectTransitionsData {
  clips: Record<string, {
    transitionIn: SerializedTransition | null;
    transitionOut: SerializedTransition | null;
  }>;
  globalSettings: TimelineTransitionConfig;
  version: string;
}

// ==================== Performance Types ====================

export interface TransitionPerformanceMetrics {
  renderTime: number;
  calculationTime: number;
  frameRate: number;
  droppedFrames: number;
}

export interface TransitionCacheEntry {
  key: string;
  properties: TransitionProperties;
  timestamp: number;
  hitCount: number;
}

// ==================== Store/State Management Types ====================

export interface TransitionsState {
  clips: Record<string, ClipWithTransitions>;
  selectedClipId: string | null;
  panelState: TransitionsPanelState;
  config: TimelineTransitionConfig;
  history: TransitionHistoryState;
  cache: TransitionCacheState;
}

export interface TransitionHistoryState {
  entries: Array<{
    clipId: string;
    direction: TransitionDirection;
    previousTransition: SerializedTransition | null;
    newTransition: SerializedTransition | null;
    timestamp: number;
  }>;
  currentIndex: number;
}

export interface TransitionCacheState {
  entries: Map<string, TransitionCacheEntry>;
  maxSize: number;
  currentSize: number;
}

// ==================== Action Types ====================

export type TransitionsAction =
  | { type: 'ADD_TRANSITION'; payload: AddTransitionPayload }
  | { type: 'REMOVE_TRANSITION'; payload: RemoveTransitionPayload }
  | { type: 'UPDATE_TRANSITION_DURATION'; payload: UpdateDurationPayload }
  | { type: 'SELECT_CLIP'; payload: SelectClipPayload }
  | { type: 'SET_PANEL_STATE'; payload: Partial<TransitionsPanelState> }
  | { type: 'APPLY_PRESET'; payload: ApplyPresetPayload }
  | { type: 'CLEAR_ALL_TRANSITIONS' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export interface AddTransitionPayload {
  clipId: string;
  transitionType: TransitionType;
  direction: TransitionDirection;
  duration?: number;
  easing?: keyof typeof import('@/app/lib/effects/transitions').easingFunctions;
}

export interface RemoveTransitionPayload {
  clipId: string;
  direction: TransitionDirection;
}

export interface UpdateDurationPayload {
  clipId: string;
  direction: TransitionDirection;
  duration: number;
}

export interface SelectClipPayload {
  clipId: string | null;
}

export interface ApplyPresetPayload {
  clipId: string;
  presetId: string;
}

// ==================== Hook Return Types ====================

export interface UseTransitionsReturn {
  // State
  clips: Record<string, ClipWithTransitions>;
  selectedClip: ClipWithTransitions | null;
  panelState: TransitionsPanelState;

  // Actions
  addTransition: (
    clipId: string,
    type: TransitionType,
    direction: TransitionDirection
  ) => void;
  removeTransition: (clipId: string, direction: TransitionDirection) => void;
  updateDuration: (
    clipId: string,
    direction: TransitionDirection,
    duration: number
  ) => void;
  selectClip: (clipId: string | null) => void;
  applyPreset: (clipId: string, presetId: string) => void;

  // Utilities
  getTransition: (
    clipId: string,
    direction: TransitionDirection
  ) => Transition | null;
  validateTransition: (
    clipId: string,
    transition: Transition
  ) => TransitionValidationResult;
  canApplyTransition: (clipId: string, direction: TransitionDirection) => boolean;
}

export interface UseTransitionRenderReturn {
  renderClip: (
    clip: ClipWithTransitions,
    currentTime: number
  ) => void;
  renderTimeline: (currentTime: number) => void;
  getTransitionProperties: (
    clipId: string,
    currentTime: number
  ) => TransitionProperties | null;
}

export interface UseTransitionPreviewReturn {
  isPlaying: boolean;
  progress: number;
  currentFrame: TransitionAnimationFrame | null;
  play: () => void;
  pause: () => void;
  reset: () => void;
  seek: (progress: number) => void;
}

// ==================== Component Props Types ====================

export interface TransitionsPanelProps {
  selectedClipId?: string | null;
  onTransitionSelect?: (type: TransitionType, direction: TransitionDirection) => void;
  config?: Partial<TimelineTransitionConfig>;
  presets?: TransitionPresetConfig[];
}

export interface ClipTransitionProps {
  transition: Transition;
  clipWidth: number;
  clipDuration: number;
  position: 'start' | 'end';
  onDurationChange?: (newDuration: number) => void;
  onRemove?: () => void;
  isSelected?: boolean;
  config?: Partial<TimelineTransitionConfig>;
}

export interface ClipTransitionsProps {
  transitionIn?: Transition | null;
  transitionOut?: Transition | null;
  clipWidth: number;
  clipDuration: number;
  onTransitionInChange?: (duration: number) => void;
  onTransitionOutChange?: (duration: number) => void;
  onTransitionInRemove?: () => void;
  onTransitionOutRemove?: () => void;
  selectedTransition?: 'in' | 'out' | null;
  config?: Partial<TimelineTransitionConfig>;
}

export interface TransitionPreviewProps {
  transition: Transition;
  clipElement?: HTMLVideoElement | HTMLImageElement;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onComplete?: () => void;
}

// ==================== Utility Function Types ====================

export type TransitionFactory = (
  type: TransitionType,
  direction: TransitionDirection,
  options?: Partial<{
    duration: number;
    easing: keyof typeof import('@/app/lib/effects/transitions').easingFunctions;
  }>
) => Transition;

export type TransitionValidator = (
  transition: Transition,
  clip: ClipWithTransitions
) => TransitionValidationResult;

export type TransitionRenderer = (
  ctx: CanvasRenderingContext2D,
  clip: ClipWithTransitions,
  currentTime: number,
  options?: TransitionRenderOptions
) => void;

export type TransitionSerializer = (transition: Transition) => SerializedTransition;
export type TransitionDeserializer = (data: SerializedTransition) => Transition | null;

// ==================== Advanced Types ====================

export interface TransitionChain {
  id: string;
  transitions: Transition[];
  totalDuration: number;
}

export interface TransitionBlend {
  transition1: Transition;
  transition2: Transition;
  blendFactor: number; // 0 to 1
}

export interface TransitionKeyframe {
  time: number; // 0 to 1
  properties: Partial<TransitionProperties>;
  easing?: EasingFunction;
}

export interface CustomTransition extends Transition {
  keyframes: TransitionKeyframe[];
  interpolate: (progress: number) => TransitionProperties;
}

// ==================== Plugin/Extension Types ====================

export interface TransitionPlugin {
  id: string;
  name: string;
  version: string;
  transitionTypes: TransitionType[];
  register: (system: TransitionSystem) => void;
  unregister: () => void;
}

export interface TransitionSystem {
  registerType: (type: TransitionType, metadata: TransitionMetadata) => void;
  registerRenderer: (type: TransitionType, renderer: TransitionRenderer) => void;
  registerValidator: (type: TransitionType, validator: TransitionValidator) => void;
}

// ==================== Error Types ====================

export class TransitionError extends Error {
  constructor(
    message: string,
    public code: string,
    public clipId?: string,
    public transitionType?: TransitionType
  ) {
    super(message);
    this.name = 'TransitionError';
  }
}

export class TransitionValidationError extends TransitionError {
  constructor(
    message: string,
    public validationErrors: TransitionValidationError[]
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'TransitionValidationError';
  }
}

export class TransitionRenderError extends TransitionError {
  constructor(
    message: string,
    public renderContext?: TransitionRenderContext
  ) {
    super(message, 'RENDER_ERROR');
    this.name = 'TransitionRenderError';
  }
}

// ==================== Constants ====================

export const TRANSITION_CONSTANTS = {
  MIN_DURATION: 100,
  MAX_DURATION: 5000,
  DEFAULT_DURATION: 500,
  MAX_CLIP_PERCENTAGE: 0.5,
  CACHE_TTL: 5000,
  PREVIEW_FPS: 30,
  HANDLE_SNAP_DISTANCE: 10
} as const;

export const TRANSITION_Z_INDEX = {
  CLIP: 1,
  TRANSITION_OVERLAY: 2,
  TRANSITION_HANDLE: 3,
  TRANSITION_TOOLTIP: 4
} as const;

// ==================== Type Guards ====================

export function isTransition(value: any): value is Transition {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    typeof value.direction === 'string' &&
    typeof value.duration === 'number' &&
    typeof value.easing === 'function'
  );
}

export function isClipWithTransitions(value: any): value is ClipWithTransitions {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.startTime === 'number' &&
    typeof value.endTime === 'number'
  );
}

export function isTransitionEvent(value: any): value is TransitionEvent {
  return (
    value &&
    typeof value.type === 'string' &&
    typeof value.clipId === 'string' &&
    typeof value.timestamp === 'number'
  );
}

// ==================== Export All ====================

export type {
  TransitionType,
  TransitionDirection,
  Transition,
  TransitionProperties,
  TransitionCategory,
  TransitionMetadata,
  EasingFunction
};
