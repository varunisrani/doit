# Playback System Documentation

## Overview

The playback system provides complete video editor playback functionality with smooth, frame-accurate playback at 30/60 fps. It uses `requestAnimationFrame` for smooth rendering and integrates seamlessly with the timeline store.

## Components

### PlaybackControls

A comprehensive playback control component with all standard video editor controls.

#### Features

- **Play/Pause/Stop**: Standard playback controls
- **Frame Stepping**: Step forward/backward by single frames
- **Seeking**: Scrub through timeline with visual feedback
- **Speed Control**: Variable playback speeds (0.25x to 2x)
- **Loop Mode**: Automatic restart when reaching end
- **Skip Controls**: Skip forward/backward by 5 seconds
- **Jump Controls**: Jump to start/end instantly
- **Time Display**: Accurate time display with milliseconds
- **Keyboard Shortcuts**: Full keyboard support

#### Props

```typescript
interface PlaybackControlsProps {
  className?: string;
  showFrameStep?: boolean;      // Show J/L frame step buttons
  showSkipButtons?: boolean;     // Show skip/jump buttons
  showSpeedControl?: boolean;    // Show speed dropdown
  showLoopButton?: boolean;      // Show loop toggle
  showTimeDisplay?: boolean;     // Show time counter
  showScrubber?: boolean;        // Show timeline scrubber
  onRender?: (currentTime: number) => void;  // Render callback
}
```

#### Usage

```tsx
import { PlaybackControls } from '@/app/components/playback';

function Editor() {
  const handleRender = (currentTime: number) => {
    // Update canvas rendering based on current time
    renderCanvas(currentTime);
  };

  return (
    <PlaybackControls
      onRender={handleRender}
      showFrameStep={true}
      showSpeedControl={true}
    />
  );
}
```

## Hook

### usePlayback

A hook that manages all playback state and operations.

#### Features

- **State Management**: Syncs with timeline store
- **Playback Control**: Play, pause, stop, seek
- **Frame Operations**: Step forward/backward by frames
- **Speed Control**: Variable playback speeds
- **Keyboard Shortcuts**: Automatic keyboard handling
- **Callbacks**: Render and completion callbacks

#### Return Values

```typescript
{
  // State
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  loop: boolean;
  playbackSpeed: number;

  // Playback controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;

  // Navigation
  jumpToStart: () => void;
  jumpToEnd: () => void;
  skipForward: (amount?: number) => void;
  skipBackward: (amount?: number) => void;
  stepForward: () => void;
  stepBackward: () => void;

  // Settings
  setSpeed: (speed: number) => void;
  toggleLoop: () => void;
  setLoop: (loop: boolean) => void;

  // Available speeds
  availableSpeeds: PlaybackSpeed[];
}
```

#### Usage

```tsx
import { usePlayback } from '@/app/hooks/usePlayback';

function CustomPlayer() {
  const {
    isPlaying,
    currentTime,
    play,
    pause,
    seek
  } = usePlayback({
    onRender: (time) => {
      console.log('Render at:', time);
    },
    onComplete: () => {
      console.log('Playback completed');
    }
  });

  return (
    <div>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        value={currentTime}
        onChange={(e) => seek(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

## Keyboard Shortcuts

The playback system includes built-in keyboard shortcuts:

| Key | Action |
|-----|--------|
| **Space** or **K** | Play/Pause toggle |
| **J** | Step backward one frame |
| **L** | Step forward one frame |
| **←** | Skip backward 1 second |
| **→** | Skip forward 1 second |
| **Shift + ←** | Jump to start |
| **Shift + →** | Jump to end |
| **Home** | Jump to start |
| **End** | Jump to end |

Keyboard shortcuts are automatically disabled when typing in input fields.

## Playback Speeds

Available playback speeds:

- 0.25x (Quarter speed)
- 0.5x (Half speed)
- 0.75x (Three-quarter speed)
- 1x (Normal speed)
- 1.25x
- 1.5x
- 2x (Double speed)

## Integration with Timeline

The playback system integrates with the timeline store:

```typescript
// From timelineStore
{
  currentTime: number;    // Synced automatically
  duration: number;       // Used for scrubber max
  isPlaying: boolean;     // Playback state
  loop: boolean;          // Loop mode
}
```

### Rendering Integration

To sync canvas rendering with playback:

```tsx
import { usePlayback } from '@/app/hooks/usePlayback';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useTimelineStore } from '@/app/lib/store/timelineStore';

function VideoEditor() {
  const { elements } = useCanvasStore();
  const { tracks } = useTimelineStore();

  const handleRender = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get all visible clips at current time
    const visibleClips = tracks.flatMap(track =>
      track.clips.filter(clip =>
        currentTime >= clip.startTime &&
        currentTime <= clip.startTime + clip.duration
      )
    );

    // Render each visible clip
    visibleClips.forEach(clip => {
      renderClip(ctx, clip, currentTime);
    });
  }, [tracks]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <PlaybackControls onRender={handleRender} />
    </div>
  );
}
```

## Performance

### Optimization Tips

1. **Throttle expensive renders**: Use `requestAnimationFrame` (already handled)
2. **Memoize render function**: Wrap in `useCallback`
3. **Optimize canvas operations**: Clear only changed regions
4. **Lazy load assets**: Load assets on demand
5. **Use offscreen canvas**: For complex compositions

### Frame Rate

The playback system uses the FPS setting from `editorStore.project.fps`:

- Default: 30 fps
- Supported: Any value (typically 24, 30, 60)
- Frame time calculated automatically
- Smooth playback via `requestAnimationFrame`

## Advanced Usage

### Custom Playback Controls

Build custom controls using the hook:

```tsx
function CustomControls() {
  const {
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    togglePlayPause,
    setSpeed,
    seek,
  } = usePlayback();

  return (
    <div className="custom-controls">
      <button onClick={togglePlayPause}>
        {isPlaying ? '⏸' : '▶'}
      </button>

      <input
        type="range"
        value={currentTime}
        max={duration}
        onChange={(e) => seek(parseFloat(e.target.value))}
      />

      <select
        value={playbackSpeed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
      >
        <option value="0.5">0.5x</option>
        <option value="1">1x</option>
        <option value="2">2x</option>
      </select>
    </div>
  );
}
```

### Programmatic Control

Control playback programmatically:

```tsx
function AutoPlayExample() {
  const { play, stop, seek } = usePlayback();

  useEffect(() => {
    // Auto-play from start
    seek(0);
    play();

    return () => stop();
  }, []);

  return <div>Playing automatically...</div>;
}
```

### Preview at Specific Time

Seek to specific times for preview:

```tsx
function ClipPreview({ clip }) {
  const { seek, pause } = usePlayback();

  const previewClip = () => {
    pause();
    seek(clip.startTime);
  };

  return (
    <button onClick={previewClip}>
      Preview Clip
    </button>
  );
}
```

## Troubleshooting

### Playback Not Starting

1. Check duration is set: `duration > 0`
2. Verify currentTime is valid: `currentTime < duration`
3. Ensure no errors in console

### Stuttering/Choppy Playback

1. Optimize render callback
2. Reduce canvas size for preview
3. Lower playback quality during scrubbing
4. Profile render performance

### Keyboard Shortcuts Not Working

1. Check focus is not in input field
2. Verify no other shortcuts conflicting
3. Check browser console for errors

### Scrubber Not Updating

1. Ensure `onRender` callback is provided
2. Check timeline store is properly configured
3. Verify duration is set correctly

## Example: Complete Integration

```tsx
'use client';

import React, { useRef, useCallback } from 'react';
import { PlaybackControls } from '@/app/components/playback';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { useCanvasStore } from '@/app/lib/store/canvasStore';

export function VideoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tracks } = useTimelineStore();
  const { elements } = useCanvasStore();

  const handleRender = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render clips at current time
    tracks.forEach(track => {
      track.clips.forEach(clip => {
        if (
          currentTime >= clip.startTime &&
          currentTime <= clip.startTime + clip.duration
        ) {
          // Render this clip
          renderClipToCanvas(ctx, clip, currentTime);
        }
      });
    });
  }, [tracks]);

  return (
    <div className="flex flex-col h-screen">
      {/* Preview */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="max-w-full max-h-full"
        />
      </div>

      {/* Playback Controls */}
      <div className="p-4">
        <PlaybackControls onRender={handleRender} />
      </div>
    </div>
  );
}

function renderClipToCanvas(
  ctx: CanvasRenderingContext2D,
  clip: any,
  currentTime: number
) {
  // Implementation depends on clip type
  // This is where you render the actual clip content
}
```

## License

Part of the Video Editor project.
