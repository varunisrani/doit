# Transitions System - Quick Start Guide

## Files Created for Phase 7

### Core Library Files
1. **`app/lib/effects/transitions.ts`** (15 KB)
   - Core transition logic, types, and rendering
   - 13 transition types with easing functions
   - Progress calculation and property application

2. **`app/lib/effects/transitions-utils.ts`** (14 KB)
   - Advanced utilities and helpers
   - Transition presets and batch operations
   - Keyboard shortcuts and history tracking

3. **`app/lib/effects/transitions-integration-example.ts`** (13 KB)
   - Complete integration examples
   - 7 practical usage scenarios
   - Rendering, validation, and export examples

### UI Components
4. **`app/components/panels/TransitionsPanel.tsx`** (11 KB)
   - Interactive transitions browser panel
   - Live canvas previews
   - Category tabs, duration slider, easing selector
   - Drag-and-drop support

5. **`app/components/timeline/ClipTransition.tsx`** (11 KB)
   - Visual transition indicators on timeline
   - Draggable duration handles
   - Multiple sub-components (ClipTransition, ClipTransitions, TransitionBadge, TransitionMarker)

### Type Definitions
6. **`app/types/transitions.types.ts`** (14 KB)
   - Comprehensive TypeScript types
   - 50+ type definitions for complete type safety
   - Type guards and error classes

### Documentation
7. **`TRANSITIONS_SYSTEM.md`** (12 KB)
   - Complete system documentation
   - Integration guide and API reference
   - Best practices and testing guide

## Quick Integration (5 Steps)

### Step 1: Add Transitions to Your Clip Interface

```typescript
// app/types/video.types.ts
import { Transition } from '@/app/lib/effects/transitions';

interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  transitionIn?: Transition | null;   // ADD THIS
  transitionOut?: Transition | null;  // ADD THIS
  // ... other properties
}
```

### Step 2: Add Transitions Panel to Your Editor UI

```typescript
// app/components/VideoEditor.tsx
import TransitionsPanel from '@/app/components/panels/TransitionsPanel';
import { createTransition } from '@/app/lib/effects/transitions';

export default function VideoEditor() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const handleTransitionSelect = (type, direction) => {
    if (!selectedClipId) return;

    setClips(prev => prev.map(clip => {
      if (clip.id !== selectedClipId) return clip;

      const transition = createTransition(type, direction, 500);

      return {
        ...clip,
        [direction === 'in' ? 'transitionIn' : 'transitionOut']: transition
      };
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-80">
        <TransitionsPanel
          selectedClipId={selectedClipId}
          onTransitionSelect={handleTransitionSelect}
        />
      </div>

      {/* Main canvas and timeline */}
      {/* ... */}
    </div>
  );
}
```

### Step 3: Add Transition Indicators to Timeline Clips

```typescript
// app/components/timeline/TimelineClip.tsx
import { ClipTransitions } from '@/app/components/timeline/ClipTransition';

export default function TimelineClip({ clip, ... }) {
  const handleTransitionDurationChange = (direction, newDuration) => {
    updateClipTransition(clip.id, direction, newDuration);
  };

  const handleTransitionRemove = (direction) => {
    removeClipTransition(clip.id, direction);
  };

  return (
    <div className="timeline-clip" style={{ width: clipWidth }}>
      {/* Clip content */}

      {/* Transition overlays */}
      <ClipTransitions
        transitionIn={clip.transitionIn}
        transitionOut={clip.transitionOut}
        clipWidth={clipWidth}
        clipDuration={clip.endTime - clip.startTime}
        onTransitionInChange={(dur) => handleTransitionDurationChange('in', dur)}
        onTransitionOutChange={(dur) => handleTransitionDurationChange('out', dur)}
        onTransitionInRemove={() => handleTransitionRemove('in')}
        onTransitionOutRemove={() => handleTransitionRemove('out')}
      />
    </div>
  );
}
```

### Step 4: Render Clips with Transitions on Canvas

```typescript
// app/components/Canvas.tsx
import {
  applyCombinedTransitions,
  getBaseProperties,
  renderWithTransition
} from '@/app/lib/effects/transitions';

export default function Canvas({ clips, currentTime }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render each clip
    clips.forEach(clip => {
      // Skip if not visible
      if (currentTime < clip.startTime || currentTime > clip.endTime) {
        return;
      }

      // Get base properties
      const baseProps = getBaseProperties(canvas.width, canvas.height);

      // Apply transitions
      const props = applyCombinedTransitions(
        baseProps,
        clip.transitionIn ?? null,
        clip.transitionOut ?? null,
        currentTime,
        clip.startTime,
        clip.endTime,
        canvas.width,
        canvas.height
      );

      // Render with transition
      if (clip.element) {
        renderWithTransition(
          ctx,
          clip.element,
          props,
          clip.x,
          clip.y,
          clip.width,
          clip.height
        );
      }
    });
  }, [clips, currentTime]);

  return <canvas ref={canvasRef} width={1920} height={1080} />;
}
```

### Step 5: Handle Drag-and-Drop from Transitions Panel

```typescript
// app/components/timeline/TimelineClip.tsx (continued)

export default function TimelineClip({ clip }) {
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    // Get transition data from drag
    const transitionData = JSON.parse(
      e.dataTransfer.getData('application/transition')
    );

    // Determine if dropped on start or end of clip
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x < rect.width / 2 ? 'start' : 'end';
    const direction = position === 'start' ? 'in' : 'out';

    // Apply transition
    const transition = createTransition(
      transitionData.type,
      direction,
      transitionData.duration,
      transitionData.easing
    );

    updateClip(clip.id, {
      [direction === 'in' ? 'transitionIn' : 'transitionOut']: transition
    });
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* ... */}
    </div>
  );
}
```

## Available Transition Types

```typescript
// All 13 transition types:
'fade'           // Simple opacity fade
'dissolve'       // Gradual dissolve
'slide-left'     // Slide from/to left
'slide-right'    // Slide from/to right
'slide-up'       // Slide from/to up
'slide-down'     // Slide from/to down
'zoom-in'        // Zoom in effect
'zoom-out'       // Zoom out effect
'wipe-left'      // Wipe from/to left
'wipe-right'     // Wipe from/to right
'wipe-up'        // Wipe from/to up
'wipe-down'      // Wipe from/to down
'none'           // No transition
```

## Quick Examples

### Example 1: Add Fade Transition
```typescript
import { createTransition } from '@/app/lib/effects/transitions';

const fadeIn = createTransition('fade', 'in', 500, 'easeInOutQuad');
clip.transitionIn = fadeIn;
```

### Example 2: Use Transition Preset
```typescript
import { applyTransitionPreset } from '@/app/lib/effects/transitions-utils';

const { transitionIn, transitionOut } = applyTransitionPreset('smooth-fade');
clip.transitionIn = transitionIn;
clip.transitionOut = transitionOut;
```

### Example 3: Validate Transition
```typescript
import { analyzeTransition } from '@/app/lib/effects/transitions-utils';

const issues = analyzeTransition(
  clip.transitionIn,
  clip.endTime - clip.startTime,
  clip.transitionOut
);

if (issues.some(i => i.severity === 'error')) {
  console.error('Transition has errors:', issues);
}
```

### Example 4: Generate Preview
```typescript
import { generateTransitionPreview } from '@/app/lib/effects/transitions';

const canvas = document.createElement('canvas');
generateTransitionPreview(canvas, transition, { width: 200, height: 112 });
// Canvas now contains preview at 50% progress
```

## Keyboard Shortcuts (Optional)

```typescript
import { matchTransitionShortcut } from '@/app/lib/effects/transitions-utils';

// In your keyboard event handler
const shortcut = matchTransitionShortcut(event);
if (shortcut && selectedClipId) {
  addTransition(selectedClipId, shortcut.transitionType, shortcut.direction);
}

// Default shortcuts:
// F = Fade In
// Shift+F = Fade Out
// D = Dissolve In
// S = Slide Left In
// Shift+S = Slide Right In
// Z = Zoom In
// Shift+Z = Zoom Out
```

## Common Patterns

### Pattern 1: Apply Same Transition to Multiple Clips
```typescript
import { applyTransitionToMultipleClips } from '@/app/lib/effects/transitions-integration-example';

const updatedClips = applyTransitionToMultipleClips(
  selectedClips,
  'fade',
  'in',
  500
);
```

### Pattern 2: Auto-Adjust Overlapping Transitions
```typescript
import { autoAdjustTransitionDurations } from '@/app/lib/effects/transitions-integration-example';

const adjustedClip = autoAdjustTransitionDurations(clip);
// Transitions automatically resized to fit
```

### Pattern 3: Copy Transitions Between Clips
```typescript
import { copyTransitions } from '@/app/lib/effects/transitions-integration-example';

const targetClipWithTransitions = copyTransitions(sourceClip, targetClip);
```

## Troubleshooting

### Issue: Transitions not visible
- Check that currentTime is within transition duration range
- Verify canvas context is available
- Ensure clip.element is loaded

### Issue: Transitions overlap
- Use `analyzeTransition()` to check for issues
- Call `autoAdjustTransitionDurations()` to fix automatically
- Ensure total duration < clip duration

### Issue: Poor performance
- Cache transition calculations
- Reduce canvas resolution for preview
- Use lower-quality easing functions

## Next Steps

1. Test basic transitions with the TransitionsPanel
2. Implement drag-and-drop on your timeline
3. Add keyboard shortcuts for quick access
4. Customize transition presets for your needs
5. Add export/import for project persistence

## Full Documentation

See **`TRANSITIONS_SYSTEM.md`** for:
- Complete API reference
- Advanced features
- Performance optimization
- Testing guide
- All 13 transition types with examples

## Support Files

- **Core:** `app/lib/effects/transitions.ts`
- **Utils:** `app/lib/effects/transitions-utils.ts`
- **Examples:** `app/lib/effects/transitions-integration-example.ts`
- **Types:** `app/types/transitions.types.ts`
- **UI:** `app/components/panels/TransitionsPanel.tsx`
- **Timeline:** `app/components/timeline/ClipTransition.tsx`
