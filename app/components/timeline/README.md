# Timeline System - Phase 3

A complete, interactive timeline system for browser-based video editing.

## Components

### 1. Timeline (Main Container)
**File:** `Timeline.tsx`

The main timeline container that orchestrates all timeline functionality.

**Features:**
- Scrollable track area with horizontal and vertical scrolling
- Time ruler at the top
- Track list with individual tracks
- Playhead overlay
- Keyboard shortcuts
- Auto-scroll during playback
- Playback loop

**Keyboard Shortcuts:**
- `Space` - Play/Pause
- `Delete/Backspace` - Delete selected clips
- `Ctrl/Cmd + =` - Zoom in
- `Ctrl/Cmd + -` - Zoom out
- `Ctrl/Cmd + Click` - Multi-select clips

**Usage:**
```tsx
import { Timeline } from '@/app/components/timeline';

function Editor() {
  return <Timeline />;
}
```

---

### 2. TimelineTrack
**File:** `TimelineTrack.tsx`

Individual track row displaying clips and track controls.

**Features:**
- Track header with name and type icon
- Visibility, mute, and lock controls
- Clips area with grid lines
- Color-coded by track type (video/audio/text)
- Locked state prevents editing

**Props:**
```tsx
interface TimelineTrackProps {
  track: Track;
  zoom: number;
  selectedClipIds: Set<string>;
  onClipSelect: (clipId: string, multi: boolean) => void;
  onClipDragEnd: (clipId: string, trackId: string, startTime: number) => void;
  onClipResize: (clipId: string, edge: 'left' | 'right', newTime: number) => void;
  onToggleLock: () => void;
  onToggleMute: () => void;
  onToggleVisibility: () => void;
}
```

---

### 3. TimelineClip
**File:** `TimelineClip.tsx`

Individual clip on the timeline with drag and resize functionality.

**Features:**
- **Draggable** - Click and drag to reposition on timeline
- **Resizable** - Left/right handles for trimming
- **Selection** - Click to select, Ctrl/Cmd+Click for multi-select
- **Visual indicators:**
  - Color-coded by type (video, audio, image, text)
  - Type icon
  - Mute/lock status icons
  - Trim indicators
  - Audio waveform preview (placeholder)
- **Locked state** - Prevents editing when clip or track is locked

**Clip Colors:**
- Video: Blue
- Audio: Green
- Image: Purple
- Text: Orange

**Props:**
```tsx
interface TimelineClipProps {
  clip: Clip;
  zoom: number;
  isSelected: boolean;
  trackLocked?: boolean;
  onSelect: (clipId: string, multi: boolean) => void;
  onDragEnd: (clipId: string, trackId: string, startTime: number) => void;
  onResize: (clipId: string, edge: 'left' | 'right', newTime: number) => void;
}
```

---

### 4. Playhead
**File:** `Playhead.tsx`

Current time indicator with drag functionality.

**Features:**
- Red vertical line spanning all tracks
- Triangle handle at top
- Draggable to scrub through timeline
- Time tooltip on hover
- Snaps to grid/clips when dragging

**Props:**
```tsx
interface PlayheadProps {
  currentTime: number; // in seconds
  zoom: number; // pixels per second
  height: number;
  onDrag: (time: number) => void;
}
```

---

### 5. TimeRuler
**File:** `TimeRuler.tsx`

Time markers and scale at top of timeline.

**Features:**
- Major and minor tick marks
- Time labels in MM:SS:FF format
- Adaptive intervals based on zoom level
- Clickable to seek to time

**Zoom-based intervals:**
| Zoom Level | Major Interval | Minor Interval |
|------------|----------------|----------------|
| >= 200px/s | 1s             | 100ms          |
| >= 100px/s | 5s             | 1s             |
| >= 50px/s  | 10s            | 5s             |
| >= 20px/s  | 30s            | 10s            |
| < 20px/s   | 60s            | 30s            |

**Props:**
```tsx
interface TimeRulerProps {
  duration: number; // in seconds
  zoom: number; // pixels per second
  onSeek: (time: number) => void;
}
```

---

### 6. TimelineControls
**File:** `TimelineControls.tsx`

Control panel for playback, zoom, and track management.

**Features:**
- Play/Pause/Stop buttons
- Current time display (MM:SS:FF)
- Duration display
- Zoom slider (10-500 px/s)
- Zoom in/out buttons
- Add track dropdown (Video/Audio/Text)

**Props:**
```tsx
interface TimelineControlsProps {
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  zoom: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onZoomChange: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddTrack: (type: 'video' | 'audio' | 'text') => void;
}
```

---

## Hook: useTimeline

**File:** `app/hooks/useTimeline.ts`

High-level timeline operations hook.

**Features:**
- Clip drag and resize with snapping
- Playhead drag with snapping
- Zoom controls
- Clip operations (add, remove, duplicate, split)
- Track operations (add, remove, update)
- Snap to grid/clips/playhead
- Time/pixel conversions

**Usage:**
```tsx
import { useTimeline } from '@/app/hooks/useTimeline';

function TimelineComponent() {
  const {
    // State
    tracks,
    zoom,
    currentTime,
    duration,
    selectedClipIds,

    // Clip operations
    handleClipDrag,
    handleClipResize,
    deleteSelectedClips,
    duplicateSelectedClips,
    splitClipAtPlayhead,

    // Playhead
    handlePlayheadDrag,

    // Zoom
    zoomIn,
    zoomOut,
    zoomToFit,

    // Utilities
    snapTime,
    pixelToTime,
    timeToPixel,
  } = useTimeline();

  // Use in your component
}
```

---

## Stores Used

### useTimelineStore
- Track and clip management
- Playback state (playing, currentTime, duration)
- Timeline view (zoom, scroll)
- Grid and snap settings

### useSelectionStore
- Clip selection (single and multi-select)
- Selection state management
- Multi-select mode (Ctrl/Cmd key)

---

## Features

### Drag and Drop
- Uses `@dnd-kit/core` for drag operations
- Smooth clip dragging with visual feedback
- Snap to grid/clips during drag
- Move clips between tracks

### Resize (Trimming)
- Left and right resize handles
- Visual resize handles on hover
- Snap to grid/clips during resize
- Updates trimStart/duration

### Snapping
- Snap to grid (configurable interval)
- Snap to other clip edges
- Snap to playhead
- Visual snap indicators
- Configurable snap threshold

### Zoom
- Zoom range: 10-500 pixels per second
- Slider control
- Zoom in/out buttons
- Keyboard shortcuts
- Zoom to fit

### Playback
- Play/Pause/Stop controls
- Real-time playhead animation
- Auto-scroll to keep playhead visible
- Loop at end
- Keyboard control (Space bar)

### Multi-Select
- Click to select single clip
- Ctrl/Cmd + Click for multi-select
- Delete multiple clips
- Visual selection indicators

### Track Management
- Add tracks (Video/Audio/Text)
- Toggle visibility
- Toggle mute (audio/video tracks)
- Toggle lock
- Color-coded by type

---

## Integration Example

```tsx
import { Timeline } from '@/app/components/timeline';
import { useTimelineStore } from '@/app/lib/store/timelineStore';

function VideoEditor() {
  const { addTrack, addClip } = useTimelineStore();

  // Initialize with some tracks
  useEffect(() => {
    addTrack({ name: 'Video 1', type: 'video' });
    addTrack({ name: 'Audio 1', type: 'audio' });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header>{/* Your header */}</header>

      <main className="flex-1 flex">
        <aside>{/* Assets panel */}</aside>

        <section className="flex-1 flex flex-col">
          <div className="flex-1">{/* Canvas */}</div>

          <div className="h-80">
            <Timeline />
          </div>
        </section>

        <aside>{/* Properties panel */}</aside>
      </main>
    </div>
  );
}
```

---

## Styling

All components use Tailwind CSS with a dark theme:
- Background: `bg-gray-900` / `bg-gray-800`
- Borders: `border-gray-700`
- Text: `text-gray-200` / `text-gray-300`
- Accents: Type-specific colors (blue, green, purple, orange)

---

## Performance Considerations

- Uses `useCallback` for event handlers to prevent re-renders
- `useMemo` for expensive calculations
- `requestAnimationFrame` for playback loop
- Efficient clip lookup with Maps
- Minimal re-renders with Zustand's selective subscriptions

---

## Future Enhancements

- [ ] Video thumbnails in clips
- [ ] Real audio waveforms
- [ ] Clip effects visualization
- [ ] Transitions between clips
- [ ] Keyframe editor
- [ ] Markers and regions
- [ ] Timeline minimap
- [ ] Undo/redo for timeline operations
- [ ] Copy/paste clips
- [ ] Ripple editing
- [ ] Magnetic timeline
- [ ] Clip grouping

---

## Dependencies

- `@dnd-kit/core` - Drag and drop
- `@dnd-kit/sortable` - Sortable lists
- `zustand` - State management
- `lucide-react` - Icons
- `tailwindcss` - Styling

---

## File Structure

```
app/
├── components/
│   └── timeline/
│       ├── Timeline.tsx           (Main container)
│       ├── TimelineTrack.tsx      (Track row)
│       ├── TimelineClip.tsx       (Individual clip)
│       ├── Playhead.tsx           (Playhead indicator)
│       ├── TimeRuler.tsx          (Time scale)
│       ├── TimelineControls.tsx   (Control panel)
│       ├── index.ts               (Exports)
│       └── README.md              (This file)
├── hooks/
│   └── useTimeline.ts             (Timeline operations)
├── lib/
│   ├── store/
│   │   ├── timelineStore.ts       (Timeline state)
│   │   └── selectionStore.ts      (Selection state)
│   └── timeline/
│       ├── timeUtils.ts           (Time utilities)
│       └── snapUtils.ts           (Snap utilities)
```

---

## API Reference

See individual component documentation above for detailed props and usage.

For store APIs, see:
- `app/lib/store/timelineStore.ts`
- `app/lib/store/selectionStore.ts`

For utility functions, see:
- `app/lib/timeline/timeUtils.ts`
- `app/lib/timeline/snapUtils.ts`
