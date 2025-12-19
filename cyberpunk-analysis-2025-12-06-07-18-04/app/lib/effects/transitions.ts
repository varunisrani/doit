/**
 * Transitions System
 * Implements various transition effects for video clips
 */

// ==================== Types ====================

export type TransitionType =
  | 'none'
  | 'fade'
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
  | 'dissolve';

export type TransitionDirection = 'in' | 'out';

export type EasingFunction = (t: number) => number;

export interface Transition {
  id: string;
  type: TransitionType;
  direction: TransitionDirection;
  duration: number; // milliseconds
  easing: EasingFunction;
}

export interface TransitionProperties {
  opacity: number;
  x: number;
  y: number;
  scale: number;
  clipMask?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TransitionCategory {
  id: string;
  name: string;
  transitions: TransitionType[];
}

// ==================== Easing Functions ====================

export const easingFunctions = {
  linear: (t: number): number => t,

  easeInQuad: (t: number): number => t * t,

  easeOutQuad: (t: number): number => t * (2 - t),

  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: (t: number): number => t * t * t,

  easeOutCubic: (t: number): number => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  },

  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number): number => t * t * t * t,

  easeOutQuart: (t: number): number => {
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
  },

  easeInOutQuart: (t: number): number => {
    const t1 = t - 1;
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
  },

  easeInExpo: (t: number): number =>
    t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),

  easeOutExpo: (t: number): number =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

  easeInOutExpo: (t: number): number => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

// ==================== Transition Categories ====================

export const transitionCategories: TransitionCategory[] = [
  {
    id: 'fade',
    name: 'Fade',
    transitions: ['fade', 'dissolve']
  },
  {
    id: 'slide',
    name: 'Slide',
    transitions: ['slide-left', 'slide-right', 'slide-up', 'slide-down']
  },
  {
    id: 'zoom',
    name: 'Zoom',
    transitions: ['zoom-in', 'zoom-out']
  },
  {
    id: 'wipe',
    name: 'Wipe',
    transitions: ['wipe-left', 'wipe-right', 'wipe-up', 'wipe-down']
  }
];

// ==================== Transition Metadata ====================

export interface TransitionMetadata {
  type: TransitionType;
  name: string;
  description: string;
  icon: string;
  defaultDuration: number;
  defaultEasing: keyof typeof easingFunctions;
}

export const transitionMetadata: Record<TransitionType, TransitionMetadata> = {
  'none': {
    type: 'none',
    name: 'None',
    description: 'No transition',
    icon: '⊘',
    defaultDuration: 0,
    defaultEasing: 'linear'
  },
  'fade': {
    type: 'fade',
    name: 'Fade',
    description: 'Fade in or out',
    icon: '○',
    defaultDuration: 500,
    defaultEasing: 'easeInOutQuad'
  },
  'dissolve': {
    type: 'dissolve',
    name: 'Dissolve',
    description: 'Gradual dissolve effect',
    icon: '◐',
    defaultDuration: 800,
    defaultEasing: 'easeInOutCubic'
  },
  'slide-left': {
    type: 'slide-left',
    name: 'Slide Left',
    description: 'Slide from/to left',
    icon: '←',
    defaultDuration: 600,
    defaultEasing: 'easeInOutCubic'
  },
  'slide-right': {
    type: 'slide-right',
    name: 'Slide Right',
    description: 'Slide from/to right',
    icon: '→',
    defaultDuration: 600,
    defaultEasing: 'easeInOutCubic'
  },
  'slide-up': {
    type: 'slide-up',
    name: 'Slide Up',
    description: 'Slide from/to top',
    icon: '↑',
    defaultDuration: 600,
    defaultEasing: 'easeInOutCubic'
  },
  'slide-down': {
    type: 'slide-down',
    name: 'Slide Down',
    description: 'Slide from/to bottom',
    icon: '↓',
    defaultDuration: 600,
    defaultEasing: 'easeInOutCubic'
  },
  'zoom-in': {
    type: 'zoom-in',
    name: 'Zoom In',
    description: 'Zoom in effect',
    icon: '⊕',
    defaultDuration: 700,
    defaultEasing: 'easeOutCubic'
  },
  'zoom-out': {
    type: 'zoom-out',
    name: 'Zoom Out',
    description: 'Zoom out effect',
    icon: '⊖',
    defaultDuration: 700,
    defaultEasing: 'easeInCubic'
  },
  'wipe-left': {
    type: 'wipe-left',
    name: 'Wipe Left',
    description: 'Wipe from/to left',
    icon: '◧',
    defaultDuration: 500,
    defaultEasing: 'linear'
  },
  'wipe-right': {
    type: 'wipe-right',
    name: 'Wipe Right',
    description: 'Wipe from/to right',
    icon: '◨',
    defaultDuration: 500,
    defaultEasing: 'linear'
  },
  'wipe-up': {
    type: 'wipe-up',
    name: 'Wipe Up',
    description: 'Wipe from/to top',
    icon: '◩',
    defaultDuration: 500,
    defaultEasing: 'linear'
  },
  'wipe-down': {
    type: 'wipe-down',
    name: 'Wipe Down',
    description: 'Wipe from/to bottom',
    icon: '◪',
    defaultDuration: 500,
    defaultEasing: 'linear'
  }
};

// ==================== Core Functions ====================

/**
 * Calculate transition progress (0 to 1) based on current time
 */
export function calculateTransitionProgress(
  currentTime: number,
  clipStartTime: number,
  clipEndTime: number,
  transition: Transition
): number {
  const { direction, duration } = transition;

  if (duration <= 0) return direction === 'in' ? 1 : 0;

  let progress = 0;

  if (direction === 'in') {
    // Transition in: from clip start
    const timeSinceStart = currentTime - clipStartTime;
    progress = Math.min(Math.max(timeSinceStart / duration, 0), 1);
  } else {
    // Transition out: before clip end
    const timeUntilEnd = clipEndTime - currentTime;
    progress = 1 - Math.min(Math.max(timeUntilEnd / duration, 0), 1);
  }

  return progress;
}

/**
 * Apply easing function to progress value
 */
export function applyEasing(progress: number, easing: EasingFunction): number {
  return easing(Math.max(0, Math.min(1, progress)));
}

/**
 * Get base transition properties (no effect applied)
 */
export function getBaseProperties(
  canvasWidth: number,
  canvasHeight: number
): TransitionProperties {
  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    clipMask: {
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight
    }
  };
}

/**
 * Apply transition effect to element properties
 */
export function applyTransitionToProperties(
  baseProperties: TransitionProperties,
  transition: Transition,
  progress: number,
  canvasWidth: number,
  canvasHeight: number
): TransitionProperties {
  if (transition.type === 'none' || progress <= 0) {
    return baseProperties;
  }

  if (progress >= 1) {
    return baseProperties;
  }

  const easedProgress = applyEasing(progress, transition.easing);
  const { type, direction } = transition;

  // For 'in' transitions: 0 = start of effect, 1 = full visibility
  // For 'out' transitions: 0 = full visibility, 1 = end of effect
  const effectProgress = direction === 'in' ? easedProgress : 1 - easedProgress;

  const props = { ...baseProperties };

  switch (type) {
    case 'fade':
      props.opacity = effectProgress;
      break;

    case 'dissolve':
      props.opacity = effectProgress;
      break;

    case 'slide-left':
      props.x = direction === 'in'
        ? -canvasWidth * (1 - effectProgress)
        : -canvasWidth * effectProgress;
      break;

    case 'slide-right':
      props.x = direction === 'in'
        ? canvasWidth * (1 - effectProgress)
        : canvasWidth * effectProgress;
      break;

    case 'slide-up':
      props.y = direction === 'in'
        ? -canvasHeight * (1 - effectProgress)
        : -canvasHeight * effectProgress;
      break;

    case 'slide-down':
      props.y = direction === 'in'
        ? canvasHeight * (1 - effectProgress)
        : canvasHeight * effectProgress;
      break;

    case 'zoom-in':
      const zoomInScale = direction === 'in'
        ? effectProgress
        : 1 - (1 - effectProgress) * 0.5;
      props.scale = zoomInScale;
      props.opacity = effectProgress;
      break;

    case 'zoom-out':
      const zoomOutScale = direction === 'in'
        ? 1 + (1 - effectProgress)
        : 1 + effectProgress;
      props.scale = zoomOutScale;
      props.opacity = effectProgress;
      break;

    case 'wipe-left':
      if (props.clipMask) {
        props.clipMask = {
          x: canvasWidth * (1 - effectProgress),
          y: 0,
          width: canvasWidth * effectProgress,
          height: canvasHeight
        };
      }
      break;

    case 'wipe-right':
      if (props.clipMask) {
        props.clipMask = {
          x: 0,
          y: 0,
          width: canvasWidth * effectProgress,
          height: canvasHeight
        };
      }
      break;

    case 'wipe-up':
      if (props.clipMask) {
        props.clipMask = {
          x: 0,
          y: canvasHeight * (1 - effectProgress),
          width: canvasWidth,
          height: canvasHeight * effectProgress
        };
      }
      break;

    case 'wipe-down':
      if (props.clipMask) {
        props.clipMask = {
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight * effectProgress
        };
      }
      break;
  }

  return props;
}

/**
 * Create a new transition
 */
export function createTransition(
  type: TransitionType,
  direction: TransitionDirection,
  duration?: number,
  easing?: keyof typeof easingFunctions
): Transition {
  const metadata = transitionMetadata[type];

  return {
    id: `${type}-${direction}-${Date.now()}`,
    type,
    direction,
    duration: duration ?? metadata.defaultDuration,
    easing: easingFunctions[easing ?? metadata.defaultEasing]
  };
}

/**
 * Get all available transitions for a category
 */
export function getTransitionsByCategory(categoryId: string): TransitionType[] {
  const category = transitionCategories.find(c => c.id === categoryId);
  return category?.transitions ?? [];
}

/**
 * Apply combined transitions (in and out) to properties
 */
export function applyCombinedTransitions(
  baseProperties: TransitionProperties,
  transitionIn: Transition | null,
  transitionOut: Transition | null,
  currentTime: number,
  clipStartTime: number,
  clipEndTime: number,
  canvasWidth: number,
  canvasHeight: number
): TransitionProperties {
  let props = { ...baseProperties };

  // Apply transition in
  if (transitionIn && currentTime < clipStartTime + transitionIn.duration) {
    const progress = calculateTransitionProgress(
      currentTime,
      clipStartTime,
      clipEndTime,
      transitionIn
    );

    props = applyTransitionToProperties(
      props,
      transitionIn,
      progress,
      canvasWidth,
      canvasHeight
    );
  }

  // Apply transition out
  if (transitionOut && currentTime > clipEndTime - transitionOut.duration) {
    const progress = calculateTransitionProgress(
      currentTime,
      clipStartTime,
      clipEndTime,
      transitionOut
    );

    props = applyTransitionToProperties(
      props,
      transitionOut,
      progress,
      canvasWidth,
      canvasHeight
    );
  }

  return props;
}

/**
 * Render element with transition properties
 */
export function renderWithTransition(
  ctx: CanvasRenderingContext2D,
  element: HTMLImageElement | HTMLVideoElement,
  properties: TransitionProperties,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.save();

  // Apply opacity
  ctx.globalAlpha = properties.opacity;

  // Apply clip mask if present
  if (properties.clipMask) {
    ctx.beginPath();
    ctx.rect(
      properties.clipMask.x,
      properties.clipMask.y,
      properties.clipMask.width,
      properties.clipMask.height
    );
    ctx.clip();
  }

  // Calculate transformed position and size
  const finalX = x + properties.x;
  const finalY = y + properties.y;
  const finalWidth = width * properties.scale;
  const finalHeight = height * properties.scale;

  // Center the scaled element
  const offsetX = (finalWidth - width) / 2;
  const offsetY = (finalHeight - height) / 2;

  try {
    ctx.drawImage(
      element,
      finalX - offsetX,
      finalY - offsetY,
      finalWidth,
      finalHeight
    );
  } catch (error) {
    console.error('Error rendering element with transition:', error);
  }

  ctx.restore();
}

/**
 * Generate preview for transition
 */
export function generateTransitionPreview(
  canvas: HTMLCanvasElement,
  transition: Transition,
  previewSize: { width: number; height: number }
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = previewSize.width;
  canvas.height = previewSize.height;

  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw preview at 50% progress
  const baseProps = getBaseProperties(canvas.width, canvas.height);
  const props = applyTransitionToProperties(
    baseProps,
    transition,
    0.5,
    canvas.width,
    canvas.height
  );

  // Draw a placeholder rectangle to show the effect
  ctx.save();
  ctx.globalAlpha = props.opacity;

  if (props.clipMask) {
    ctx.beginPath();
    ctx.rect(
      props.clipMask.x,
      props.clipMask.y,
      props.clipMask.width,
      props.clipMask.height
    );
    ctx.clip();
  }

  const rectWidth = canvas.width * 0.6 * props.scale;
  const rectHeight = canvas.height * 0.6 * props.scale;
  const rectX = (canvas.width - rectWidth) / 2 + props.x;
  const rectY = (canvas.height - rectHeight) / 2 + props.y;

  // Gradient fill
  const gradient = ctx.createLinearGradient(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#8b5cf6');

  ctx.fillStyle = gradient;
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

  ctx.restore();

  // Draw transition type text
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    transitionMetadata[transition.type].icon,
    canvas.width / 2,
    canvas.height - 10
  );
}
