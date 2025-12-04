/**
 * Transitions Integration Example
 * Demonstrates how to use the transitions system with video clips
 */

import {
  Transition,
  TransitionType,
  TransitionDirection,
  createTransition,
  applyCombinedTransitions,
  getBaseProperties,
  renderWithTransition,
  calculateTransitionProgress,
  applyTransitionToProperties
} from './transitions';

// ==================== Example Video Clip Interface ====================

interface VideoClip {
  id: string;
  startTime: number; // milliseconds
  endTime: number; // milliseconds
  element: HTMLVideoElement | HTMLImageElement;
  transitionIn?: Transition | null;
  transitionOut?: Transition | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ==================== Example 1: Adding Transitions to a Clip ====================

/**
 * Add a fade-in transition to a clip
 */
export function addFadeInTransition(clip: VideoClip, duration = 500): VideoClip {
  return {
    ...clip,
    transitionIn: createTransition('fade', 'in', duration, 'easeInOutQuad')
  };
}

/**
 * Add a fade-out transition to a clip
 */
export function addFadeOutTransition(clip: VideoClip, duration = 500): VideoClip {
  return {
    ...clip,
    transitionOut: createTransition('fade', 'out', duration, 'easeInOutQuad')
  };
}

/**
 * Add custom transition to a clip
 */
export function addTransitionToClip(
  clip: VideoClip,
  type: TransitionType,
  direction: TransitionDirection,
  duration = 500
): VideoClip {
  const transition = createTransition(type, direction, duration);

  if (direction === 'in') {
    return { ...clip, transitionIn: transition };
  } else {
    return { ...clip, transitionOut: transition };
  }
}

/**
 * Remove transition from clip
 */
export function removeTransition(
  clip: VideoClip,
  direction: TransitionDirection
): VideoClip {
  if (direction === 'in') {
    return { ...clip, transitionIn: null };
  } else {
    return { ...clip, transitionOut: null };
  }
}

/**
 * Update transition duration
 */
export function updateTransitionDuration(
  clip: VideoClip,
  direction: TransitionDirection,
  newDuration: number
): VideoClip {
  if (direction === 'in' && clip.transitionIn) {
    return {
      ...clip,
      transitionIn: { ...clip.transitionIn, duration: newDuration }
    };
  } else if (direction === 'out' && clip.transitionOut) {
    return {
      ...clip,
      transitionOut: { ...clip.transitionOut, duration: newDuration }
    };
  }
  return clip;
}

// ==================== Example 2: Rendering Clips with Transitions ====================

/**
 * Render a single clip with transitions to canvas
 */
export function renderClipWithTransitions(
  ctx: CanvasRenderingContext2D,
  clip: VideoClip,
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Check if clip is visible at current time
  if (currentTime < clip.startTime || currentTime > clip.endTime) {
    return;
  }

  // Get base properties
  const baseProperties = getBaseProperties(canvasWidth, canvasHeight);

  // Apply transitions
  const properties = applyCombinedTransitions(
    baseProperties,
    clip.transitionIn ?? null,
    clip.transitionOut ?? null,
    currentTime,
    clip.startTime,
    clip.endTime,
    canvasWidth,
    canvasHeight
  );

  // Render with transition properties
  renderWithTransition(
    ctx,
    clip.element,
    properties,
    clip.x,
    clip.y,
    clip.width,
    clip.height
  );
}

/**
 * Render multiple clips on timeline with transitions
 */
export function renderTimelineWithTransitions(
  ctx: CanvasRenderingContext2D,
  clips: VideoClip[],
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Sort clips by layer/z-index if needed
  const sortedClips = [...clips].sort((a, b) => a.startTime - b.startTime);

  // Render each clip
  sortedClips.forEach(clip => {
    renderClipWithTransitions(ctx, clip, currentTime, canvasWidth, canvasHeight);
  });
}

// ==================== Example 3: Transition Preview ====================

/**
 * Generate preview frames for a transition
 */
export function generateTransitionPreviewFrames(
  clip: VideoClip,
  transition: Transition,
  canvasWidth: number,
  canvasHeight: number,
  frameCount = 10
): ImageData[] {
  const frames: ImageData[] = [];
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return frames;

  const duration = transition.duration;
  const clipDuration = clip.endTime - clip.startTime;

  for (let i = 0; i < frameCount; i++) {
    const progress = i / (frameCount - 1);

    // Calculate time based on transition direction
    let currentTime: number;
    if (transition.direction === 'in') {
      currentTime = clip.startTime + (duration * progress);
    } else {
      currentTime = clip.endTime - duration + (duration * progress);
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Render frame
    renderClipWithTransitions(ctx, clip, currentTime, canvasWidth, canvasHeight);

    // Capture frame
    frames.push(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
  }

  return frames;
}

// ==================== Example 4: Timeline Interaction ====================

/**
 * Handle drag-and-drop transition application
 */
export function handleTransitionDrop(
  clip: VideoClip,
  transitionData: {
    type: TransitionType;
    direction: TransitionDirection;
    duration: number;
    easing: string;
  },
  dropPosition: 'start' | 'end'
): VideoClip {
  const direction = dropPosition === 'start' ? 'in' : 'out';

  return addTransitionToClip(
    clip,
    transitionData.type,
    direction,
    transitionData.duration
  );
}

/**
 * Calculate if mouse is over transition handle
 */
export function isOverTransitionHandle(
  mouseX: number,
  clip: VideoClip,
  clipRect: { x: number; width: number },
  pixelsPerMs: number
): { isOver: boolean; direction?: TransitionDirection } {
  const handleWidth = 10; // pixels

  // Check transition in handle
  if (clip.transitionIn) {
    const transitionWidth = clip.transitionIn.duration * pixelsPerMs;
    const handleX = clipRect.x + transitionWidth;

    if (Math.abs(mouseX - handleX) < handleWidth) {
      return { isOver: true, direction: 'in' };
    }
  }

  // Check transition out handle
  if (clip.transitionOut) {
    const transitionWidth = clip.transitionOut.duration * pixelsPerMs;
    const handleX = clipRect.x + clipRect.width - transitionWidth;

    if (Math.abs(mouseX - handleX) < handleWidth) {
      return { isOver: true, direction: 'out' };
    }
  }

  return { isOver: false };
}

// ==================== Example 5: Transition Validation ====================

/**
 * Validate transition duration doesn't exceed clip bounds
 */
export function validateTransitionDuration(
  clip: VideoClip,
  direction: TransitionDirection,
  duration: number
): { valid: boolean; maxDuration: number } {
  const clipDuration = clip.endTime - clip.startTime;
  const maxDuration = clipDuration * 0.5; // Max 50% of clip duration

  // Check if other transition exists
  const otherTransition = direction === 'in' ? clip.transitionOut : clip.transitionIn;
  const otherDuration = otherTransition?.duration ?? 0;

  // Ensure both transitions don't exceed clip duration
  if (duration + otherDuration > clipDuration) {
    return {
      valid: false,
      maxDuration: clipDuration - otherDuration
    };
  }

  return {
    valid: duration <= maxDuration,
    maxDuration
  };
}

/**
 * Auto-adjust transition durations to fit clip
 */
export function autoAdjustTransitionDurations(clip: VideoClip): VideoClip {
  const clipDuration = clip.endTime - clip.startTime;
  const maxDuration = clipDuration * 0.5;

  let updatedClip = { ...clip };

  // Adjust transition in
  if (clip.transitionIn && clip.transitionIn.duration > maxDuration) {
    updatedClip = {
      ...updatedClip,
      transitionIn: {
        ...clip.transitionIn,
        duration: maxDuration
      }
    };
  }

  // Adjust transition out
  if (clip.transitionOut && clip.transitionOut.duration > maxDuration) {
    updatedClip = {
      ...updatedClip,
      transitionOut: {
        ...clip.transitionOut,
        duration: maxDuration
      }
    };
  }

  // If both transitions overlap, split evenly
  if (updatedClip.transitionIn && updatedClip.transitionOut) {
    const totalDuration = updatedClip.transitionIn.duration + updatedClip.transitionOut.duration;

    if (totalDuration > clipDuration) {
      const scale = clipDuration / totalDuration;
      updatedClip = {
        ...updatedClip,
        transitionIn: {
          ...updatedClip.transitionIn,
          duration: updatedClip.transitionIn.duration * scale
        },
        transitionOut: {
          ...updatedClip.transitionOut,
          duration: updatedClip.transitionOut.duration * scale
        }
      };
    }
  }

  return updatedClip;
}

// ==================== Example 6: Batch Operations ====================

/**
 * Apply same transition to multiple clips
 */
export function applyTransitionToMultipleClips(
  clips: VideoClip[],
  type: TransitionType,
  direction: TransitionDirection,
  duration = 500
): VideoClip[] {
  return clips.map(clip => addTransitionToClip(clip, type, direction, duration));
}

/**
 * Remove all transitions from clips
 */
export function removeAllTransitions(clips: VideoClip[]): VideoClip[] {
  return clips.map(clip => ({
    ...clip,
    transitionIn: null,
    transitionOut: null
  }));
}

/**
 * Copy transitions from one clip to another
 */
export function copyTransitions(sourceClip: VideoClip, targetClip: VideoClip): VideoClip {
  return {
    ...targetClip,
    transitionIn: sourceClip.transitionIn ? { ...sourceClip.transitionIn } : null,
    transitionOut: sourceClip.transitionOut ? { ...sourceClip.transitionOut } : null
  };
}

// ==================== Example 7: Export/Import ====================

/**
 * Serialize transition for storage
 */
export function serializeTransition(transition: Transition): object {
  return {
    id: transition.id,
    type: transition.type,
    direction: transition.direction,
    duration: transition.duration,
    // Store easing as function name (would need custom serialization for custom functions)
    easing: 'easeInOutQuad' // Simplified for example
  };
}

/**
 * Deserialize transition from storage
 */
export function deserializeTransition(data: any): Transition | null {
  if (!data || !data.type || !data.direction) return null;

  return createTransition(
    data.type,
    data.direction,
    data.duration,
    data.easing
  );
}

/**
 * Export clip with transitions to JSON
 */
export function exportClipWithTransitions(clip: VideoClip): object {
  return {
    id: clip.id,
    startTime: clip.startTime,
    endTime: clip.endTime,
    x: clip.x,
    y: clip.y,
    width: clip.width,
    height: clip.height,
    transitionIn: clip.transitionIn ? serializeTransition(clip.transitionIn) : null,
    transitionOut: clip.transitionOut ? serializeTransition(clip.transitionOut) : null
  };
}

// ==================== Usage Example ====================

/*
// Example usage in a video editor component:

const VideoEditor = () => {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add transition to selected clip
  const handleAddTransition = (
    clipId: string,
    type: TransitionType,
    direction: TransitionDirection
  ) => {
    setClips(prev => prev.map(clip =>
      clip.id === clipId
        ? addTransitionToClip(clip, type, direction, 500)
        : clip
    ));
  };

  // Update transition duration
  const handleTransitionDurationChange = (
    clipId: string,
    direction: TransitionDirection,
    newDuration: number
  ) => {
    setClips(prev => prev.map(clip =>
      clip.id === clipId
        ? updateTransitionDuration(clip, direction, newDuration)
        : clip
    ));
  };

  // Render on every frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render all clips with transitions
    renderTimelineWithTransitions(
      ctx,
      clips,
      currentTime,
      canvas.width,
      canvas.height
    );
  }, [clips, currentTime]);

  return (
    <div>
      <canvas ref={canvasRef} width={1920} height={1080} />
      <TransitionsPanel onTransitionSelect={handleAddTransition} />
    </div>
  );
};
*/
