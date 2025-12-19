# Keyframe Animation System - Quick Start

Get started with the keyframe animation system in 5 minutes.

## Files Created (10 files, ~2,800 lines)

### Core System
- `app/lib/effects/easing.ts` - 14 easing functions
- `app/lib/effects/animations.ts` - Animation engine
- `app/components/keyframes/KeyframeDiamond.tsx` - Keyframe marker UI
- `app/components/keyframes/KeyframeTimeline.tsx` - Timeline UI
- `app/components/keyframes/KeyframeEditor.tsx` - Property editor UI
- `app/components/keyframes/index.ts` - Exports

### Documentation
- `app/lib/effects/README.md` - Full API documentation
- `app/lib/effects/INTEGRATION_GUIDE.md` - Step-by-step integration
- `app/lib/effects/VISUAL_GUIDE.md` - UI visual reference
- `app/examples/KeyframeSystemExample.tsx` - Complete working demo

### Summary Files
- `KEYFRAME_SYSTEM_COMPLETE.md` - Full feature list
- `KEYFRAME_QUICK_START.md` - This file

## 1-Minute Overview

**What it does**: Animate element properties over time with smooth interpolation.

**Animatable Properties** (8):
- Position: x, y
- Size: width, height
- Transform: rotation, scaleX, scaleY
- Opacity: opacity

**Easing Functions** (14):
- Basic: linear, easeIn, easeOut, easeInOut
- Cubic: easeInCubic, easeOutCubic, easeInOutCubic
- Quartic: easeInQuart, easeOutQuart, easeInOutQuart
- Elastic: easeInElastic, easeOutElastic
- Bounce: easeInBounce, easeOutBounce

## 2-Minute Setup

### Step 1: Import Components
```tsx
import { KeyframeTimeline, KeyframeEditor } from '@/app/components/keyframes';
import { Keyframe, AnimatableProperty } from '@/app/lib/effects/animations';
```

### Step 2: Add State
```tsx
const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
const [selectedProperty, setSelectedProperty] = useState<AnimatableProperty | null>(null);
const [currentTime, setCurrentTime] = useState(0);
```

### Step 3: Add Components
```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="col-span-2">
    <KeyframeTimeline
      elementId="element-1"
      keyframes={keyframes}
      currentTime={currentTime}
      duration={10000}
      selectedProperty={selectedProperty}
      onKeyframesChange={setKeyframes}
      onSelectedKeyframeChange={setSelectedKeyframeId}
      selectedKeyframeId={selectedKeyframeId}
      zoom={1}
    />
  </div>
  <div>
    <KeyframeEditor
      elementId="element-1"
      keyframes={keyframes}
      currentTime={currentTime}
      selectedProperty={selectedProperty}
      selectedKeyframeId={selectedKeyframeId}
      onKeyframesChange={setKeyframes}
      onPropertySelect={setSelectedProperty}
    />
  </div>
</div>
```

### Step 4: Apply Animations
```tsx
import { getElementAnimatedValues } from '@/app/lib/effects/animations';

const animatedProps = getElementAnimatedValues(keyframes, currentTime, {
  x: 0, y: 0, width: 100, height: 100,
  rotation: 0, scaleX: 1, scaleY: 1, opacity: 1
});

<div style={{
  transform: `
    translate(${animatedProps.x}px, ${animatedProps.y}px)
    rotate(${animatedProps.rotation}deg)
    scale(${animatedProps.scaleX}, ${animatedProps.scaleY})
  `,
  opacity: animatedProps.opacity,
}} />
```

Done! You now have a working keyframe animation system.

## 5-Minute Demo

### Run the Example
```tsx
// Import in any page
import KeyframeSystemExample from '@/app/examples/KeyframeSystemExample';

export default function Page() {
  return <KeyframeSystemExample />;
}
```

The example includes:
- Complete video editor UI
- Multiple animated elements
- Playback controls
- Timeline scrubbing
- Keyframe editing

## Common Operations

### Create Animation Programmatically
```tsx
import { createKeyframe } from '@/app/lib/effects/animations';

// Fade in animation
const fadeIn = [
  createKeyframe('opacity', 0, 0, 'easeIn'),
  createKeyframe('opacity', 1000, 1, 'linear'),
];

// Slide in animation
const slideIn = [
  createKeyframe('x', 0, -200, 'easeOut'),
  createKeyframe('x', 800, 0, 'linear'),
];

setKeyframes([...fadeIn, ...slideIn]);
```

### Get Value at Specific Time
```tsx
import { getAnimatedValue } from '@/app/lib/effects/animations';

const xAt500ms = getAnimatedValue(keyframes, 'x', 500);
const opacityAt1000ms = getAnimatedValue(keyframes, 'opacity', 1000);
```

### Find Keyframes
```tsx
import { findSurroundingKeyframes } from '@/app/lib/effects/animations';

const { before, after, exact } = findSurroundingKeyframes(
  keyframes,
  'x',
  1500
);
```

## Timeline Interactions

**Add Keyframe**: Click on any property track
**Move Keyframe**: Drag diamond marker left/right
**Delete Keyframe**: Right-click on diamond
**Select Keyframe**: Click on diamond (edits in right panel)

## Keyboard Shortcuts (Recommended Implementation)

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && selectedProperty) {
      // Add keyframe at current time
    }
    if (e.key === 'Delete' && selectedKeyframeId) {
      // Delete selected keyframe
    }
    if (e.key === ' ') {
      // Toggle playback
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedProperty, selectedKeyframeId]);
```

## Animation Presets

```tsx
// Create reusable animation presets
const presets = {
  fadeIn: (startTime = 0) => [
    createKeyframe('opacity', startTime, 0, 'easeIn'),
    createKeyframe('opacity', startTime + 1000, 1, 'linear'),
  ],

  fadeOut: (startTime = 0) => [
    createKeyframe('opacity', startTime, 1, 'linear'),
    createKeyframe('opacity', startTime + 1000, 0, 'easeOut'),
  ],

  slideInLeft: (startTime = 0) => [
    createKeyframe('x', startTime, -200, 'easeOut'),
    createKeyframe('x', startTime + 800, 0, 'linear'),
  ],

  bounceIn: (startTime = 0) => [
    createKeyframe('scaleX', startTime, 0, 'easeOutBounce'),
    createKeyframe('scaleX', startTime + 1500, 1, 'linear'),
    createKeyframe('scaleY', startTime, 0, 'easeOutBounce'),
    createKeyframe('scaleY', startTime + 1500, 1, 'linear'),
  ],

  spin: (startTime = 0) => [
    createKeyframe('rotation', startTime, 0, 'linear'),
    createKeyframe('rotation', startTime + 1000, 360, 'linear'),
  ],
};

// Use preset
setKeyframes(presets.fadeIn(0));
```

## Playback Loop

```tsx
const [isPlaying, setIsPlaying] = useState(false);
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
```

## Easing Function Picker

```tsx
import { easingLabels, easingGroups } from '@/app/lib/effects/easing';

<select value={easing} onChange={(e) => setEasing(e.target.value)}>
  {Object.entries(easingGroups).map(([group, easings]) => (
    <optgroup key={group} label={group.toUpperCase()}>
      {easings.map(easing => (
        <option key={easing} value={easing}>
          {easingLabels[easing]}
        </option>
      ))}
    </optgroup>
  ))}
</select>
```

## Property Configuration

```tsx
import { propertyConfig } from '@/app/lib/effects/animations';

// Get property constraints
const xConfig = propertyConfig.x;
// { label: 'Position X', unit: 'px', min: -10000, max: 10000, step: 1 }

// Use in input
<input
  type="number"
  min={xConfig.min}
  max={xConfig.max}
  step={xConfig.step}
  placeholder={`${xConfig.label} (${xConfig.unit})`}
/>
```

## TypeScript Types

```typescript
import type {
  Keyframe,
  AnimatableProperty,
  AnimationTrack,
  AnimatedValue,
} from '@/app/lib/effects/animations';

import type {
  EasingType,
  BezierPoints,
} from '@/app/lib/effects/easing';
```

## File Sizes

```
easing.ts           ~6 KB
animations.ts       ~11 KB
KeyframeDiamond.tsx ~4 KB
KeyframeTimeline.tsx ~8 KB
KeyframeEditor.tsx  ~11 KB
Example.tsx         ~15 KB
```

## Next Steps

1. **See it in action**: Open `app/examples/KeyframeSystemExample.tsx`
2. **Read the docs**: Check `app/lib/effects/README.md`
3. **Follow integration**: Use `app/lib/effects/INTEGRATION_GUIDE.md`
4. **Visual reference**: View `app/lib/effects/VISUAL_GUIDE.md`

## Troubleshooting

**Keyframes not showing?**
- Check that `keyframes` array has items
- Verify `pixelsPerMs` calculation
- Ensure timeline width is sufficient

**Values not interpolating?**
- Check keyframe times are in order
- Verify property names match exactly
- Test with 'linear' easing first

**Performance issues?**
- Memoize `getElementAnimatedValues` calls
- Reduce keyframe count
- Use simpler easing functions

## Support Resources

- **Full Docs**: `app/lib/effects/README.md` (570 lines)
- **Integration**: `app/lib/effects/INTEGRATION_GUIDE.md` (420 lines)
- **Visual Guide**: `app/lib/effects/VISUAL_GUIDE.md` (500+ lines)
- **Example**: `app/examples/KeyframeSystemExample.tsx` (490 lines)
- **Summary**: `KEYFRAME_SYSTEM_COMPLETE.md` (550 lines)

## Quick Command Reference

```typescript
// Core functions
createKeyframe(property, time, value, easing?)
getAnimatedValue(keyframes, property, time, defaultValue?)
getElementAnimatedValues(keyframes, time, defaults)
interpolateValue(startKf, endKf, currentTime)

// Utilities
findSurroundingKeyframes(keyframes, property, time)
getKeyframesAtTime(keyframes, time, tolerance?)
getAnimatedProperties(keyframes)
removeKeyframes(keyframes, ids)
```

## Complete Example (Copy-Paste Ready)

```tsx
'use client';

import { useState } from 'react';
import { KeyframeTimeline, KeyframeEditor } from '@/app/components/keyframes';
import {
  Keyframe,
  AnimatableProperty,
  getElementAnimatedValues,
  createKeyframe,
} from '@/app/lib/effects/animations';

export default function SimpleKeyframeDemo() {
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    createKeyframe('x', 0, 0, 'easeInOut'),
    createKeyframe('x', 2000, 400, 'easeInOut'),
    createKeyframe('opacity', 0, 0, 'easeIn'),
    createKeyframe('opacity', 1000, 1, 'linear'),
  ]);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<AnimatableProperty | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const animatedProps = getElementAnimatedValues(keyframes, currentTime, {
    x: 0, y: 0, width: 100, height: 100,
    rotation: 0, scaleX: 1, scaleY: 1, opacity: 1,
  });

  return (
    <div className="p-8 space-y-4">
      {/* Preview */}
      <div className="bg-black h-64 relative">
        <div
          className="absolute bg-purple-600 rounded"
          style={{
            width: animatedProps.width,
            height: animatedProps.height,
            transform: `translate(${animatedProps.x}px, ${animatedProps.y}px)`,
            opacity: animatedProps.opacity,
          }}
        >
          Animated Element
        </div>
      </div>

      {/* Controls */}
      <input
        type="range"
        min={0}
        max={5000}
        value={currentTime}
        onChange={(e) => setCurrentTime(Number(e.target.value))}
        className="w-full"
      />

      {/* Keyframes */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <KeyframeTimeline
            elementId="demo"
            keyframes={keyframes}
            currentTime={currentTime}
            duration={5000}
            selectedProperty={selectedProperty}
            onKeyframesChange={setKeyframes}
            onSelectedKeyframeChange={setSelectedKeyframeId}
            selectedKeyframeId={selectedKeyframeId}
            zoom={1}
          />
        </div>
        <div>
          <KeyframeEditor
            elementId="demo"
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

---

That's it! You now have everything you need to add professional keyframe animation to your video editor.
