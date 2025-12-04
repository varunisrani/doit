# Quick Start Guide

Get started with the video editor stores in 5 minutes!

## 1. Installation

The stores are already set up! Dependencies installed:
- ✓ zustand (v4.5.7)
- ✓ immer (latest)

## 2. Basic Usage

### Step 1: Import the stores

```typescript
import {
  useEditorStore,
  useTimelineStore,
  useSelectionStore,
} from '@/app/lib/store';
import { useHistoryIntegration } from '@/app/lib/store/useHistoryIntegration';
```

### Step 2: Use in your component

```typescript
'use client';

function VideoEditor() {
  // Get state and actions from stores
  const { project, currentTool, setCurrentTool } = useEditorStore();
  const { tracks, addTrack, isPlaying, play, pause } = useTimelineStore();
  const { selectedClipIds, selectClip } = useSelectionStore();
  const { undo, redo, canUndo, canRedo } = useHistoryIntegration();

  return (
    <div>
      <h1>Video Editor</h1>
      <p>Resolution: {project.width}x{project.height}</p>
      <p>Tracks: {tracks.length}</p>
      <p>Selected: {selectedClipIds.size} clips</p>

      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

## 3. Common Operations

### Add a Video Track

```typescript
const { addTrack } = useTimelineStore();
const { recordState } = useHistoryIntegration();

function handleAddTrack() {
  addTrack({
    name: 'Video Track 1',
    type: 'video',
  });
  recordState('Add video track');
}
```

### Import and Add Asset

```typescript
const { addAsset } = useEditorStore();
const { recordState } = useHistoryIntegration();

function handleFileUpload(file: File) {
  const asset = {
    id: crypto.randomUUID(),
    name: file.name,
    type: 'video' as const,
    url: URL.createObjectURL(file),
    size: file.size,
    createdAt: Date.now(),
  };

  addAsset(asset);
  recordState('Import asset');
}
```

### Add Clip to Timeline

```typescript
const { addClip } = useTimelineStore();
const { recordState } = useHistoryIntegration();

function handleAddClip(trackId: string, assetId: string) {
  addClip(trackId, {
    assetId,
    type: 'video',
    name: 'Video Clip',
    startTime: 0,
    duration: 5,
  });
  recordState('Add clip');
}
```

### Select and Modify Clips

```typescript
const { selectClip, getSelectedClips } = useSelectionStore();
const { updateClip } = useTimelineStore();
const { recordState } = useHistoryIntegration();

function handleSetVolumeForSelected(volume: number) {
  const selectedIds = getSelectedClips();

  selectedIds.forEach(id => {
    updateClip(id, { volume });
  });

  recordState(`Set volume to ${volume * 100}%`);
}
```

## 4. Keyboard Shortcuts

The history integration automatically sets up:
- **Ctrl+Z / Cmd+Z**: Undo
- **Ctrl+Y / Cmd+Shift+Z**: Redo

For multi-select, implement:

```typescript
'use client';

import { useEffect } from 'react';
import { useSelectionStore } from '@/app/lib/store';

export function useMultiSelectKey() {
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
  }, [setMultiSelectMode]);
}
```

Then use in your app:

```typescript
function App() {
  useMultiSelectKey();
  return <YourApp />;
}
```

## 5. Save/Load Projects

```typescript
import {
  useEditorStore,
  useTimelineStore,
  useSelectionStore,
} from '@/app/lib/store';

// Save project to localStorage
export function saveProject(name: string = 'default') {
  const project = {
    editor: useEditorStore.getState(),
    timeline: useTimelineStore.getState(),
    selection: useSelectionStore.getState(),
  };

  localStorage.setItem(`project:${name}`, JSON.stringify(project));
}

// Load project from localStorage
export function loadProject(name: string = 'default') {
  const saved = localStorage.getItem(`project:${name}`);
  if (!saved) return false;

  try {
    const project = JSON.parse(saved);

    useEditorStore.setState(project.editor);
    useTimelineStore.setState(project.timeline);
    useSelectionStore.setState(project.selection);

    return true;
  } catch (error) {
    console.error('Failed to load project:', error);
    return false;
  }
}

// In your component
function SaveButton() {
  return (
    <button onClick={() => saveProject('my-project')}>
      Save Project
    </button>
  );
}

function LoadButton() {
  return (
    <button onClick={() => loadProject('my-project')}>
      Load Project
    </button>
  );
}
```

## 6. Performance Tips

### Only subscribe to what you need

```typescript
// ❌ Bad - Re-renders on ANY editor change
function MyComponent() {
  const editor = useEditorStore();
  return <div>{editor.currentTool}</div>;
}

// ✓ Good - Only re-renders when currentTool changes
function MyComponent() {
  const currentTool = useEditorStore(state => state.currentTool);
  return <div>{currentTool}</div>;
}
```

### Use getState() for one-time reads

```typescript
// If you don't need to subscribe to changes
function handleClick() {
  const currentTool = useEditorStore.getState().currentTool;
  console.log('Current tool:', currentTool);
}
```

### Batch multiple operations

```typescript
const { startBatch, endBatch } = useHistoryIntegration();
const { addClip } = useTimelineStore();

function addMultipleClips(trackId: string, clips: any[]) {
  startBatch();

  clips.forEach(clip => {
    addClip(trackId, clip);
  });

  endBatch(`Add ${clips.length} clips`);
}
```

## 7. Example App Component

```typescript
'use client';

import { useEffect } from 'react';
import {
  useEditorStore,
  useTimelineStore,
  useSelectionStore,
} from '@/app/lib/store';
import { useHistoryIntegration } from '@/app/lib/store/useHistoryIntegration';

export default function VideoEditorApp() {
  const { project, setCurrentTool } = useEditorStore();
  const { tracks, addTrack, isPlaying, play, pause } = useTimelineStore();
  const { setMultiSelectMode } = useSelectionStore();
  const { undo, redo, canUndo, canRedo } = useHistoryIntegration();

  // Setup multi-select
  useEffect(() => {
    const down = (e: KeyboardEvent) =>
      (e.key === 'Control' || e.key === 'Meta') && setMultiSelectMode(true);
    const up = (e: KeyboardEvent) =>
      (e.key === 'Control' || e.key === 'Meta') && setMultiSelectMode(false);

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [setMultiSelectMode]);

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Video Editor</h1>
        <p className="text-sm text-gray-600">
          {project.width}x{project.height} @ {project.fps}fps
        </p>
      </header>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setCurrentTool('select')}>Select</button>
        <button onClick={() => setCurrentTool('text')}>Text</button>
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>

      <div>
        <p>Tracks: {tracks.length}</p>
        <button onClick={() => addTrack({ name: 'New Track', type: 'video' })}>
          Add Track
        </button>
      </div>
    </div>
  );
}
```

## 8. Next Steps

1. Check out `examples.tsx` for more complete component examples
2. Read `README.md` for detailed API documentation
3. See `STRUCTURE.md` to understand the architecture
4. Start building your video editor!

## Common Patterns

### Track with Clips Display

```typescript
function TrackList() {
  const { tracks } = useTimelineStore();

  return (
    <div>
      {tracks.map(track => (
        <div key={track.id}>
          <h3>{track.name}</h3>
          <div>
            {track.clips.map(clip => (
              <div key={clip.id}>
                {clip.name} ({clip.duration}s)
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Asset Library with Drag to Timeline

```typescript
function AssetItem({ asset }: { asset: Asset }) {
  const { addClip } = useTimelineStore();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('assetId', asset.id);
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      {asset.name}
    </div>
  );
}

function TrackDropZone({ trackId }: { trackId: string }) {
  const { addClip } = useTimelineStore();

  const handleDrop = (e: React.DragEvent) => {
    const assetId = e.dataTransfer.getData('assetId');

    addClip(trackId, {
      assetId,
      type: 'video',
      name: 'New Clip',
      startTime: 0,
      duration: 5,
    });
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      Drop here
    </div>
  );
}
```

## Troubleshooting

### "Cannot read property of undefined"
Make sure you're using the stores in a client component:
```typescript
'use client'; // Add this at the top

function MyComponent() {
  const store = useEditorStore();
  // ...
}
```

### History not working
Make sure to call `recordState()` after state changes:
```typescript
const { addTrack } = useTimelineStore();
const { recordState } = useHistoryIntegration();

function handleAdd() {
  addTrack({ name: 'Track', type: 'video' });
  recordState('Add track'); // Don't forget this!
}
```

### Too many re-renders
Use selective subscriptions:
```typescript
// Instead of
const store = useEditorStore();

// Use
const currentTool = useEditorStore(state => state.currentTool);
```

## Support

For more help:
- See `README.md` for full documentation
- Check `examples.tsx` for working examples
- Review `STRUCTURE.md` for architecture details
