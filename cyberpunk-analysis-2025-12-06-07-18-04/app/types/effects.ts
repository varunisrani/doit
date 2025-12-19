// Effects and Animation Types

export type TransitionType =
  | 'fade'
  | 'dissolve'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down'
  | 'circle-in'
  | 'circle-out'
  | 'crossfade'
  | 'push-left'
  | 'push-right'
  | 'push-up'
  | 'push-down';

export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce'
  | 'cubicBezier';

export type FilterType =
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'blur'
  | 'grayscale'
  | 'sepia'
  | 'hue-rotate'
  | 'invert'
  | 'opacity'
  | 'vignette'
  | 'sharpen'
  | 'temperature'
  | 'tint'
  | 'exposure'
  | 'highlights'
  | 'shadows'
  | 'vibrance'
  | 'noise'
  | 'pixelate'
  | 'posterize';

export type KeyframeProperty =
  | 'x'
  | 'y'
  | 'width'
  | 'height'
  | 'rotation'
  | 'scaleX'
  | 'scaleY'
  | 'opacity'
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'fontSize'
  | 'letterSpacing'
  | 'color'
  | 'backgroundColor';

export interface Transition {
  id: string;
  type: TransitionType;
  duration: number;        // Duration in ms
  easing: EasingFunction;
  delay?: number;          // Start delay in ms
  customProperties?: Record<string, any>; // For custom transitions
}

export interface Filter {
  id: string;
  type: FilterType;
  enabled: boolean;
  intensity: number;       // 0 to 1 (or specific range for filter)
  properties?: FilterProperties;
}

export interface FilterProperties {
  // Brightness/Contrast/Saturation
  value?: number;          // -100 to 100

  // Blur
  radius?: number;         // 0 to 50

  // Hue Rotate
  angle?: number;          // 0 to 360

  // Vignette
  size?: number;           // 0 to 1
  roundness?: number;      // 0 to 1
  feather?: number;        // 0 to 1

  // Temperature
  temperature?: number;    // -100 to 100

  // Tint
  tintColor?: string;
  tintAmount?: number;     // 0 to 1

  // Sharpen
  amount?: number;         // 0 to 10

  // Noise
  noiseAmount?: number;    // 0 to 1
  noiseType?: 'gaussian' | 'uniform';

  // Pixelate
  pixelSize?: number;      // 1 to 50

  // Posterize
  levels?: number;         // 2 to 256
}

export interface Keyframe {
  id: string;
  time: number;            // Time in ms relative to clip start
  property: KeyframeProperty;
  value: number | string;
  easing: EasingFunction;
  bezierPoints?: BezierPoints; // For cubicBezier easing
}

export interface BezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Animation {
  id: string;
  name: string;
  elementId: string;
  keyframes: Keyframe[];
  duration: number;        // Total animation duration in ms
  delay: number;           // Start delay in ms
  iterations: number;      // Number of times to play (0 = infinite)
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  playState: 'running' | 'paused';
}

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'exit' | 'emphasis' | 'motion';
  description: string;
  thumbnail?: string;
  keyframes: Omit<Keyframe, 'id'>[];
  defaultDuration: number;
}

// Predefined Animation Types
export type EntranceAnimationType =
  | 'fadeIn'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'zoomIn'
  | 'bounceIn'
  | 'rotateIn'
  | 'flipInX'
  | 'flipInY';

export type ExitAnimationType =
  | 'fadeOut'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'slideOutDown'
  | 'zoomOut'
  | 'bounceOut'
  | 'rotateOut'
  | 'flipOutX'
  | 'flipOutY';

export type EmphasisAnimationType =
  | 'pulse'
  | 'shake'
  | 'swing'
  | 'bounce'
  | 'flash'
  | 'rubberBand'
  | 'jello'
  | 'heartbeat';

export interface TransitionPreset {
  id: string;
  name: string;
  type: TransitionType;
  description: string;
  thumbnail?: string;
  defaultDuration: number;
  category: 'basic' | 'slide' | 'zoom' | 'wipe' | 'special';
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  filters: Omit<Filter, 'id'>[];
  category: 'color' | 'blur' | 'artistic' | 'vintage' | 'cinematic';
}

// Chroma Key (Green Screen)
export interface ChromaKey {
  enabled: boolean;
  color: string;           // Key color (hex)
  threshold: number;       // 0 to 1
  smoothness: number;      // 0 to 1
  spill: number;           // Spill suppression 0 to 1
}

// Color Grading
export interface ColorGrading {
  shadows: ColorGradingChannel;
  midtones: ColorGradingChannel;
  highlights: ColorGradingChannel;
  global: ColorGradingChannel;
}

export interface ColorGradingChannel {
  hue: number;             // -180 to 180
  saturation: number;      // -100 to 100
  luminance: number;       // -100 to 100
  temperature: number;     // -100 to 100
  tint: number;            // -100 to 100
}

// LUT (Look-Up Table)
export interface LUT {
  id: string;
  name: string;
  url: string;             // Path to LUT file
  intensity: number;       // 0 to 1
  enabled: boolean;
}

// Motion Blur
export interface MotionBlur {
  enabled: boolean;
  samples: number;         // 2 to 32
  intensity: number;       // 0 to 1
}

// Particle Effects
export interface ParticleEffect {
  id: string;
  type: 'snow' | 'rain' | 'confetti' | 'sparkle' | 'smoke' | 'fire';
  enabled: boolean;
  count: number;           // Number of particles
  speed: number;           // Particle speed
  size: number;            // Particle size
  color?: string;
  lifetime: number;        // Particle lifetime in ms
  direction?: number;      // 0 to 360 degrees
  spread?: number;         // Direction randomness
}
