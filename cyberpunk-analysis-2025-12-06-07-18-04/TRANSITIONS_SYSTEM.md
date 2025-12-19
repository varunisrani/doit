# Video Editor Transitions System - Phase 7

Complete implementation of the transitions system for the browser-based video editor.

## Overview

The transitions system provides smooth, professional-quality transitions between video clips with support for multiple transition types, customizable durations, and easing functions.

## Files Created

### 1. Core Transitions Library
**File:** `app/lib/effects/transitions.ts`

Contains the core transition logic and utilities:

- **Types & Interfaces**
  - `TransitionType`: 13 different transition types
  - `Transition`: Complete transition definition
  - `TransitionProperties`: Properties modified by transitions
  - `TransitionCategory`: Categorization of transitions

- **Transition Types**
  - `none`: No transition
  - `fade`: Simple opacity fade
  - `dissolve`: Gradual dissolve effect
  - `slide-left/right/up/down`: Directional slides
  - `zoom-in/out`: Scale-based zooms
  - `wipe-left/right/up/down`: Directional wipes

- **Easing Functions**
  - Linear
  - Quad (In/Out/InOut)
  - Cubic (In/Out/InOut)
  - Quart (In/Out/InOut)
  - Expo (In/Out/InOut)

- **Core Functions**
  ```typescript
  // Create a transition
  createTransition(type, direction, duration?, easing?)

  // Calculate progress (0-1) based on time
  calculateTransitionProgress(currentTime, clipStart, clipEnd, transition)

  // Apply transition to properties
  applyTransitionToProperties(baseProps, transition, progress, width, height)

  // Apply combined in/out transitions
  applyCombinedTransitions(baseProps, transitionIn, transitionOut, ...)

  // Render element with transition
  renderWithTransition(ctx, element, properties, x, y, width, height)
  ```

### 2. Transitions Panel Component
**File:** `app/components/panels/TransitionsPanel.tsx`

Interactive panel for browsing and applying transitions:

- **Features**
  - Grid display of all transitions
  - Live canvas previews
  - Category tabs (Fade, Slide, Zoom, Wipe)
  - Direction toggle (In/Out)
  - Duration slider (100ms - 2000ms)
  - Easing function selector
  - Drag-and-drop support
  - Quick apply buttons

- **Props**
  ```typescript
  interface TransitionsPanelProps {
    onTransitionSelect?: (type, direction) => void;
    selectedClipId?: string | null;
  }
  ```

### 3. Timeline Transition Components
**File:** `app/components/timeline/ClipTransition.tsx`

Visual representation of transitions on timeline clips:

- **ClipTransition Component**
  - Visual indicator on clip
  - Gradient overlay
  - Transition icon badge
  - Duration handle for resizing
  - Diagonal stripe pattern
  - Remove button
  - Hover tooltip

- **ClipTransitions Component**
  - Manages both in/out transitions
  - Handles selection state
  - Props:
    ```typescript
    interface ClipTransitionsProps {
      transitionIn?: Transition | null;
      transitionOut?: Transition | null;
      clipWidth: number;
      clipDuration: number;
      onTransitionInChange?: (duration) => void;
      onTransitionOutChange?: (duration) => void;
      onTransitionInRemove?: () => void;
      onTransitionOutRemove?: () => void;
      selectedTransition?: 'in' | 'out' | null;
    }
    ```

- **TransitionBadge Component**
  - Compact indicator for small displays
  - Shows transition icon
  - Click to edit

- **TransitionMarker Component**
  - Timeline marker for transition boundaries
  - Draggable handles
  - Duration display

### 4. Integration Examples
**File:** `app/lib/effects/transitions-integration-example.ts`

Comprehensive examples showing:

1. **Adding Transitions to Clips**
   - Add fade in/out
   - Add custom transitions
   - Remove transitions
   - Update duration

2. **Rendering with Transitions**
   - Single clip rendering
   - Multiple clips on timeline
   - Canvas integration

3. **Preview Generation**
   - Generate preview frames
   - Animation sequences

4. **Timeline Interaction**
   - Drag-and-drop handling
   - Mouse hover detection
   - Handle manipulation

5. **Validation**
   - Duration validation
   - Auto-adjustment
   - Overlap prevention

6. **Batch Operations**
   - Apply to multiple clips
   - Remove all transitions
   - Copy between clips

7. **Export/Import**
   - Serialization
   - JSON export
   - Project persistence

## How Transitions Work

### 1. Transition Lifecycle

```
Clip Timeline:
[====CLIP DURATION====]
 ^^^               ^^^
 IN               OUT
transition       transition
```

- **Transition In**: Applied from clip start for specified duration
- **Transition Out**: Applied before clip end for specified duration

### 2. Progress Calculation

```typescript
// For transition IN (0 to 1):
progress = (currentTime - clipStartTime) / transitionDuration

// For transition OUT (1 to 0):
progress = 1 - (clipEndTime - currentTime) / transitionDuration
```

### 3. Easing Application

```typescript
easedProgress = easingFunction(progress)
```

### 4. Property Modification

Each transition type modifies different properties:

- **Fade/Dissolve**: `opacity`
- **Slide**: `x` or `y` position
- **Zoom**: `scale` and `opacity`
- **Wipe**: `clipMask` dimensions

### 5. Rendering

```typescript
ctx.save()
ctx.globalAlpha = properties.opacity
// Apply clip mask if needed
ctx.drawImage(element, x + props.x, y + props.y,
              width * props.scale, height * props.scale)
ctx.restore()
```

## Integration Guide

### Step 1: Add to Video Editor State

```typescript
interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  transitionIn?: Transition | null;
  transitionOut?: Transition | null;
  // ... other properties
}
```

### Step 2: Add Transitions Panel to UI

```typescript
import TransitionsPanel from '@/app/components/panels/TransitionsPanel';

<TransitionsPanel
  selectedClipId={selectedClip?.id}
  onTransitionSelect={(type, direction) => {
    // Apply transition to selected clip
    updateClipTransition(selectedClip.id, type, direction);
  }}
/>
```

### Step 3: Display on Timeline

```typescript
import { ClipTransitions } from '@/app/components/timeline/ClipTransition';

<div className="timeline-clip">
  <ClipTransitions
    transitionIn={clip.transitionIn}
    transitionOut={clip.transitionOut}
    clipWidth={clipWidth}
    clipDuration={clip.endTime - clip.startTime}
    onTransitionInChange={(duration) =>
      updateTransitionDuration(clip.id, 'in', duration)
    }
    onTransitionOutChange={(duration) =>
      updateTransitionDuration(clip.id, 'out', duration)
    }
    onTransitionInRemove={() =>
      removeTransition(clip.id, 'in')
    }
    onTransitionOutRemove={() =>
      removeTransition(clip.id, 'out')
    }
  />
</div>
```

### Step 4: Render with Transitions

```typescript
import { renderClipWithTransitions } from '@/app/lib/effects/transitions-integration-example';

// In your render loop
clips.forEach(clip => {
  renderClipWithTransitions(
    ctx,
    clip,
    currentTime,
    canvasWidth,
    canvasHeight
  );
});
```

### Step 5: Handle Drag-and-Drop

```typescript
// On timeline clip
const handleDrop = (e: DragEvent) => {
  const transitionData = JSON.parse(
    e.dataTransfer.getData('application/transition')
  );

  const position = calculateDropPosition(e.clientX, clipRect);
  const direction = position === 'start' ? 'in' : 'out';

  updateClipTransition(
    clip.id,
    transitionData.type,
    direction,
    transitionData.duration
  );
};
```

## Advanced Features

### Custom Easing Functions

```typescript
// Define custom easing
const customEasing: EasingFunction = (t: number) => {
  return t * t * (3 - 2 * t); // Smoothstep
};

// Use with transition
const transition = {
  ...createTransition('fade', 'in', 500),
  easing: customEasing
};
```

### Transition Chaining

```typescript
// Apply multiple effects in sequence
const chainedEffects = (ctx, element, props) => {
  // First apply transition
  const transitionProps = applyTransitionToProperties(...);

  // Then apply additional effects
  applyColorGrading(ctx, transitionProps);
  applyBlur(ctx, transitionProps);

  renderWithTransition(ctx, element, transitionProps, ...);
};
```

### Performance Optimization

```typescript
// Cache transition calculations
const transitionCache = new Map<string, TransitionProperties>();

const getCachedTransitionProps = (
  clipId: string,
  currentTime: number
) => {
  const key = `${clipId}-${currentTime}`;

  if (!transitionCache.has(key)) {
    const props = calculateTransitionProps(...);
    transitionCache.set(key, props);
  }

  return transitionCache.get(key);
};
```

## Best Practices

1. **Duration Guidelines**
   - Fade: 300-500ms
   - Slide: 500-800ms
   - Zoom: 600-1000ms
   - Wipe: 400-600ms

2. **Validation**
   - Always validate transition duration against clip length
   - Ensure in/out transitions don't overlap
   - Max 50% of clip duration per transition

3. **Performance**
   - Generate previews only when needed
   - Cache transition calculations
   - Use requestAnimationFrame for smooth rendering

4. **UX Considerations**
   - Show visual feedback during drag
   - Provide preview before applying
   - Allow easy removal/adjustment
   - Display duration in timeline

## Transition Type Reference

| Type | Icon | Properties Modified | Best For |
|------|------|-------------------|----------|
| `fade` | ○ | opacity | Simple, elegant transitions |
| `dissolve` | ◐ | opacity | Gradual blending |
| `slide-left` | ← | x position | Horizontal movement |
| `slide-right` | → | x position | Horizontal movement |
| `slide-up` | ↑ | y position | Vertical movement |
| `slide-down` | ↓ | y position | Vertical movement |
| `zoom-in` | ⊕ | scale, opacity | Emphasis, focus |
| `zoom-out` | ⊖ | scale, opacity | Reveal, expand |
| `wipe-left` | ◧ | clipMask | Linear reveal |
| `wipe-right` | ◨ | clipMask | Linear reveal |
| `wipe-up` | ◩ | clipMask | Linear reveal |
| `wipe-down` | ◪ | clipMask | Linear reveal |

## Testing

### Manual Testing Checklist

- [ ] Apply each transition type to a clip
- [ ] Test both in and out directions
- [ ] Adjust duration via slider
- [ ] Drag handles on timeline
- [ ] Test different easing functions
- [ ] Verify preview accuracy
- [ ] Test with multiple clips
- [ ] Check overlap prevention
- [ ] Test remove functionality
- [ ] Verify export/import

### Automated Testing

```typescript
// Example test
describe('Transitions', () => {
  it('should calculate correct progress for transition in', () => {
    const transition = createTransition('fade', 'in', 500);
    const progress = calculateTransitionProgress(
      1250, // currentTime
      1000, // clipStart
      2000, // clipEnd
      transition
    );
    expect(progress).toBe(0.5); // 250ms into 500ms transition
  });

  it('should apply fade transition correctly', () => {
    const baseProps = getBaseProperties(1920, 1080);
    const transition = createTransition('fade', 'in', 500);
    const props = applyTransitionToProperties(
      baseProps, transition, 0.5, 1920, 1080
    );
    expect(props.opacity).toBe(0.5);
  });
});
```

## Future Enhancements

1. **Additional Transition Types**
   - Circle wipe
   - Star wipe
   - Clock wipe
   - Blur transition
   - Pixelate transition

2. **Advanced Features**
   - Custom transition builder
   - Transition presets/favorites
   - Keyframe-based transitions
   - Physics-based easing

3. **Performance**
   - WebGL-accelerated transitions
   - Worker thread calculations
   - Transition baking/pre-rendering

4. **Creative Tools**
   - Transition duration sync to beat
   - Auto-apply based on clip type
   - Transition suggestions

## Support

For questions or issues with the transitions system:
1. Check the integration examples
2. Review the TypeScript types
3. Test with the provided demo code
4. Verify canvas rendering setup

## License

Part of the Video Editor project - Phase 7 implementation.
