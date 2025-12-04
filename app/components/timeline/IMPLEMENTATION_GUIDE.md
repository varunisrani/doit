# Timeline System - Implementation Guide

## Quick Start

### 1. Basic Usage

```tsx
import { Timeline } from '@/app/components/timeline';

function VideoEditor() {
  return (
    <div className="h-screen flex flex-col">
      {/* Your header */}
      <header className="h-16 bg-gray-800">
        {/* ... */}
      </header>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas/Preview area */}
        <div className="flex-1 bg-black">
          {/* Canvas component here */}
        </div>

        {/* Timeline - Fixed height */}
        <div className="h-80 border-t border-gray-700">
          <Timeline />
        </div>
      </div>
    </div>
  );
}
```

### 2. Initialize with Sample Data

```tsx
'use client';

import { useEffect } from 'react';
import { Timeline } from '@/app/components/timeline';
import { useTimelineStore } from '@/app/lib/store/timelineStore';

function VideoEditor() {
  const { addTrack, addClip } = useTimelineStore();

  useEffect(() => {
    // Add tracks
    const videoTrackId = crypto.randomUUID();
    const audioTrackId = crypto.randomUUID();

    addTrack({
      name: 'Video Track 1',
      type: 'video',
    });

    addTrack({
      name: 'Audio Track 1',
      type: 'audio',
    });

    // Add sample clips
    const tracks = useTimelineStore.getState().tracks;
    const videoTrack = tracks.find(t => t.type === 'video');
    const audioTrack = tracks.find(t => t.type === 'audio');

    if (videoTrack) {
      addClip(videoTrack.id, {
        name: 'Video Clip 1',
        type: 'video',
        startTime: 0,
        duration: 5,
      });

      addClip(videoTrack.id, {
        name: 'Video Clip 2',
        type: 'video',
        startTime: 6,
        duration: 4,
      });
    }

    if (audioTrack) {
      addClip(audioTrack.id, {
        name: 'Audio Clip 1',
        type: 'audio',
        startTime: 0,
        duration: 10,
      });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-80">
        <Timeline />
      </div>
    </div>
  );
}
```

### 3. Integration with Asset Drop

```tsx
import { Timeline } from '@/app/components/timeline';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { useEditorStore } from '@/app/lib/store/editorStore';

function VideoEditor() {
  const { addClip } = useTimelineStore();
  const { assets } = useEditorStore();

  const handleAssetDrop = (assetId: string, trackId: string, time: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    addClip(trackId, {
      name: asset.name,
      type: asset.type as 'video' | 'audio' | 'image' | 'text',
      assetId: asset.id,
      startTime: time,
      duration: asset.duration || 3, // Default 3 seconds for images
    });
  };

  return (
    <div className="flex">
      {/* Asset Panel */}
      <aside className="w-64 bg-gray-800">
        <h3>Assets</h3>
        {assets.map(asset => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('assetId', asset.id);
            }}
          >
            {asset.name}
          </div>
        ))}
      </aside>

      {/* Timeline */}
      <main className="flex-1">
        <Timeline />
      </main>
    </div>
  );
}
```

### 4. Custom Keyboard Shortcuts

```tsx
import { useEffect } from 'react';
import { Timeline } from '@/app/components/timeline';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';

function VideoEditor() {
  const { duplicateClip, splitClip, currentTime } = useTimelineStore();
  const { selectedClipIds } = useSelectionStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Duplicate clip: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        selectedClipIds.forEach(clipId => duplicateClip(clipId));
      }

      // Split at playhead: S key
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        selectedClipIds.forEach(clipId => {
          splitClip(clipId, currentTime);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipIds, currentTime, duplicateClip, splitClip]);

  return <Timeline />;
}
```

### 5. Syncing Timeline with Canvas

```tsx
import { useEffect } from 'react';
import { Timeline } from '@/app/components/timeline';
import { Canvas } from '@/app/components/canvas';
import { useTimelineStore } from '@/app/lib/store/timelineStore';

function VideoEditor() {
  const { currentTime, tracks } = useTimelineStore();

  // Get visible clips at current time
  const visibleClips = tracks.flatMap(track =>
    track.clips.filter(clip =>
      currentTime >= clip.startTime &&
      currentTime <= clip.startTime + clip.duration
    )
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Canvas - renders clips at current time */}
      <div className="flex-1">
        <Canvas clips={visibleClips} currentTime={currentTime} />
      </div>

      {/* Timeline */}
      <div className="h-80">
        <Timeline />
      </div>
    </div>
  );
}
```

### 6. Custom Track Controls

```tsx
import { Timeline } from '@/app/components/timeline';
import { useTimelineStore } from '@/app/lib/store/timelineStore';

function VideoEditor() {
  const { tracks, removeTrack, duplicateTrack } = useTimelineStore();

  const handleDeleteTrack = (trackId: string) => {
    if (confirm('Delete this track and all its clips?')) {
      removeTrack(trackId);
    }
  };

  const handleDuplicateTrack = (trackId: string) => {
    duplicateTrack(trackId);
  };

  return (
    <div>
      {/* Track Manager */}
      <div className="p-4 bg-gray-800">
        <h3 className="text-white mb-2">Tracks</h3>
        {tracks.map(track => (
          <div key={track.id} className="flex items-center gap-2 p-2">
            <span className="text-white">{track.name}</span>
            <button onClick={() => handleDuplicateTrack(track.id)}>
              Duplicate
            </button>
            <button onClick={() => handleDeleteTrack(track.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <Timeline />
    </div>
  );
}
```

## Advanced Usage

### 1. Custom Snapping Behavior

```tsx
import { useTimeline } from '@/app/hooks/useTimeline';

function CustomTimeline() {
  const { snapTime, pixelToTime, timeToPixel } = useTimeline();

  const handleCustomDrag = (e: MouseEvent) => {
    const time = pixelToTime(e.clientX);
    const snappedTime = snapTime(time, ['excluded-clip-id']);

    // Use snappedTime for your custom logic
  };

  return <Timeline />;
}
```

### 2. Timeline Markers

```tsx
import { useTimelineStore } from '@/app/lib/store/timelineStore';

function TimelineWithMarkers() {
  const { currentTime, setCurrentTime } = useTimelineStore();

  const markers = [
    { time: 5, label: 'Intro End', color: '#ef4444' },
    { time: 15, label: 'Main Content', color: '#3b82f6' },
    { time: 25, label: 'Outro Start', color: '#10b981' },
  ];

  return (
    <div className="relative">
      <Timeline />

      {/* Render markers */}
      <div className="absolute top-8 left-48 right-0 pointer-events-none">
        {markers.map((marker, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${marker.time * 100}px`, // Assuming 100px/s zoom
              backgroundColor: marker.color,
            }}
          >
            <div
              className="absolute top-0 left-1 text-xs whitespace-nowrap"
              style={{ color: marker.color }}
            >
              {marker.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Waveform Integration

```tsx
import { useEffect, useRef } from 'react';
import { TimelineClip } from '@/app/components/timeline';

// This would be in a custom TimelineClip component
function AudioClipWithWaveform({ clip, zoom }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || clip.type !== 'audio') return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Draw waveform
    // This is a placeholder - you'd fetch actual audio data
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw peaks (sample data)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < canvasRef.current.width; i += 2) {
      const peak = Math.random() * canvasRef.current.height;
      ctx.lineTo(i, peak);
    }
    ctx.stroke();
  }, [clip, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      width={clip.duration * zoom}
      height={60}
    />
  );
}
```

### 4. Undo/Redo Integration

```tsx
import { Timeline } from '@/app/components/timeline';
import { useHistoryStore } from '@/app/lib/store/historyStore';

function VideoEditorWithHistory() {
  const { undo, redo, canUndo, canRedo } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div>
      <div className="flex gap-2 p-2">
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <Timeline />
    </div>
  );
}
```

## Common Patterns

### Pattern 1: Timeline-Canvas Sync

```tsx
function SyncedEditor() {
  const { currentTime, tracks } = useTimelineStore();

  const activeClips = useMemo(() => {
    return tracks.flatMap(track =>
      track.clips.filter(clip =>
        currentTime >= clip.startTime &&
        currentTime < clip.startTime + clip.duration
      )
    );
  }, [currentTime, tracks]);

  return (
    <>
      <Canvas clips={activeClips} time={currentTime} />
      <Timeline />
    </>
  );
}
```

### Pattern 2: Asset Library Integration

```tsx
function AssetDragDrop() {
  const { addClip, tracks } = useTimelineStore();

  const handleDrop = (e: DragEvent, trackId: string) => {
    const assetId = e.dataTransfer?.getData('assetId');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = pixelToTime(x);

    addClip(trackId, {
      assetId,
      name: 'New Clip',
      type: 'video',
      startTime: time,
      duration: 5,
    });
  };

  return <Timeline />;
}
```

### Pattern 3: Real-time Preview

```tsx
function LivePreview() {
  const { currentTime, isPlaying } = useTimelineStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentTime, isPlaying]);

  return (
    <>
      <video ref={videoRef} />
      <Timeline />
    </>
  );
}
```

## Troubleshooting

### Issue: Timeline not scrolling horizontally

**Solution:** Ensure the timeline container has proper overflow settings:

```tsx
<div className="overflow-x-auto">
  <Timeline />
</div>
```

### Issue: Clips not snapping

**Solution:** Check snap settings in the store:

```tsx
const { snapToGrid, setSnapToGrid } = useTimelineStore();

// Enable snapping
setSnapToGrid(true);
```

### Issue: Playhead not visible

**Solution:** Ensure tracks are added before playhead renders:

```tsx
const { tracks } = useTimelineStore();

// Playhead only renders when tracks.length > 0
```

### Issue: Performance issues with many clips

**Solution:** Use virtualization for large timelines:

```tsx
// Render only visible clips based on scroll position
const visibleClips = useMemo(() => {
  const scrollLeft = /* get scroll position */;
  const visibleWidth = /* get viewport width */;
  const startTime = pixelToTime(scrollLeft);
  const endTime = pixelToTime(scrollLeft + visibleWidth);

  return clips.filter(clip =>
    clip.startTime < endTime &&
    clip.startTime + clip.duration > startTime
  );
}, [scrollLeft, clips]);
```

## Best Practices

1. **Always initialize tracks before adding clips**
2. **Use the `useTimeline` hook for operations** instead of directly calling store actions
3. **Clean up event listeners** in useEffect cleanup functions
4. **Use `useMemo` and `useCallback`** for expensive computations
5. **Keep track heights consistent** for better UX
6. **Provide visual feedback** during drag operations
7. **Test with various zoom levels** to ensure UI remains usable
8. **Handle edge cases** like overlapping clips, negative times, etc.

## Next Steps

1. Implement video thumbnails in clips
2. Add real audio waveform rendering
3. Create timeline minimap for navigation
4. Add clip effects visualization
5. Implement transitions between clips
6. Add markers and regions
7. Create keyframe editor
8. Implement ripple editing mode
