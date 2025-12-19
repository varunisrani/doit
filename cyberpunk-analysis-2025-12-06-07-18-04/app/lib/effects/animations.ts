/**
 * Keyframe Animation System
 * Handles keyframe-based animations for video editor elements
 */

import { EasingType, getEasingFunction } from './easing';

export type AnimatableProperty =
  | 'x'
  | 'y'
  | 'width'
  | 'height'
  | 'rotation'
  | 'scaleX'
  | 'scaleY'
  | 'opacity';

export interface Keyframe {
  id: string;
  time: number; // milliseconds
  property: AnimatableProperty;
  value: number;
  easing: EasingType;
}

export interface AnimationTrack {
  elementId: string;
  property: AnimatableProperty;
  keyframes: Keyframe[];
}

export interface AnimatedValue {
  property: AnimatableProperty;
  value: number;
  interpolated: boolean;
}

/**
 * Get the animated value for a property at a specific time
 */
export const getAnimatedValue = (
  keyframes: Keyframe[],
  property: AnimatableProperty,
  currentTime: number,
  defaultValue?: number
): number | null => {
  // Filter keyframes for this property
  const propertyKeyframes = keyframes
    .filter((kf) => kf.property === property)
    .sort((a, b) => a.time - b.time);

  if (propertyKeyframes.length === 0) {
    return defaultValue ?? null;
  }

  // If before first keyframe, return default or first keyframe value
  if (currentTime <= propertyKeyframes[0].time) {
    return propertyKeyframes[0].value;
  }

  // If after last keyframe, return last keyframe value
  const lastKeyframe = propertyKeyframes[propertyKeyframes.length - 1];
  if (currentTime >= lastKeyframe.time) {
    return lastKeyframe.value;
  }

  // Find the keyframes to interpolate between
  let startKeyframe: Keyframe | null = null;
  let endKeyframe: Keyframe | null = null;

  for (let i = 0; i < propertyKeyframes.length - 1; i++) {
    if (
      currentTime >= propertyKeyframes[i].time &&
      currentTime < propertyKeyframes[i + 1].time
    ) {
      startKeyframe = propertyKeyframes[i];
      endKeyframe = propertyKeyframes[i + 1];
      break;
    }
  }

  if (!startKeyframe || !endKeyframe) {
    return lastKeyframe.value;
  }

  // Calculate interpolated value
  return interpolateValue(startKeyframe, endKeyframe, currentTime);
};

/**
 * Interpolate between two keyframes
 */
export const interpolateValue = (
  startKeyframe: Keyframe,
  endKeyframe: Keyframe,
  currentTime: number
): number => {
  const duration = endKeyframe.time - startKeyframe.time;

  if (duration === 0) {
    return endKeyframe.value;
  }

  // Calculate normalized time (0-1)
  const normalizedTime = (currentTime - startKeyframe.time) / duration;

  // Apply easing function (use the easing from the start keyframe)
  const easingFunction = getEasingFunction(startKeyframe.easing);
  const easedTime = easingFunction(Math.max(0, Math.min(1, normalizedTime)));

  // Linear interpolation with eased time
  const startValue = startKeyframe.value;
  const endValue = endKeyframe.value;
  const interpolatedValue = startValue + (endValue - startValue) * easedTime;

  return interpolatedValue;
};

/**
 * Get all animated values for an element at a specific time
 */
export const getElementAnimatedValues = (
  keyframes: Keyframe[],
  currentTime: number,
  defaultValues?: Partial<Record<AnimatableProperty, number>>
): Record<AnimatableProperty, number> => {
  const properties: AnimatableProperty[] = [
    'x',
    'y',
    'width',
    'height',
    'rotation',
    'scaleX',
    'scaleY',
    'opacity',
  ];

  const values: Partial<Record<AnimatableProperty, number>> = {};

  properties.forEach((property) => {
    const value = getAnimatedValue(
      keyframes,
      property,
      currentTime,
      defaultValues?.[property]
    );
    if (value !== null) {
      values[property] = value;
    }
  });

  return values as Record<AnimatableProperty, number>;
};

/**
 * Calculate intermediate values for smooth animation preview
 */
export const calculateIntermediateValues = (
  startKeyframe: Keyframe,
  endKeyframe: Keyframe,
  steps: number = 60
): Array<{ time: number; value: number }> => {
  const duration = endKeyframe.time - startKeyframe.time;
  const intermediateValues: Array<{ time: number; value: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const time = startKeyframe.time + duration * progress;
    const value = interpolateValue(startKeyframe, endKeyframe, time);
    intermediateValues.push({ time, value });
  }

  return intermediateValues;
};

/**
 * Find keyframes around a specific time
 */
export const findSurroundingKeyframes = (
  keyframes: Keyframe[],
  property: AnimatableProperty,
  currentTime: number
): { before: Keyframe | null; after: Keyframe | null; exact: Keyframe | null } => {
  const propertyKeyframes = keyframes
    .filter((kf) => kf.property === property)
    .sort((a, b) => a.time - b.time);

  // Check for exact match
  const exact = propertyKeyframes.find((kf) => kf.time === currentTime) || null;

  let before: Keyframe | null = null;
  let after: Keyframe | null = null;

  for (const kf of propertyKeyframes) {
    if (kf.time < currentTime) {
      before = kf;
    } else if (kf.time > currentTime && !after) {
      after = kf;
      break;
    }
  }

  return { before, after, exact };
};

/**
 * Create a new keyframe
 */
export const createKeyframe = (
  property: AnimatableProperty,
  time: number,
  value: number,
  easing: EasingType = 'linear'
): Keyframe => {
  return {
    id: `kf_${property}_${time}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    time,
    property,
    value,
    easing,
  };
};

/**
 * Update a keyframe
 */
export const updateKeyframe = (
  keyframe: Keyframe,
  updates: Partial<Omit<Keyframe, 'id'>>
): Keyframe => {
  return {
    ...keyframe,
    ...updates,
  };
};

/**
 * Get all keyframes at a specific time (across all properties)
 */
export const getKeyframesAtTime = (
  keyframes: Keyframe[],
  time: number,
  tolerance: number = 0
): Keyframe[] => {
  return keyframes.filter(
    (kf) => Math.abs(kf.time - time) <= tolerance
  );
};

/**
 * Get all unique times that have keyframes
 */
export const getKeyframeTimes = (keyframes: Keyframe[]): number[] => {
  const times = new Set(keyframes.map((kf) => kf.time));
  return Array.from(times).sort((a, b) => a - b);
};

/**
 * Get all properties that have keyframes
 */
export const getAnimatedProperties = (keyframes: Keyframe[]): AnimatableProperty[] => {
  const properties = new Set(keyframes.map((kf) => kf.property));
  return Array.from(properties);
};

/**
 * Check if a property is animated at a specific time
 */
export const hasKeyframeAt = (
  keyframes: Keyframe[],
  property: AnimatableProperty,
  time: number,
  tolerance: number = 50
): boolean => {
  return keyframes.some(
    (kf) => kf.property === property && Math.abs(kf.time - time) <= tolerance
  );
};

/**
 * Remove keyframes by ID
 */
export const removeKeyframes = (
  keyframes: Keyframe[],
  keyframeIds: string[]
): Keyframe[] => {
  const idsToRemove = new Set(keyframeIds);
  return keyframes.filter((kf) => !idsToRemove.has(kf.id));
};

/**
 * Get default value for a property
 */
export const getDefaultPropertyValue = (property: AnimatableProperty): number => {
  switch (property) {
    case 'x':
    case 'y':
      return 0;
    case 'width':
      return 100;
    case 'height':
      return 100;
    case 'rotation':
      return 0;
    case 'scaleX':
    case 'scaleY':
      return 1;
    case 'opacity':
      return 1;
    default:
      return 0;
  }
};

/**
 * Property display configuration
 */
export const propertyConfig: Record<
  AnimatableProperty,
  {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
  }
> = {
  x: { label: 'Position X', unit: 'px', min: -10000, max: 10000, step: 1, defaultValue: 0 },
  y: { label: 'Position Y', unit: 'px', min: -10000, max: 10000, step: 1, defaultValue: 0 },
  width: { label: 'Width', unit: 'px', min: 0, max: 10000, step: 1, defaultValue: 100 },
  height: { label: 'Height', unit: 'px', min: 0, max: 10000, step: 1, defaultValue: 100 },
  rotation: { label: 'Rotation', unit: '°', min: -360, max: 360, step: 1, defaultValue: 0 },
  scaleX: { label: 'Scale X', unit: 'x', min: 0, max: 10, step: 0.1, defaultValue: 1 },
  scaleY: { label: 'Scale Y', unit: 'x', min: 0, max: 10, step: 0.1, defaultValue: 1 },
  opacity: { label: 'Opacity', unit: '', min: 0, max: 1, step: 0.01, defaultValue: 1 },
};
