# Video Editor Store Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Video Editor Application                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      State Management Layer (Zustand)    │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────┐                         ┌──────────────────┐
│ Editor Store  │                         │ Timeline Store   │
├───────────────┤                         ├──────────────────┤
│ • Project     │                         │ • Tracks         │
│ • Assets      │                         │ • Clips          │
│ • Tools       │                         │ • Playback       │
│ • Canvas      │                         │ • View           │
└───────────────┘                         └──────────────────┘
        │                                           │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │ Selection Store  │
                ├──────────────────┤
                │ • Elements       │
                │ • Clips          │
                │ • Multi-select   │
                └──────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  History Store   │
                ├──────────────────┤
                │ • Undo Stack     │
                │ • Redo Stack     │
                │ • Serialization  │
                └──────────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │ useHistoryIntegration   │
              │ • Keyboard Shortcuts    │
              │ • Store Coordination    │
              └─────────────────────────┘
```

## Data Flow Diagram

### User Action Flow

```
User Action (Click, Drag, Type, etc.)
        │
        ▼
React Event Handler
        │
        ▼
Store Action Call
        │
        ├──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼
  editorStore  timelineStore  selectionStore  historyStore
        │          │          │          │
        └──────────┴──────────┴──────────┘
                    │
                    ▼
        Zustand State Update (via Immer)
                    │
                    ▼
        React Components Re-render
                    │
                    ▼
            UI Updates
```

### History Recording Flow

```
User performs action
        │
        ▼
Store state changes
        │
        ▼
recordState("description") called
        │
        ▼
createSnapshot() captures all stores
        │
        ▼
State serialized (Sets/Maps → JSON-safe)
        │
        ▼
Pushed to history.past[]
        │
        ▼
history.future[] cleared
        │
        ▼
History limited to maxHistorySize (50)
```

### Undo/Redo Flow

```
User presses Ctrl+Z
        │
        ▼
historyStore.undo()
        │
        ▼
Pop from past[], push to future[]
        │
        ▼
Deserialize state snapshot
        │
        ▼
restoreSnapshot() to all stores
        │
        ▼
All stores updated simultaneously
        │
        ▼
UI re-renders with previous state
```

## Store Dependencies

```
┌─────────────────┐
│  editorStore    │  ← No dependencies
└─────────────────┘

┌─────────────────┐
│ timelineStore   │  ← No dependencies
└─────────────────┘

┌─────────────────┐
│ selectionStore  │  ← No dependencies
└─────────────────┘

┌─────────────────┐
│  historyStore   │  ← Depends on all above for snapshots
└─────────────────┘
        ↑
        │
┌─────────────────────────┐
│ useHistoryIntegration   │  ← Orchestrates all stores
└─────────────────────────┘
```

## Component Integration Pattern

```
┌────────────────────────────────────────┐
│         App Component                  │
│  useHistoryIntegration() ← Sets up KB  │
│  useMultiSelectKey() ← Ctrl/Cmd key    │
└────────────────────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│ Canvas  │ │ Timeline │ │ Controls │
│Component│ │Component │ │Component │
└─────────┘ └──────────┘ └──────────┘
    │           │           │
    ▼           ▼           ▼
useEditorStore useTimelineStore useSelectionStore
```

## State Shape

### editorStore State

```typescript
{
  project: {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 60,
    backgroundColor: '#000000'
  },
  metadata: {
    id: 'uuid',
    name: 'Project Name',
    createdAt: timestamp,
    updatedAt: timestamp,
    author?: 'Author Name'
  },
  currentTool: 'select' | 'text' | 'shape' | 'crop' | 'draw' | 'hand',
  canvasTransform: {
    zoom: 1.0,
    panX: 0,
    panY: 0
  },
  assets: [
    {
      id: 'uuid',
      name: 'video.mp4',
      type: 'video',
      url: 'blob:...',
      duration: 120,
      width: 1920,
      height: 1080,
      size: 1048576,
      createdAt: timestamp
    }
  ]
}
```

### timelineStore State

```typescript
{
  tracks: [
    {
      id: 'uuid',
      name: 'Video Track 1',
      type: 'video',
      order: 0,
      clips: [
        {
          id: 'uuid',
          trackId: 'track-uuid',
          assetId: 'asset-uuid',
          type: 'video',
          name: 'Clip 1',
          startTime: 0,
          duration: 5,
          trimStart: 0,
          trimEnd: 0,
          volume: 1,
          opacity: 1,
          locked: false,
          muted: false
        }
      ],
      locked: false,
      muted: false,
      visible: true
    }
  ],
  currentTime: 0,
  duration: 60,
  zoom: 100, // pixels per second
  scrollLeft: 0,
  isPlaying: false,
  loop: false,
  snapToGrid: true,
  gridSize: 0.1
}
```

### selectionStore State

```typescript
{
  selectedElementIds: Set(['element-1', 'element-2']),
  selectedClipIds: Set(['clip-1']),
  selectionBox: {
    x: 100,
    y: 100,
    width: 200,
    height: 150
  } | null,
  isSelecting: false,
  multiSelectMode: false,
  activeTransformHandle: 'se' | null,
  hoveredElementId: 'element-1' | null,
  hoveredClipId: 'clip-1' | null
}
```

### historyStore State

```typescript
{
  past: [
    {
      id: 'uuid',
      timestamp: 1234567890,
      description: 'Add video clip',
      state: {
        editor: { ... },
        timeline: { ... },
        selection: { ... }
      }
    }
  ],
  future: [],
  maxHistorySize: 50,
  isRecording: true,
  isBatching: false
}
```

## Action Flow Examples

### Example 1: Add Clip to Timeline

```
1. User drags asset to timeline
   │
2. onDrop event handler
   │
3. timelineStore.addClip(trackId, clipData)
   │
4. Zustand updates state via immer
   │
5. recordState('Add clip')
   │
6. historyStore captures snapshot
   │
7. Timeline component re-renders
   │
8. New clip appears in UI
```

### Example 2: Multi-Select Clips

```
1. User holds Ctrl key
   │
2. keydown event → setMultiSelectMode(true)
   │
3. User clicks clip 1
   │
4. selectClip('clip-1') → adds to Set
   │
5. User clicks clip 2 (Ctrl still held)
   │
6. selectClip('clip-2') → adds to Set
   │
7. selectedClipIds: Set(['clip-1', 'clip-2'])
   │
8. Both clips render with selection highlight
```

### Example 3: Undo Add Clip

```
1. User presses Ctrl+Z
   │
2. Keyboard event → undo()
   │
3. historyStore.undo()
   │
4. Pop last state from past[]
   │
5. Push to future[]
   │
6. Deserialize state snapshot
   │
7. Restore to all stores
   │
8. Timeline reverts to previous state
   │
9. Added clip disappears from UI
```

## Performance Optimization Strategies

### 1. Selective Subscriptions

```typescript
// ❌ Re-renders on ANY change
const store = useEditorStore();

// ✓ Only re-renders when currentTool changes
const currentTool = useEditorStore(state => state.currentTool);

// ✓ Only re-renders when width or height changes
const { width, height } = useEditorStore(
  state => ({ width: state.project.width, height: state.project.height }),
  shallow // Use shallow equality
);
```

### 2. Computed Values

```typescript
// Store getter for computed values
const getTrackById = (trackId: string) => {
  return get().tracks.find(t => t.id === trackId);
};

const getClipsByTrack = (trackId: string) => {
  return get().tracks.find(t => t.id === trackId)?.clips || [];
};
```

### 3. Batch Updates

```typescript
// Multiple operations as one undo
startBatch();
clips.forEach(clip => updateClip(clip.id, { volume: 0.5 }));
endBatch('Set all volumes to 50%');
```

## Memory Management

### History Size Limits

```
Max history states: 50
Average state size: 5-50KB
Max memory usage: ~2.5MB for history
```

### Asset References

```
Assets stored as:
- URL: blob:// or https:// (reference only)
- Not duplicated in history
- Cleaned up on project close
```

## Extension Points

### Adding New Stores

```typescript
// Create new store following the pattern
export const useEffectsStore = create<EffectsState>()(
  immer((set) => ({
    // State
    effects: [],

    // Actions
    addEffect: (effect) => set((state) => {
      state.effects.push(effect);
    }),
  }))
);

// Add to history integration
const stores = {
  editor: editorStore,
  timeline: timelineStore,
  selection: selectionStore,
  effects: useEffectsStore, // Add here
};
```

### Adding Custom Actions

```typescript
// In any store
export const useTimelineStore = create<TimelineState>()(
  immer((set, get) => ({
    // ... existing state

    // Add custom action
    customAction: (param) => set((state) => {
      // Your logic here
      state.customField = computeValue(param);
    }),
  }))
);
```

## Best Practices Summary

1. Always use immer middleware for clean updates
2. Record state after significant actions only
3. Use batch operations for multiple related changes
4. Pause recording during playback/scrubbing
5. Use selective subscriptions for performance
6. Clear selections when appropriate
7. Validate state before updates
8. Use TypeScript for type safety
9. Document complex actions
10. Test state transitions

## Troubleshooting Guide

### Issue: Components not re-rendering

**Solution**: Check if you're using selective subscription correctly
```typescript
// This won't subscribe to changes
const value = useStore.getState().value;

// This will subscribe
const value = useStore(state => state.value);
```

### Issue: Undo not working

**Solution**: Ensure you call `recordState()` after changes
```typescript
addTrack({ name: 'Track', type: 'video' });
recordState('Add track'); // Don't forget!
```

### Issue: Memory growing over time

**Solution**: Check history size and clear when needed
```typescript
// Clear history when starting new project
clearHistory();

// Or adjust max size
setMaxHistorySize(30);
```

## Testing Strategy

### Unit Tests

```typescript
describe('timelineStore', () => {
  beforeEach(() => {
    useTimelineStore.setState({ tracks: [] }); // Reset
  });

  it('should add track', () => {
    const { addTrack, tracks } = useTimelineStore.getState();
    addTrack({ name: 'Track 1', type: 'video' });
    expect(tracks).toHaveLength(1);
  });
});
```

### Integration Tests

```typescript
describe('History Integration', () => {
  it('should undo/redo track addition', () => {
    const { addTrack } = useTimelineStore.getState();
    const { undo, redo } = useHistoryStore.getState();

    addTrack({ name: 'Track', type: 'video' });
    expect(useTimelineStore.getState().tracks).toHaveLength(1);

    undo();
    expect(useTimelineStore.getState().tracks).toHaveLength(0);

    redo();
    expect(useTimelineStore.getState().tracks).toHaveLength(1);
  });
});
```

---

This architecture provides a scalable, maintainable foundation for a professional video editor application.
