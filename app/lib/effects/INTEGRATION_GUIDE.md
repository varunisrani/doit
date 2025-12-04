# Keyframe Animation System - Integration Guide

## Quick Start

This guide shows you how to integrate the keyframe animation system into your video editor.

## Installation

All files are already created in your project:

```
app/
├── lib/effects/
│   ├── animations.ts      # Core animation logic
│   ├── easing.ts          # Easing functions
│   └── README.md          # Full documentation
├── components/keyframes/
│   ├── KeyframeTimeline.tsx   # Timeline UI
│   ├── KeyframeEditor.tsx     # Property editor UI
│   ├── KeyframeDiamond.tsx    # Keyframe marker
│   └── index.ts               # Exports
└── examples/
    └── KeyframeSystemExample.tsx  # Complete working example
```

## Step 1: Add to Your Editor Page

```tsx
// app/editor/page.tsx
'use client';

import { useState } from 'react';
import { KeyframeTimeline, KeyframeEditor } from '@/app/components/keyframes';
import { Keyframe, AnimatableProperty } from '@/app/lib/effects/animations';

export default function VideoEditor() {
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<AnimatableProperty | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(10000); // 10 seconds

  return (
    <div className="h-screen flex flex-col">
      {/* Your canvas/preview area */}
      <div className="flex-1">
        {/* ... */}
      </div>

      {/* Keyframe Controls */}
      <div className="h-1/3 grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <KeyframeTimeline
            elementId="current-element"
            keyframes={keyframes}
            currentTime={currentTime}
            duration={duration}
            selectedProperty={selectedProperty}
            onKeyframesChange={setKeyframes}
            onSelectedKeyframeChange={setSelectedKeyframeId}
            selectedKeyframeId={selectedKeyframeId}
            zoom={1}
          />
        </div>
        <div>
          <KeyframeEditor
            elementId="current-element"
            keyframes={keyframes}
            currentTime={currentTime}
            selectedProperty={selectedProperty}
            selectedKeyframeId={selectedKeyframeId}
            onKeyframesChange={setKeyframes}
            onPropertySelect={setSelectedProperty}
          />
        </div>
      </div>
    </div>
  );
}
```

## Step 2: Apply Animations to Elements

```tsx
import { getElementAnimatedValues } from '@/app/lib/effects/animations';

function AnimatedVideoElement({ element, keyframes, currentTime }) {
  // Get animated values
  const animatedProps = getElementAnimatedValues(
    keyframes,
    currentTime,
    {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
      opacity: element.opacity,
    }
  );

  // Apply to element
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: animatedProps.width,
        height: animatedProps.height,
        transform: `
          translate(${animatedProps.x}px, ${animatedProps.y}px)
          rotate(${animatedProps.rotation}deg)
          scale(${animatedProps.scaleX}, ${animatedProps.scaleY})
        `,
        opacity: animatedProps.opacity,
        transformOrigin: 'center center',
      }}
    >
      {/* Your element content */}
    </div>
  );
}
```

## Step 3: Store Keyframes with Elements

Update your element interface to include keyframes:

```tsx
interface VideoElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'shape';
  // ... other properties
  keyframes: Keyframe[];
}

// When element is selected, show its keyframes
const currentElement = elements.find(el => el.id === selectedElementId);
```

## Step 4: Playback Integration

```tsx
import { useEffect, useRef } from 'react';

function useVideoPlayback(isPlaying: boolean, duration: number) {
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now() - currentTime;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
      } else {
        setCurrentTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  return { currentTime, setCurrentTime };
}
```

## Step 5: Zustand Store Integration (Optional)

If you're using Zustand for state management:

```tsx
// app/lib/store/keyframeStore.ts
import { create } from 'zustand';
import { Keyframe, AnimatableProperty } from '@/app/lib/effects/animations';

interface KeyframeState {
  selectedKeyframeId: string | null;
  selectedProperty: AnimatableProperty | null;

  setSelectedKeyframe: (id: string | null) => void;
  setSelectedProperty: (property: AnimatableProperty | null) => void;

  // Per-element keyframes
  updateElementKeyframes: (elementId: string, keyframes: Keyframe[]) => void;
}

export const useKeyframeStore = create<KeyframeState>((set) => ({
  selectedKeyframeId: null,
  selectedProperty: null,

  setSelectedKeyframe: (id) => set({ selectedKeyframeId: id }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),

  updateElementKeyframes: (elementId, keyframes) => {
    // Update keyframes in your elements store
  },
}));
```

## Complete Example

See `/app/examples/KeyframeSystemExample.tsx` for a fully working example with:
- Multiple animated elements
- Playback controls
- Timeline scrubbing
- Keyframe editing
- Real-time preview

Run the example:
```bash
# Add to your routing or import into a page
import KeyframeSystemExample from '@/app/examples/KeyframeSystemExample';
```

## Common Patterns

### 1. Create Animation Preset

```tsx
import { createKeyframe } from '@/app/lib/effects/animations';

function createFadeInAnimation(startTime: number = 0): Keyframe[] {
  return [
    createKeyframe('opacity', startTime, 0, 'easeIn'),
    createKeyframe('opacity', startTime + 1000, 1, 'linear'),
  ];
}

function createSlideInAnimation(startTime: number = 0): Keyframe[] {
  return [
    createKeyframe('x', startTime, -200, 'easeOut'),
    createKeyframe('x', startTime + 800, 0, 'linear'),
    createKeyframe('opacity', startTime, 0, 'linear'),
    createKeyframe('opacity', startTime + 400, 1, 'linear'),
  ];
}

// Use it
const newElement = {
  ...element,
  keyframes: createFadeInAnimation(0),
};
```

### 2. Copy Keyframes Between Elements

```tsx
function copyKeyframes(
  sourceKeyframes: Keyframe[],
  targetElementId: string,
  timeOffset: number = 0
): Keyframe[] {
  return sourceKeyframes.map(kf => ({
    ...kf,
    id: `kf_${Date.now()}_${Math.random()}`,
    time: kf.time + timeOffset,
  }));
}
```

### 3. Sync Animations

```tsx
// Make multiple elements animate together
function syncAnimations(
  elementIds: string[],
  property: AnimatableProperty,
  keyframes: Keyframe[]
) {
  elementIds.forEach(id => {
    updateElementKeyframes(id, keyframes);
  });
}
```

## Keyboard Shortcuts (Recommended)

Add these shortcuts to improve UX:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Add keyframe
    if (e.key === 'k' && selectedProperty) {
      handleAddKeyframe(selectedProperty);
    }

    // Delete keyframe
    if (e.key === 'Delete' && selectedKeyframeId) {
      handleDeleteKeyframe(selectedKeyframeId);
    }

    // Previous/Next keyframe
    if (e.key === 'ArrowLeft' && e.altKey) {
      goToPreviousKeyframe();
    }
    if (e.key === 'ArrowRight' && e.altKey) {
      goToNextKeyframe();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedProperty, selectedKeyframeId]);
```

## Performance Tips

1. **Memoize Animated Values**: Use `useMemo` for expensive calculations
```tsx
const animatedProps = useMemo(
  () => getElementAnimatedValues(keyframes, currentTime, defaults),
  [keyframes, currentTime]
);
```

2. **Throttle Timeline Updates**: Don't update too frequently during playback
```tsx
const throttledTime = Math.floor(currentTime / 16) * 16; // ~60fps
```

3. **Virtualize Timeline**: Only render visible keyframes
```tsx
const visibleKeyframes = keyframes.filter(kf => {
  const position = kf.time * pixelsPerMs;
  return position >= scrollX && position <= scrollX + viewportWidth;
});
```

## Troubleshooting

### Animations not showing?
- Check that keyframes have the correct property names
- Ensure currentTime is updating during playback
- Verify element has keyframes array

### Keyframes not moving?
- Check that onKeyframesChange is being called
- Verify pixelsPerMs calculation
- Ensure drag event handlers are working

### Wrong interpolation?
- Check keyframe times are in correct order
- Verify easing function is valid
- Test with 'linear' easing first

## Next Steps

1. Review the complete example: `/app/examples/KeyframeSystemExample.tsx`
2. Read full documentation: `/app/lib/effects/README.md`
3. Test with simple animations first
4. Add presets and templates
5. Implement undo/redo for keyframe operations

## API Reference

### Core Functions

```typescript
// Create a keyframe
createKeyframe(property, time, value, easing?)

// Get animated value at time
getAnimatedValue(keyframes, property, time, defaultValue?)

// Get all animated values
getElementAnimatedValues(keyframes, time, defaults?)

// Interpolate between keyframes
interpolateValue(startKeyframe, endKeyframe, currentTime)

// Find keyframes around time
findSurroundingKeyframes(keyframes, property, time)
```

### Components

```typescript
// Keyframe Timeline
<KeyframeTimeline
  elementId={string}
  keyframes={Keyframe[]}
  currentTime={number}
  duration={number}
  selectedProperty={AnimatableProperty | null}
  onKeyframesChange={(keyframes) => void}
  onSelectedKeyframeChange={(id) => void}
  selectedKeyframeId={string | null}
  zoom={number}
/>

// Keyframe Editor
<KeyframeEditor
  elementId={string}
  keyframes={Keyframe[]}
  currentTime={number}
  selectedProperty={AnimatableProperty | null}
  selectedKeyframeId={string | null}
  onKeyframesChange={(keyframes) => void}
  onPropertySelect={(property) => void}
/>
```

## Support

For issues or questions:
1. Check the README: `/app/lib/effects/README.md`
2. Review the example: `/app/examples/KeyframeSystemExample.tsx`
3. Test with simplified cases
