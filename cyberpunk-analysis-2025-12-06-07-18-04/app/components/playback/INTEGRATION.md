# Playback System Integration Guide

## Quick Start

### 1. Basic Setup

Add playback controls to your editor:

```tsx
import { PlaybackControls } from '@/app/components/playback';

export function Editor() {
  return (
    <div>
      <PlaybackControls />
    </div>
  );
}
```

### 2. With Canvas Rendering

Connect playback to canvas rendering:

```tsx
import { PlaybackControls } from '@/app/components/playback';
import { useRef, useCallback } from 'react';

export function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRender = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render your content at currentTime
    // ... your rendering logic here
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={1920} height={1080} />
      <PlaybackControls onRender={handleRender} />
    </div>
  );
}
```

### 3. Custom Controls

Build your own controls using the hook:

```tsx
import { usePlayback } from '@/app/hooks/usePlayback';

export function CustomPlayer() {
  const {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seek,
  } = usePlayback();

  return (
    <div>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <progress value={currentTime} max={duration} />
    </div>
  );
}
```

## Timeline Integration

### Syncing with Timeline Store

The playback system automatically syncs with `useTimelineStore`:

```tsx
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { usePlayback } from '@/app/hooks/usePlayback';

function SyncedEditor() {
  const { tracks, currentTime: storeTime } = useTimelineStore();
  const { currentTime, isPlaying } = usePlayback();

  // currentTime from usePlayback === storeTime
  // They are automatically synchronized

  return (
    <div>
      <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
      <p>Time: {currentTime}s</p>
      <p>Tracks: {tracks.length}</p>
    </div>
  );
}
```

### Rendering Clips at Current Time

```tsx
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { PlaybackControls } from '@/app/components/playback';

function ClipRenderer() {
  const { tracks } = useTimelineStore();

  const handleRender = useCallback((currentTime: number) => {
    // Find all clips visible at current time
    const visibleClips = tracks.flatMap(track =>
      track.clips.filter(clip =>
        currentTime >= clip.startTime &&
        currentTime <= clip.startTime + clip.duration
      )
    );

    // Render each visible clip
    visibleClips.forEach(clip => {
      renderClip(clip, currentTime - clip.startTime);
    });
  }, [tracks]);

  return <PlaybackControls onRender={handleRender} />;
}
```

## Canvas Integration

### Complete Canvas Rendering

```tsx
import { useRef, useCallback } from 'react';
import { PlaybackControls } from '@/app/components/playback';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { useEditorStore } from '@/app/lib/store/editorStore';

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tracks } = useTimelineStore();
  const { project } = useEditorStore();

  const handleRender = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with background color
    ctx.fillStyle = project.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all tracks in order
    tracks
      .sort((a, b) => a.order - b.order)
      .forEach(track => {
        if (!track.visible || track.muted) return;

        track.clips.forEach(clip => {
          const clipStartTime = clip.startTime;
          const clipEndTime = clip.startTime + clip.duration;

          if (currentTime >= clipStartTime && currentTime < clipEndTime) {
            renderClipAtTime(ctx, clip, currentTime - clipStartTime);
          }
        });
      });
  }, [tracks, project.backgroundColor]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-black flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={project.width}
          height={project.height}
          className="max-w-full max-h-full"
        />
      </div>
      <PlaybackControls onRender={handleRender} />
    </div>
  );
}

function renderClipAtTime(
  ctx: CanvasRenderingContext2D,
  clip: any,
  relativeTime: number
) {
  ctx.save();

  // Apply transformations
  if (clip.position) {
    ctx.translate(clip.position.x, clip.position.y);
  }

  if (clip.rotation) {
    ctx.rotate((clip.rotation * Math.PI) / 180);
  }

  if (clip.scale) {
    ctx.scale(clip.scale.x, clip.scale.y);
  }

  if (clip.opacity !== undefined) {
    ctx.globalAlpha = clip.opacity;
  }

  // Render based on clip type
  switch (clip.type) {
    case 'image':
      renderImage(ctx, clip);
      break;
    case 'video':
      renderVideo(ctx, clip, relativeTime);
      break;
    case 'text':
      renderText(ctx, clip);
      break;
  }

  ctx.restore();
}

function renderImage(ctx: CanvasRenderingContext2D, clip: any) {
  // Load and render image
  const img = new Image();
  img.src = clip.url;
  ctx.drawImage(img, 0, 0);
}

function renderVideo(ctx: CanvasRenderingContext2D, clip: any, time: number) {
  // Render video frame at specific time
  // This requires video element with current time set
}

function renderText(ctx: CanvasRenderingContext2D, clip: any) {
  if (!clip.text || !clip.textStyle) return;

  const style = clip.textStyle;

  ctx.font = `${style.bold ? 'bold' : ''} ${style.italic ? 'italic' : ''} ${style.fontSize}px ${style.fontFamily}`;
  ctx.fillStyle = style.color;
  ctx.textAlign = style.align || 'left';

  if (style.backgroundColor) {
    const metrics = ctx.measureText(clip.text);
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, metrics.width, style.fontSize);
    ctx.fillStyle = style.color;
  }

  ctx.fillText(clip.text, 0, style.fontSize);
}
```

## Playhead Synchronization

### Update Playhead Position

```tsx
import { usePlayback } from '@/app/hooks/usePlayback';
import { useTimeline } from '@/app/hooks/useTimeline';

function TimelineScrubber() {
  const { currentTime } = usePlayback();
  const { timeToPixel } = useTimeline();

  // Convert current time to pixel position
  const playheadPosition = timeToPixel(currentTime);

  return (
    <div className="timeline">
      <div
        className="playhead"
        style={{ left: `${playheadPosition}px` }}
      />
      {/* Timeline content */}
    </div>
  );
}
```

## Advanced Features

### Render Progress Indicator

```tsx
import { useState } from 'react';
import { PlaybackControls } from '@/app/components/playback';

function EditorWithProgress() {
  const [renderTime, setRenderTime] = useState(0);

  const handleRender = (currentTime: number) => {
    const startTime = performance.now();

    // Your render logic here
    renderCanvas(currentTime);

    const endTime = performance.now();
    setRenderTime(endTime - startTime);
  };

  return (
    <div>
      <div className="stats">
        Render time: {renderTime.toFixed(2)}ms
      </div>
      <PlaybackControls onRender={handleRender} />
    </div>
  );
}
```

### Conditional Playback

```tsx
import { usePlayback } from '@/app/hooks/usePlayback';
import { useEffect } from 'react';

function ConditionalPlayback() {
  const { play, pause, currentTime } = usePlayback();

  useEffect(() => {
    // Auto-pause at specific time
    if (currentTime >= 10 && currentTime <= 10.1) {
      pause();
    }
  }, [currentTime, pause]);

  return <div>Will pause at 10 seconds</div>;
}
```

### Multiple Playback Instances

```tsx
// Note: The playback system uses a singleton pattern
// For multiple instances, you need separate stores

import { PlaybackControls } from '@/app/components/playback';

function ComparisonView() {
  // Each instance shares the same timeline store
  // Use separate components or contexts for isolation

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Preview A</h3>
        <PlaybackControls />
      </div>
      <div>
        <h3>Preview B</h3>
        {/* Same playback state - synced */}
        <PlaybackControls />
      </div>
    </div>
  );
}
```

## Performance Tips

### 1. Memoize Render Callback

```tsx
const handleRender = useCallback((currentTime: number) => {
  // Render logic
}, [/* dependencies */]);
```

### 2. Throttle Heavy Operations

```tsx
import { throttle } from 'lodash';

const heavyRender = throttle((currentTime: number) => {
  // Expensive rendering
}, 16); // ~60fps

const handleRender = (currentTime: number) => {
  // Light updates
  updatePlayhead(currentTime);

  // Heavy updates (throttled)
  heavyRender(currentTime);
};
```

### 3. Use OffscreenCanvas

```tsx
const offscreenCanvas = new OffscreenCanvas(1920, 1080);
const offscreenCtx = offscreenCanvas.getContext('2d');

const handleRender = (currentTime: number) => {
  // Render to offscreen canvas
  renderToCanvas(offscreenCtx, currentTime);

  // Copy to visible canvas
  const mainCtx = mainCanvas.getContext('2d');
  mainCtx.drawImage(offscreenCanvas, 0, 0);
};
```

## Troubleshooting

### Issue: Playback is choppy

**Solution**: Optimize your render callback
```tsx
// Bad: Creating new objects every frame
const handleRender = (time) => {
  const clips = getClips(); // Recalculates every frame
  clips.forEach(clip => render(clip));
};

// Good: Memoize expensive calculations
const visibleClips = useMemo(() => getClips(), [dependencies]);
const handleRender = (time) => {
  visibleClips.forEach(clip => render(clip, time));
};
```

### Issue: Time display not updating

**Solution**: Ensure onRender callback is provided
```tsx
<PlaybackControls onRender={handleRender} />
```

### Issue: Keyboard shortcuts not working

**Solution**: Check focus is not in input field
```tsx
// Shortcuts disabled when typing
<input type="text" /> // Focus here = no shortcuts
```

## Testing

### Unit Tests

```tsx
import { renderHook, act } from '@testing-library/react';
import { usePlayback } from '@/app/hooks/usePlayback';

test('playback starts and stops', () => {
  const { result } = renderHook(() => usePlayback());

  expect(result.current.isPlaying).toBe(false);

  act(() => {
    result.current.play();
  });

  expect(result.current.isPlaying).toBe(true);

  act(() => {
    result.current.stop();
  });

  expect(result.current.isPlaying).toBe(false);
  expect(result.current.currentTime).toBe(0);
});
```

### Integration Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaybackControls } from '@/app/components/playback';

test('play button toggles playback', () => {
  render(<PlaybackControls />);

  const playButton = screen.getByLabelText('Play');
  fireEvent.click(playButton);

  expect(screen.getByLabelText('Pause')).toBeInTheDocument();
});
```

## Migration Guide

If you have existing playback code:

### Before
```tsx
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);

const play = () => setIsPlaying(true);
const pause = () => setIsPlaying(false);
```

### After
```tsx
import { usePlayback } from '@/app/hooks/usePlayback';

const { isPlaying, currentTime, play, pause } = usePlayback();
```

The new system handles:
- requestAnimationFrame loops
- Time synchronization
- Speed control
- Keyboard shortcuts
- Store synchronization

All automatically!
