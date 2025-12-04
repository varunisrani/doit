# Video Editor State Management

This directory contains all Zustand stores for the video editor application.

## Stores Overview

### 1. Editor Store (`editorStore.ts`)

Manages the main editor state including project settings, canvas transformations, and assets.

**State:**
- Project settings (dimensions, FPS, duration, background color)
- Project metadata (name, timestamps, author)
- Current tool selection
- Canvas transform (zoom, pan)
- Imported assets (videos, images, audio)

**Example Usage:**
```typescript
import { useEditorStore } from '@/app/lib/store';

function Editor() {
  const { project, setZoom, addAsset, currentTool, setCurrentTool } = useEditorStore();

  // Set canvas zoom
  const zoomIn = () => setZoom(project.zoom + 0.1);

  // Add a new asset
  const handleFileUpload = (file: File) => {
    const asset: Asset = {
      id: crypto.randomUUID(),
      name: file.name,
      type: 'video',
      url: URL.createObjectURL(file),
      size: file.size,
      createdAt: Date.now(),
    };
    addAsset(asset);
  };

  return (
    <div>
      <button onClick={() => setCurrentTool('select')}>Select Tool</button>
      <button onClick={() => setCurrentTool('text')}>Text Tool</button>
    </div>
  );
}
```

### 2. Timeline Store (`timelineStore.ts`)

Manages timeline state including tracks, clips, playback controls, and timeline view settings.

**State:**
- Tracks (video, audio, text)
- Clips on each track
- Playhead position
- Timeline zoom and scroll
- Playback state (playing, paused, stopped)
- Loop mode, snap to grid

**Example Usage:**
```typescript
import { useTimelineStore } from '@/app/lib/store';

function Timeline() {
  const {
    tracks,
    currentTime,
    isPlaying,
    addTrack,
    addClip,
    play,
    pause,
    setCurrentTime
  } = useTimelineStore();

  // Add a new video track
  const createVideoTrack = () => {
    addTrack({
      name: 'Video Track 1',
      type: 'video',
    });
  };

  // Add a clip to a track
  const addVideoClip = (trackId: string, assetId: string) => {
    addClip(trackId, {
      assetId,
      type: 'video',
      name: 'Video Clip',
      startTime: currentTime,
      duration: 5,
    });
  };

  return (
    <div>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min={0}
        max={60}
        value={currentTime}
        onChange={(e) => setCurrentTime(Number(e.target.value))}
      />
    </div>
  );
}
```

### 3. Selection Store (`selectionStore.ts`)

Manages selection state for both canvas elements and timeline clips.

**State:**
- Selected element IDs (canvas)
- Selected clip IDs (timeline)
- Selection box coordinates
- Multi-select mode
- Hover state
- Active transform handle

**Example Usage:**
```typescript
import { useSelectionStore } from '@/app/lib/store';

function CanvasElement({ id }: { id: string }) {
  const {
    isElementSelected,
    toggleElementSelection,
    setHoveredElement
  } = useSelectionStore();

  const selected = isElementSelected(id);

  return (
    <div
      onClick={() => toggleElementSelection(id)}
      onMouseEnter={() => setHoveredElement(id)}
      onMouseLeave={() => setHoveredElement(null)}
      style={{
        border: selected ? '2px solid blue' : '1px solid gray',
      }}
    >
      Element {id}
    </div>
  );
}

// Multi-select with Ctrl/Cmd
function Canvas() {
  const { setMultiSelectMode } = useSelectionStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setMultiSelectMode(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setMultiSelectMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return <div>Canvas content</div>;
}
```

### 4. History Store (`historyStore.ts`)

Manages undo/redo functionality with a maximum of 50 states.

**State:**
- Past states (for undo)
- Future states (for redo)
- Batch operation mode
- Recording enabled/disabled

**Example Usage:**
```typescript
import { useHistoryIntegration } from '@/app/lib/store/useHistoryIntegration';

function App() {
  const {
    recordState,
    undo,
    redo,
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
    startBatch,
    endBatch,
  } = useHistoryIntegration();

  // Record a state change
  const addClipWithHistory = () => {
    const trackId = 'track-1';
    timelineStore.addClip(trackId, {
      type: 'video',
      name: 'My Clip',
      startTime: 0,
      duration: 5,
    });
    recordState('Add video clip');
  };

  // Batch multiple operations into one undo
  const addMultipleClips = () => {
    startBatch();

    // Multiple operations
    timelineStore.addClip(trackId, clip1);
    timelineStore.addClip(trackId, clip2);
    timelineStore.addClip(trackId, clip3);

    endBatch('Add multiple clips');
  };

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo {undoDescription}
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo {redoDescription}
      </button>
    </div>
  );
}
```

## History Integration

The `useHistoryIntegration` hook automatically sets up keyboard shortcuts:
- **Ctrl+Z / Cmd+Z**: Undo
- **Ctrl+Y / Cmd+Shift+Z**: Redo

## Best Practices

### 1. Recording State Changes

Always record significant state changes:
```typescript
// Good - Record after important actions
const handleAddClip = () => {
  addClip(trackId, clipData);
  recordState('Add clip');
};

// Bad - Don't record every tiny change
const handleMouseMove = (x, y) => {
  setPan(x, y);
  // Don't record this!
};
```

### 2. Batch Operations

Use batching for multiple related changes:
```typescript
startBatch();
tracks.forEach(track => {
  track.clips.forEach(clip => {
    updateClip(clip.id, { volume: 0.5 });
  });
});
endBatch('Set all volumes to 50%');
```

### 3. Pause Recording

Pause recording during playback or scrubbing:
```typescript
const handleScrub = (time: number) => {
  pauseRecording();
  setCurrentTime(time);
  resumeRecording();
};
```

### 4. Multi-select Pattern

Handle Ctrl/Cmd key for multi-select:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      setMultiSelectMode(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      setMultiSelectMode(false);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);
```

## TypeScript Support

All stores are fully typed. Import types as needed:
```typescript
import type {
  Asset,
  ProjectSettings,
  Track,
  Clip,
  SelectionBox
} from '@/app/lib/store';
```

## State Persistence

To persist state to localStorage:
```typescript
import { useEditorStore, useTimelineStore } from '@/app/lib/store';

// Save to localStorage
const saveProject = () => {
  const state = {
    editor: useEditorStore.getState(),
    timeline: useTimelineStore.getState(),
  };
  localStorage.setItem('project', JSON.stringify(state));
};

// Load from localStorage
const loadProject = () => {
  const saved = localStorage.getItem('project');
  if (saved) {
    const state = JSON.parse(saved);
    useEditorStore.setState(state.editor);
    useTimelineStore.setState(state.timeline);
  }
};
```

## Performance Tips

1. **Use shallow equality checks** when selecting state:
```typescript
// Only re-render when currentTime changes
const currentTime = useTimelineStore(state => state.currentTime);
```

2. **Avoid selecting entire objects** when you only need specific fields:
```typescript
// Good
const { width, height } = useEditorStore(state => ({
  width: state.project.width,
  height: state.project.height,
}));

// Less optimal
const project = useEditorStore(state => state.project);
```

3. **Use getState() for one-time reads**:
```typescript
// Don't need a subscription? Use getState()
const handleClick = () => {
  const currentTool = useEditorStore.getState().currentTool;
  console.log(currentTool);
};
```
