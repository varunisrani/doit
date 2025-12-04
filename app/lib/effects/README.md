# Keyframe Animation System

Complete keyframe-based animation system for the video editor. This system allows animating element properties over time with various easing functions.

## Features

- **Keyframe Management**: Create, edit, move, and delete keyframes
- **Interpolation**: Smooth interpolation between keyframes using easing functions
- **Multiple Easing Functions**: 14 different easing functions including elastic and bounce
- **Animatable Properties**: Position (x, y), size (width, height), transform (rotation, scaleX, scaleY), and opacity
- **Real-time Preview**: See animations update in real-time during playback
- **Visual Timeline**: Diamond markers for keyframes with drag-to-move functionality
- **Curve Editor**: Visual preview of easing curves

## Usage

### Basic Animation Setup

```typescript
import {
  createKeyframe,
  getAnimatedValue,
  Keyframe,
  AnimatableProperty
} from '@/app/lib/effects/animations';

// Create keyframes
const keyframes: Keyframe[] = [
  createKeyframe('x', 0, 0, 'linear'),      // Start at x=0
  createKeyframe('x', 1000, 200, 'easeOut'), // Move to x=200 at 1s
  createKeyframe('x', 2000, 0, 'easeIn'),    // Return to x=0 at 2s
];

// Get value at any time
const currentX = getAnimatedValue(keyframes, 'x', 500); // x at 500ms
```

### Using with Timeline Component

```typescript
import { KeyframeTimeline, KeyframeEditor } from '@/app/components/keyframes';
import { useState } from 'react';

function VideoEditor() {
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<AnimatableProperty | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Keyframe Timeline */}
      <KeyframeTimeline
        elementId="element-1"
        keyframes={keyframes}
        currentTime={currentTime}
        duration={5000}
        selectedProperty={selectedProperty}
        onKeyframesChange={setKeyframes}
        onSelectedKeyframeChange={setSelectedKeyframeId}
        selectedKeyframeId={selectedKeyframeId}
        zoom={1}
      />

      {/* Keyframe Editor */}
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
  );
}
```

### Applying Animations to Elements

```typescript
import { getElementAnimatedValues } from '@/app/lib/effects/animations';

function AnimatedElement({ keyframes, currentTime }) {
  // Get all animated values for current time
  const animatedValues = getElementAnimatedValues(keyframes, currentTime, {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
  });

  const transform = `
    translate(${animatedValues.x}px, ${animatedValues.y}px)
    rotate(${animatedValues.rotation}deg)
    scale(${animatedValues.scaleX}, ${animatedValues.scaleY})
  `;

  return (
    <div
      style={{
        width: animatedValues.width,
        height: animatedValues.height,
        transform,
        opacity: animatedValues.opacity,
      }}
    >
      Animated Element
    </div>
  );
}
```

## Easing Functions

### Available Easing Functions

#### Basic
- `linear` - No easing
- `easeIn` - Quadratic ease in
- `easeOut` - Quadratic ease out
- `easeInOut` - Quadratic ease in/out

#### Cubic
- `easeInCubic` - Cubic ease in
- `easeOutCubic` - Cubic ease out
- `easeInOutCubic` - Cubic ease in/out

#### Quartic
- `easeInQuart` - Quartic ease in
- `easeOutQuart` - Quartic ease out
- `easeInOutQuart` - Quartic ease in/out

#### Elastic
- `easeInElastic` - Elastic ease in (spring effect)
- `easeOutElastic` - Elastic ease out (spring effect)

#### Bounce
- `easeInBounce` - Bounce ease in
- `easeOutBounce` - Bounce ease out

#### Custom
- `cubicBezier(x1, y1, x2, y2)` - Custom cubic bezier curve

### Using Custom Bezier

```typescript
import { cubicBezier } from '@/app/lib/effects/easing';

// Create a custom easing function
const customEasing = cubicBezier(0.42, 0, 0.58, 1); // Similar to ease-in-out

// Use it to get eased value
const t = 0.5; // Normalized time (0-1)
const easedValue = customEasing(t);
```

## Keyframe Data Structure

```typescript
interface Keyframe {
  id: string;                    // Unique identifier
  time: number;                  // Time in milliseconds
  property: AnimatableProperty;  // Property being animated
  value: number;                 // Value at this keyframe
  easing: EasingType;           // Easing function to next keyframe
}
```

## Animatable Properties

```typescript
type AnimatableProperty =
  | 'x'         // Position X (px)
  | 'y'         // Position Y (px)
  | 'width'     // Width (px)
  | 'height'    // Height (px)
  | 'rotation'  // Rotation (degrees)
  | 'scaleX'    // Scale X (multiplier)
  | 'scaleY'    // Scale Y (multiplier)
  | 'opacity';  // Opacity (0-1)
```

## Timeline Interactions

### Adding Keyframes
- Click on any property track to add a keyframe at the current time
- Value is automatically interpolated if between existing keyframes

### Moving Keyframes
- Click and drag keyframe diamonds to move them in time
- Keyframes cannot be moved before time 0

### Deleting Keyframes
- Right-click on a keyframe diamond to delete it

### Selecting Keyframes
- Click on a keyframe to select it
- Selected keyframe appears in the editor panel

## Property Configuration

Each property has specific constraints:

```typescript
const propertyConfig = {
  x:        { min: -10000, max: 10000, step: 1,    unit: 'px' },
  y:        { min: -10000, max: 10000, step: 1,    unit: 'px' },
  width:    { min: 0,      max: 10000, step: 1,    unit: 'px' },
  height:   { min: 0,      max: 10000, step: 1,    unit: 'px' },
  rotation: { min: -360,   max: 360,   step: 1,    unit: '°'  },
  scaleX:   { min: 0,      max: 10,    step: 0.1,  unit: 'x'  },
  scaleY:   { min: 0,      max: 10,    step: 0.1,  unit: 'x'  },
  opacity:  { min: 0,      max: 1,     step: 0.01, unit: ''   },
};
```

## Advanced Usage

### Finding Keyframes

```typescript
import { findSurroundingKeyframes } from '@/app/lib/effects/animations';

const { before, after, exact } = findSurroundingKeyframes(
  keyframes,
  'x',
  1500 // time in ms
);

if (exact) {
  console.log('Keyframe exists at this exact time');
}
```

### Calculating Animation Curve

```typescript
import { calculateIntermediateValues } from '@/app/lib/effects/animations';

const startKf = keyframes[0];
const endKf = keyframes[1];

// Get 60 intermediate values for smooth curve
const curve = calculateIntermediateValues(startKf, endKf, 60);

curve.forEach(({ time, value }) => {
  console.log(`At ${time}ms: ${value}`);
});
```

### Batch Operations

```typescript
import {
  getKeyframesAtTime,
  removeKeyframes,
  getAnimatedProperties
} from '@/app/lib/effects/animations';

// Get all keyframes at a specific time
const keyframesAt1000ms = getKeyframesAtTime(keyframes, 1000);

// Remove multiple keyframes
const ids = ['kf_1', 'kf_2', 'kf_3'];
const updated = removeKeyframes(keyframes, ids);

// Get list of all animated properties
const properties = getAnimatedProperties(keyframes);
console.log('Animated properties:', properties);
```

## Performance Tips

1. **Minimize Keyframe Lookups**: Cache animated values during playback
2. **Use Appropriate Easing**: Simple easing functions (linear, easeIn/Out) are faster
3. **Batch Updates**: Update multiple properties together to minimize re-renders
4. **Limit Preview Resolution**: Use fewer intermediate values for preview

## Integration with Video Playback

```typescript
function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now() - currentTime;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      setCurrentTime(elapsed);

      if (elapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  return (
    <div>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <AnimatedElement keyframes={keyframes} currentTime={currentTime} />
    </div>
  );
}
```

## Testing

Example test cases:

```typescript
import { getAnimatedValue, createKeyframe } from '@/app/lib/effects/animations';

// Test linear interpolation
const keyframes = [
  createKeyframe('x', 0, 0, 'linear'),
  createKeyframe('x', 1000, 100, 'linear'),
];

expect(getAnimatedValue(keyframes, 'x', 0)).toBe(0);
expect(getAnimatedValue(keyframes, 'x', 500)).toBe(50);
expect(getAnimatedValue(keyframes, 'x', 1000)).toBe(100);

// Test easing
const easedKeyframes = [
  createKeyframe('opacity', 0, 0, 'easeInOut'),
  createKeyframe('opacity', 1000, 1, 'easeInOut'),
];

const midValue = getAnimatedValue(easedKeyframes, 'opacity', 500);
expect(midValue).toBeGreaterThan(0.4);
expect(midValue).toBeLessThan(0.6);
```

## Future Enhancements

- [ ] Keyframe groups for synchronizing multiple properties
- [ ] Copy/paste keyframes
- [ ] Keyframe templates/presets
- [ ] Motion paths for x/y animation
- [ ] Multi-select keyframes
- [ ] Snap to grid/time markers
- [ ] Undo/redo support
- [ ] Export/import animation data
