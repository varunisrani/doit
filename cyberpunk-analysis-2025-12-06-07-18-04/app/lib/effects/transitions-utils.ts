/**
 * Transition Utilities
 * Additional helpers and advanced transition features
 */

import {
  Transition,
  TransitionType,
  TransitionDirection,
  TransitionProperties,
  easingFunctions,
  createTransition
} from './transitions';

// ==================== Transition Presets ====================

export interface TransitionPreset {
  id: string;
  name: string;
  description: string;
  transitionIn: {
    type: TransitionType;
    duration: number;
    easing: keyof typeof easingFunctions;
  } | null;
  transitionOut: {
    type: TransitionType;
    duration: number;
    easing: keyof typeof easingFunctions;
  } | null;
}

export const transitionPresets: TransitionPreset[] = [
  {
    id: 'smooth-fade',
    name: 'Smooth Fade',
    description: 'Gentle fade in and out',
    transitionIn: { type: 'fade', duration: 500, easing: 'easeInOutQuad' },
    transitionOut: { type: 'fade', duration: 500, easing: 'easeInOutQuad' }
  },
  {
    id: 'quick-dissolve',
    name: 'Quick Dissolve',
    description: 'Fast dissolve effect',
    transitionIn: { type: 'dissolve', duration: 300, easing: 'easeOutQuad' },
    transitionOut: { type: 'dissolve', duration: 300, easing: 'easeInQuad' }
  },
  {
    id: 'slide-show',
    name: 'Slide Show',
    description: 'Slide from right, fade out',
    transitionIn: { type: 'slide-right', duration: 600, easing: 'easeOutCubic' },
    transitionOut: { type: 'fade', duration: 400, easing: 'easeInQuad' }
  },
  {
    id: 'zoom-impact',
    name: 'Zoom Impact',
    description: 'Zoom in dramatically, zoom out smoothly',
    transitionIn: { type: 'zoom-in', duration: 800, easing: 'easeOutQuart' },
    transitionOut: { type: 'zoom-out', duration: 600, easing: 'easeInCubic' }
  },
  {
    id: 'wipe-clean',
    name: 'Wipe Clean',
    description: 'Left wipe in, right wipe out',
    transitionIn: { type: 'wipe-left', duration: 500, easing: 'linear' },
    transitionOut: { type: 'wipe-right', duration: 500, easing: 'linear' }
  },
  {
    id: 'no-transitions',
    name: 'No Transitions',
    description: 'Clean cuts only',
    transitionIn: null,
    transitionOut: null
  }
];

/**
 * Apply a transition preset to get both in and out transitions
 */
export function applyTransitionPreset(
  presetId: string
): { transitionIn: Transition | null; transitionOut: Transition | null } {
  const preset = transitionPresets.find(p => p.id === presetId);

  if (!preset) {
    return { transitionIn: null, transitionOut: null };
  }

  return {
    transitionIn: preset.transitionIn
      ? createTransition(
          preset.transitionIn.type,
          'in',
          preset.transitionIn.duration,
          preset.transitionIn.easing
        )
      : null,
    transitionOut: preset.transitionOut
      ? createTransition(
          preset.transitionOut.type,
          'out',
          preset.transitionOut.duration,
          preset.transitionOut.easing
        )
      : null
  };
}

// ==================== Transition Animation ====================

/**
 * Animate through a transition for preview
 */
export class TransitionAnimator {
  private animationFrameId: number | null = null;
  private startTime: number = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private transition: Transition,
    private onFrame?: (progress: number) => void,
    private onComplete?: () => void
  ) {}

  start(): void {
    this.startTime = performance.now();
    this.animate();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animate = (): void => {
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.transition.duration, 1);

    if (this.onFrame) {
      this.onFrame(progress);
    }

    if (progress < 1) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else {
      this.animationFrameId = null;
      if (this.onComplete) {
        this.onComplete();
      }
    }
  };
}

// ==================== Transition Compatibility ====================

/**
 * Check if two transitions work well together
 */
export function checkTransitionCompatibility(
  type1: TransitionType,
  type2: TransitionType
): { compatible: boolean; reason?: string } {
  // Wipes don't combine well with other wipes in different directions
  const wipeTypes = ['wipe-left', 'wipe-right', 'wipe-up', 'wipe-down'];

  if (wipeTypes.includes(type1) && wipeTypes.includes(type2)) {
    if (type1 !== type2) {
      return {
        compatible: false,
        reason: 'Different wipe directions may look jarring'
      };
    }
  }

  // Zoom in followed by zoom out can be disorienting if durations are similar
  if (
    (type1 === 'zoom-in' && type2 === 'zoom-out') ||
    (type1 === 'zoom-out' && type2 === 'zoom-in')
  ) {
    return {
      compatible: true,
      reason: 'Consider using different durations for better effect'
    };
  }

  return { compatible: true };
}

/**
 * Suggest complementary transition
 */
export function suggestComplementaryTransition(
  existingType: TransitionType,
  existingDirection: TransitionDirection
): TransitionType {
  const oppositeDirection = existingDirection === 'in' ? 'out' : 'in';

  // Mapping of transitions to their complements
  const complements: Record<TransitionType, TransitionType> = {
    'none': 'none',
    'fade': 'fade',
    'dissolve': 'dissolve',
    'slide-left': 'slide-right',
    'slide-right': 'slide-left',
    'slide-up': 'slide-down',
    'slide-down': 'slide-up',
    'zoom-in': 'fade', // Zoom in pairs well with fade out
    'zoom-out': 'fade', // Zoom out pairs well with fade in
    'wipe-left': 'wipe-right',
    'wipe-right': 'wipe-left',
    'wipe-up': 'wipe-down',
    'wipe-down': 'wipe-up'
  };

  return complements[existingType] || 'fade';
}

// ==================== Transition Analysis ====================

/**
 * Analyze transition for potential issues
 */
export interface TransitionIssue {
  severity: 'warning' | 'error';
  message: string;
}

export function analyzeTransition(
  transition: Transition,
  clipDuration: number,
  otherTransition?: Transition | null
): TransitionIssue[] {
  const issues: TransitionIssue[] = [];

  // Check duration vs clip length
  if (transition.duration > clipDuration * 0.5) {
    issues.push({
      severity: 'warning',
      message: `Transition duration (${transition.duration}ms) exceeds 50% of clip duration`
    });
  }

  // Check for overlapping transitions
  if (otherTransition) {
    const totalDuration = transition.duration + otherTransition.duration;
    if (totalDuration > clipDuration) {
      issues.push({
        severity: 'error',
        message: `Combined transition durations (${totalDuration}ms) exceed clip duration (${clipDuration}ms)`
      });
    }
  }

  // Check for very short durations
  if (transition.duration < 100) {
    issues.push({
      severity: 'warning',
      message: 'Transition duration is very short and may not be noticeable'
    });
  }

  // Check for very long durations
  if (transition.duration > 2000) {
    issues.push({
      severity: 'warning',
      message: 'Transition duration is very long and may feel sluggish'
    });
  }

  return issues;
}

// ==================== Transition Timing Helpers ====================

/**
 * Calculate optimal transition duration based on clip length
 */
export function calculateOptimalDuration(
  clipDuration: number,
  transitionType: TransitionType
): number {
  // Base durations for different clip lengths
  let baseDuration: number;

  if (clipDuration < 1000) {
    baseDuration = 200; // Very short clips
  } else if (clipDuration < 3000) {
    baseDuration = 400; // Short clips
  } else if (clipDuration < 10000) {
    baseDuration = 600; // Medium clips
  } else {
    baseDuration = 800; // Long clips
  }

  // Adjust based on transition type
  const typeMultipliers: Partial<Record<TransitionType, number>> = {
    'fade': 0.8,
    'dissolve': 1.2,
    'slide-left': 1.0,
    'slide-right': 1.0,
    'slide-up': 1.0,
    'slide-down': 1.0,
    'zoom-in': 1.3,
    'zoom-out': 1.3,
    'wipe-left': 0.9,
    'wipe-right': 0.9,
    'wipe-up': 0.9,
    'wipe-down': 0.9
  };

  const multiplier = typeMultipliers[transitionType] ?? 1.0;
  const calculatedDuration = baseDuration * multiplier;

  // Ensure it doesn't exceed 30% of clip duration
  return Math.min(calculatedDuration, clipDuration * 0.3);
}

/**
 * Sync transition duration to music beat
 */
export function syncTransitionToBeat(
  bpm: number,
  beats: number = 1
): number {
  const beatDuration = (60 / bpm) * 1000; // Convert to milliseconds
  return beatDuration * beats;
}

// ==================== Batch Transition Operations ====================

/**
 * Create alternating transitions for multiple clips
 */
export function createAlternatingTransitions(
  clipCount: number,
  transitions: [TransitionType, TransitionType]
): Array<{ in: TransitionType; out: TransitionType }> {
  const result: Array<{ in: TransitionType; out: TransitionType }> = [];

  for (let i = 0; i < clipCount; i++) {
    const transitionIndex = i % 2;
    result.push({
      in: transitions[transitionIndex],
      out: transitions[transitionIndex]
    });
  }

  return result;
}

/**
 * Create progressive transitions (increasing or decreasing duration)
 */
export function createProgressiveTransitions(
  clipCount: number,
  startDuration: number,
  endDuration: number,
  transitionType: TransitionType
): Transition[] {
  const transitions: Transition[] = [];
  const durationStep = (endDuration - startDuration) / (clipCount - 1);

  for (let i = 0; i < clipCount; i++) {
    const duration = startDuration + (durationStep * i);
    transitions.push(
      createTransition(transitionType, 'in', duration, 'easeInOutQuad')
    );
  }

  return transitions;
}

// ==================== Transition Effects Combinations ====================

/**
 * Combine multiple property modifications
 */
export function combineTransitionProperties(
  ...propertiesList: TransitionProperties[]
): TransitionProperties {
  if (propertiesList.length === 0) {
    throw new Error('At least one properties object is required');
  }

  const combined = { ...propertiesList[0] };

  for (let i = 1; i < propertiesList.length; i++) {
    const props = propertiesList[i];

    // Multiply opacity values
    combined.opacity *= props.opacity;

    // Add position offsets
    combined.x += props.x;
    combined.y += props.y;

    // Multiply scale values
    combined.scale *= props.scale;

    // Use most restrictive clip mask
    if (combined.clipMask && props.clipMask) {
      combined.clipMask = {
        x: Math.max(combined.clipMask.x, props.clipMask.x),
        y: Math.max(combined.clipMask.y, props.clipMask.y),
        width: Math.min(combined.clipMask.width, props.clipMask.width),
        height: Math.min(combined.clipMask.height, props.clipMask.height)
      };
    }
  }

  return combined;
}

// ==================== Keyboard Shortcuts ====================

export interface TransitionShortcut {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
  transitionType: TransitionType;
  direction: TransitionDirection;
}

export const defaultTransitionShortcuts: TransitionShortcut[] = [
  { key: 'f', transitionType: 'fade', direction: 'in' },
  { key: 'f', modifiers: { shift: true }, transitionType: 'fade', direction: 'out' },
  { key: 'd', transitionType: 'dissolve', direction: 'in' },
  { key: 's', transitionType: 'slide-left', direction: 'in' },
  { key: 's', modifiers: { shift: true }, transitionType: 'slide-right', direction: 'in' },
  { key: 'z', transitionType: 'zoom-in', direction: 'in' },
  { key: 'z', modifiers: { shift: true }, transitionType: 'zoom-out', direction: 'in' }
];

/**
 * Match keyboard event to transition shortcut
 */
export function matchTransitionShortcut(
  event: KeyboardEvent
): TransitionShortcut | null {
  return defaultTransitionShortcuts.find(shortcut => {
    if (shortcut.key.toLowerCase() !== event.key.toLowerCase()) {
      return false;
    }

    const modifiers = shortcut.modifiers ?? {};

    return (
      (!!modifiers.ctrl === event.ctrlKey || event.metaKey) &&
      (!!modifiers.alt === event.altKey) &&
      (!!modifiers.shift === event.shiftKey)
    );
  }) ?? null;
}

// ==================== Transition History ====================

export interface TransitionHistoryEntry {
  timestamp: number;
  clipId: string;
  direction: TransitionDirection;
  previousTransition: Transition | null;
  newTransition: Transition | null;
}

export class TransitionHistory {
  private history: TransitionHistoryEntry[] = [];
  private maxEntries = 50;

  add(entry: TransitionHistoryEntry): void {
    this.history.push(entry);
    if (this.history.length > this.maxEntries) {
      this.history.shift();
    }
  }

  getRecent(count = 10): TransitionHistoryEntry[] {
    return this.history.slice(-count);
  }

  getForClip(clipId: string): TransitionHistoryEntry[] {
    return this.history.filter(entry => entry.clipId === clipId);
  }

  getMostUsedTransition(): TransitionType | null {
    const counts = new Map<TransitionType, number>();

    this.history.forEach(entry => {
      if (entry.newTransition) {
        const current = counts.get(entry.newTransition.type) ?? 0;
        counts.set(entry.newTransition.type, current + 1);
      }
    });

    let maxCount = 0;
    let mostUsed: TransitionType | null = null;

    counts.forEach((count, type) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = type;
      }
    });

    return mostUsed;
  }

  clear(): void {
    this.history = [];
  }
}

// ==================== Export ====================

export default {
  transitionPresets,
  applyTransitionPreset,
  TransitionAnimator,
  checkTransitionCompatibility,
  suggestComplementaryTransition,
  analyzeTransition,
  calculateOptimalDuration,
  syncTransitionToBeat,
  createAlternatingTransitions,
  createProgressiveTransitions,
  combineTransitionProperties,
  defaultTransitionShortcuts,
  matchTransitionShortcut,
  TransitionHistory
};
