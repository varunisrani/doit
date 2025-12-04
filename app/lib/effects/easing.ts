/**
 * Easing Functions for Keyframe Animations
 * All functions take a normalized time value (0-1) and return a normalized value (0-1)
 */

export type EasingType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInBounce'
  | 'easeOutBounce';

export interface BezierPoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Linear easing - no acceleration
export const linear = (t: number): number => t;

// Quadratic easing
export const easeIn = (t: number): number => t * t;

export const easeOut = (t: number): number => t * (2 - t);

export const easeInOut = (t: number): number => {
  if (t < 0.5) {
    return 2 * t * t;
  }
  return -1 + (4 - 2 * t) * t;
};

// Cubic easing
export const easeInCubic = (t: number): number => t * t * t;

export const easeOutCubic = (t: number): number => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

export const easeInOutCubic = (t: number): number => {
  if (t < 0.5) {
    return 4 * t * t * t;
  }
  const t1 = 2 * t - 2;
  return (t1 * t1 * t1 + 2) / 2;
};

// Quartic easing
export const easeInQuart = (t: number): number => t * t * t * t;

export const easeOutQuart = (t: number): number => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

export const easeInOutQuart = (t: number): number => {
  if (t < 0.5) {
    return 8 * t * t * t * t;
  }
  const t1 = t - 1;
  return 1 - 8 * t1 * t1 * t1 * t1;
};

// Elastic easing
export const easeInElastic = (t: number): number => {
  if (t === 0) return 0;
  if (t === 1) return 1;

  const p = 0.3;
  const s = p / 4;
  const t1 = t - 1;

  return -(Math.pow(2, 10 * t1) * Math.sin((t1 - s) * (2 * Math.PI) / p));
};

export const easeOutElastic = (t: number): number => {
  if (t === 0) return 0;
  if (t === 1) return 1;

  const p = 0.3;
  const s = p / 4;

  return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
};

// Bounce easing
const bounceOut = (t: number): number => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    const t1 = t - 1.5 / 2.75;
    return 7.5625 * t1 * t1 + 0.75;
  } else if (t < 2.5 / 2.75) {
    const t1 = t - 2.25 / 2.75;
    return 7.5625 * t1 * t1 + 0.9375;
  } else {
    const t1 = t - 2.625 / 2.75;
    return 7.5625 * t1 * t1 + 0.984375;
  }
};

export const easeInBounce = (t: number): number => 1 - bounceOut(1 - t);

export const easeOutBounce = (t: number): number => bounceOut(t);

// Cubic Bezier - for custom easing curves
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  return (t: number): number => {
    // Newton-Raphson iteration for finding t from x
    const sampleCurveX = (t: number) => {
      return ((1 - 3 * x2 + 3 * x1) * t * t * t +
              (3 * x2 - 6 * x1) * t * t +
              3 * x1 * t);
    };

    const sampleCurveY = (t: number) => {
      return ((1 - 3 * y2 + 3 * y1) * t * t * t +
              (3 * y2 - 6 * y1) * t * t +
              3 * y1 * t);
    };

    const sampleCurveDerivativeX = (t: number) => {
      return (3 * (1 - 3 * x2 + 3 * x1) * t * t +
              2 * (3 * x2 - 6 * x1) * t +
              3 * x1);
    };

    // Newton-Raphson iteration
    let x = t;
    for (let i = 0; i < 8; i++) {
      const currentX = sampleCurveX(x) - t;
      const currentSlope = sampleCurveDerivativeX(x);

      if (Math.abs(currentSlope) < 1e-6) break;

      x = x - currentX / currentSlope;
    }

    return sampleCurveY(x);
  };
};

// Easing function map
export const easingFunctions: Record<EasingType, (t: number) => number> = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInElastic,
  easeOutElastic,
  easeInBounce,
  easeOutBounce,
};

// Get easing function by name
export const getEasingFunction = (easing: EasingType): ((t: number) => number) => {
  return easingFunctions[easing] || linear;
};

// Easing function labels for UI
export const easingLabels: Record<EasingType, string> = {
  linear: 'Linear',
  easeIn: 'Ease In (Quad)',
  easeOut: 'Ease Out (Quad)',
  easeInOut: 'Ease In Out (Quad)',
  easeInCubic: 'Ease In Cubic',
  easeOutCubic: 'Ease Out Cubic',
  easeInOutCubic: 'Ease In Out Cubic',
  easeInQuart: 'Ease In Quart',
  easeOutQuart: 'Ease Out Quart',
  easeInOutQuart: 'Ease In Out Quart',
  easeInElastic: 'Ease In Elastic',
  easeOutElastic: 'Ease Out Elastic',
  easeInBounce: 'Ease In Bounce',
  easeOutBounce: 'Ease Out Bounce',
};

// Group easing functions for better UI organization
export const easingGroups = {
  basic: ['linear', 'easeIn', 'easeOut', 'easeInOut'] as EasingType[],
  cubic: ['easeInCubic', 'easeOutCubic', 'easeInOutCubic'] as EasingType[],
  quartic: ['easeInQuart', 'easeOutQuart', 'easeInOutQuart'] as EasingType[],
  elastic: ['easeInElastic', 'easeOutElastic'] as EasingType[],
  bounce: ['easeInBounce', 'easeOutBounce'] as EasingType[],
};
