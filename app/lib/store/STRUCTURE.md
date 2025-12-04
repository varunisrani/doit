# Video Editor Store Structure

## File Organization

```
app/lib/store/
├── editorStore.ts              # Main editor state (project settings, assets, tools)
├── timelineStore.ts            # Timeline state (tracks, clips, playback)
├── selectionStore.ts           # Selection state (canvas & timeline selection)
├── historyStore.ts             # Undo/redo history management
├── useHistoryIntegration.ts    # Hook to integrate history with other stores
├── index.ts                    # Exports all stores and types
├── examples.tsx                # Example components demonstrating usage
├── README.md                   # Full documentation
└── STRUCTURE.md                # This file
```

## Store Dependencies

```
┌─────────────────┐
│  editorStore    │  (Independent)
│  - Project      │
│  - Assets       │
│  - Tools        │
└─────────────────┘

┌─────────────────┐
│ timelineStore   │  (Independent)
│  - Tracks       │
│  - Clips        │
│  - Playback     │
└─────────────────┘

┌─────────────────┐
│ selectionStore  │  (Independent)
│  - Elements     │
│  - Clips        │
│  - Selection    │
└─────────────────┘

┌─────────────────┐
│  historyStore   │  (Integrates with all above)
│  - Undo/Redo    │
│  - State Stack  │
└─────────────────┘
        ↓
┌──────────────────────┐
│ useHistoryIntegration│  (Hook combining all stores)
└──────────────────────┘
```

## Data Flow

### 1. User Action → State Update → History Recording

```typescript
User clicks "Add Track"
    ↓
timelineStore.addTrack()
    ↓
State updated
    ↓
recordState("Add track")
    ↓
History entry created
```

### 2. Undo Operation

```typescript
User presses Ctrl+Z
    ↓
historyStore.undo()
    ↓
Previous state retrieved
    ↓
All stores restored to previous state
```

## Store Sizes (Approximate)

| Store | Lines of Code | Main Responsibilities |
|-------|---------------|----------------------|
| editorStore | ~180 | Project config, assets, canvas transform |
| timelineStore | ~450 | Tracks, clips, timeline operations |
| selectionStore | ~210 | Selection management, multi-select |
| historyStore | ~240 | Undo/redo, state serialization |
| useHistoryIntegration | ~170 | Keyboard shortcuts, store integration |
| **Total** | **~1,250** | Complete state management |

## Key Features

### editorStore
- ✓ Project settings (resolution, FPS, duration)
- ✓ Asset management (video, audio, image)
- ✓ Canvas tools (select, text, shape, etc.)
- ✓ Canvas transform (zoom, pan)
- ✓ Project metadata

### timelineStore
- ✓ Multiple track types (video, audio, text)
- ✓ Clip management with full CRUD
- ✓ Playback controls (play, pause, stop, loop)
- ✓ Timeline view (zoom, scroll, snap-to-grid)
- ✓ Clip operations (split, trim, move, duplicate)
- ✓ Track operations (mute, lock, solo, visibility)

### selectionStore
- ✓ Canvas element selection
- ✓ Timeline clip selection
- ✓ Multi-select mode (Ctrl/Cmd)
- ✓ Selection box for drag-to-select
- ✓ Transform handles
- ✓ Hover state tracking

### historyStore
- ✓ Undo/redo with 50-state limit
- ✓ Batch operations
- ✓ State serialization/deserialization
- ✓ Recording pause/resume
- ✓ Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- ✓ History descriptions

## Integration Points

### With React Components
```typescript
import { useEditorStore, useTimelineStore } from '@/app/lib/store';

function MyComponent() {
  const { project } = useEditorStore();
  const { tracks } = useTimelineStore();
  // ...
}
```

### With History
```typescript
import { useHistoryIntegration } from '@/app/lib/store/useHistoryIntegration';

function App() {
  const { recordState, undo, redo } = useHistoryIntegration();
  // Automatically sets up Ctrl+Z / Ctrl+Y
}
```

### With Local Storage
```typescript
// Save
const saveProject = () => {
  const state = {
    editor: useEditorStore.getState(),
    timeline: useTimelineStore.getState(),
  };
  localStorage.setItem('project', JSON.stringify(state));
};

// Load
const loadProject = () => {
  const saved = localStorage.getItem('project');
  if (saved) {
    const state = JSON.parse(saved);
    useEditorStore.setState(state.editor);
    useTimelineStore.setState(state.timeline);
  }
};
```

## Performance Characteristics

### Memory Usage
- **Per State Entry**: ~5-50KB (depending on project complexity)
- **50 History States**: ~250KB - 2.5MB
- **With Assets**: Assets stored as URLs/references, not duplicated in history

### Re-render Optimization
```typescript
// ❌ Bad - Re-renders on any editor state change
const editor = useEditorStore();

// ✓ Good - Only re-renders when currentTool changes
const currentTool = useEditorStore(state => state.currentTool);

// ✓ Good - Only re-renders when specific values change
const { width, height } = useEditorStore(state => ({
  width: state.project.width,
  height: state.project.height,
}));
```

## Future Enhancements

Potential additions to consider:
- **effectsStore**: Manage video effects, filters, transitions
- **exportStore**: Export settings, render queue, progress
- **collaborationStore**: Real-time collaboration state
- **pluginStore**: Plugin system for extensibility
- **preferencesStore**: User preferences, keyboard shortcuts
- **cacheStore**: Thumbnail cache, preview cache

## Testing Recommendations

### Unit Tests
```typescript
import { useEditorStore } from './editorStore';

describe('editorStore', () => {
  it('should add asset', () => {
    const { addAsset, assets } = useEditorStore.getState();
    addAsset({ id: '1', name: 'test.mp4', ... });
    expect(assets).toHaveLength(1);
  });
});
```

### Integration Tests
```typescript
describe('History Integration', () => {
  it('should undo track addition', () => {
    const timeline = useTimelineStore.getState();
    const history = useHistoryStore.getState();

    timeline.addTrack({ name: 'Track 1', type: 'video' });
    history.undo();

    expect(timeline.tracks).toHaveLength(0);
  });
});
```
