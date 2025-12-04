# Timeline System - Quick Reference Card

## Installation

Already included in your project! Just import and use.

## Basic Usage

```tsx
import { Timeline } from '@/app/components/timeline';

<div className="h-80">
  <Timeline />
</div>
```

## Store Actions

### Timeline Store

```tsx
import { useTimelineStore } from '@/app/lib/store/timelineStore';

const {
  // State
  tracks,
  currentTime,
  duration,
  zoom,
  isPlaying,

  // Playback
  play,
  pause,
  stop,
  setCurrentTime,

  // Tracks
  addTrack,
  removeTrack,
  updateTrack,
  toggleTrackMute,
  toggleTrackLock,

  // Clips
  addClip,
  removeClip,
  updateClip,
  moveClip,
  duplicateClip,
  splitClip,

  // View
  setZoom,
  setScrollLeft,
} = useTimelineStore();
```

### Selection Store

```tsx
import { useSelectionStore } from '@/app/lib/store/selectionStore';

const {
  selectedClipIds,
  selectClip,
  clearClipSelection,
  isClipSelected,
  multiSelectMode,
  setMultiSelectMode,
} = useSelectionStore();
```

## Hook: useTimeline

```tsx
import { useTimeline } from '@/app/hooks/useTimeline';

const {
  // Clip operations
  handleClipDrag,
  handleClipResize,
  deleteSelectedClips,
  duplicateSelectedClips,

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
```

## Common Operations

### Add a Track

```tsx
const { addTrack } = useTimelineStore();

addTrack({
  name: 'Video Track 1',
  type: 'video',
});
```

### Add a Clip

```tsx
const { addClip, tracks } = useTimelineStore();
const videoTrack = tracks.find(t => t.type === 'video');

addClip(videoTrack.id, {
  name: 'My Clip',
  type: 'video',
  startTime: 0,      // seconds
  duration: 5,       // seconds
  assetId: 'abc123', // optional
});
```

### Delete Selected Clips

```tsx
const { selectedClipIds } = useSelectionStore();
const { removeClip } = useTimelineStore();

selectedClipIds.forEach(id => removeClip(id));
```

### Get Clips at Current Time

```tsx
const { currentTime, tracks } = useTimelineStore();

const activeClips = tracks.flatMap(track =>
  track.clips.filter(clip =>
    currentTime >= clip.startTime &&
    currentTime < clip.startTime + clip.duration
  )
);
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `Delete` or `Backspace` | Delete selected clips |
| `Ctrl/Cmd + =` | Zoom in |
| `Ctrl/Cmd + -` | Zoom out |
| `Ctrl/Cmd + Click` | Multi-select clips |

## Clip Types & Colors

| Type | Color | Icon |
|------|-------|------|
| Video | Blue | 🎬 |
| Audio | Green | 🔊 |
| Image | Purple | 🖼️ |
| Text | Orange | 📝 |

## Time Format

Default: **MM:SS:FF** (Minutes:Seconds:Frames)

```tsx
import { formatTime } from '@/app/lib/timeline/timeUtils';

formatTime(5000); // "00:05:00"
formatTime(65000); // "01:05:00"
```

## Zoom Levels

- **Min:** 10 px/second
- **Max:** 500 px/second
- **Default:** 100 px/second

```tsx
const { setZoom } = useTimelineStore();

setZoom(200); // 200 pixels per second
```

## Snapping

```tsx
const { snapToGrid, setSnapToGrid } = useTimelineStore();

setSnapToGrid(true);  // Enable
setSnapToGrid(false); // Disable
```

## Track Controls

```tsx
const { toggleTrackLock, toggleTrackMute } = useTimelineStore();

toggleTrackLock(trackId);
toggleTrackMute(trackId);
```

## Component Props

### Timeline
No props needed - uses stores

### TimelineTrack
```tsx
<TimelineTrack
  track={track}
  zoom={100}
  selectedClipIds={selectedIds}
  onClipSelect={(id, multi) => {}}
  onClipDragEnd={(id, trackId, time) => {}}
  onClipResize={(id, edge, time) => {}}
  onToggleLock={() => {}}
  onToggleMute={() => {}}
  onToggleVisibility={() => {}}
/>
```

### TimelineClip
```tsx
<TimelineClip
  clip={clip}
  zoom={100}
  isSelected={true}
  trackLocked={false}
  onSelect={(id, multi) => {}}
  onDragEnd={(id, trackId, time) => {}}
  onResize={(id, edge, time) => {}}
/>
```

### Playhead
```tsx
<Playhead
  currentTime={5}
  zoom={100}
  height={300}
  onDrag={(time) => {}}
/>
```

### TimeRuler
```tsx
<TimeRuler
  duration={60}
  zoom={100}
  onSeek={(time) => {}}
/>
```

### TimelineControls
```tsx
<TimelineControls
  isPlaying={false}
  currentTime={5}
  duration={60}
  zoom={100}
  onPlay={() => {}}
  onPause={() => {}}
  onStop={() => {}}
  onZoomChange={(zoom) => {}}
  onZoomIn={() => {}}
  onZoomOut={() => {}}
  onAddTrack={(type) => {}}
/>
```

## Utilities

### Time Conversion

```tsx
import { pixelsToTime, timeToPixels } from '@/app/lib/timeline/timeUtils';

const time = pixelsToTime(500, 100); // 5 seconds
const pixels = timeToPixels(5, 100); // 500 pixels
```

### Snapping

```tsx
import { findNearestSnapPoint } from '@/app/lib/timeline/snapUtils';

const result = findNearestSnapPoint(
  5.2,           // target time
  snapPoints,    // available snap points
  100            // threshold in ms
);

if (result.snapped) {
  console.log('Snapped to:', result.time);
}
```

## Integration Examples

### With Canvas

```tsx
function Editor() {
  const { currentTime, tracks } = useTimelineStore();

  const visibleClips = tracks.flatMap(t =>
    t.clips.filter(c =>
      currentTime >= c.startTime &&
      currentTime < c.startTime + c.duration
    )
  );

  return (
    <>
      <Canvas clips={visibleClips} />
      <Timeline />
    </>
  );
}
```

### With Asset Drop

```tsx
function Editor() {
  const { addClip } = useTimelineStore();

  const handleDrop = (assetId, trackId, time) => {
    addClip(trackId, {
      name: 'New Clip',
      type: 'video',
      assetId,
      startTime: time,
      duration: 5,
    });
  };

  return <Timeline />;
}
```

## Styling

Dark theme by default. Customize with Tailwind classes:

```tsx
<div className="h-80 border-t-4 border-blue-500">
  <Timeline />
</div>
```

## Performance Tips

1. Use `useMemo` for filtered clip lists
2. Use `useCallback` for event handlers
3. Limit track count for smooth scrolling
4. Virtualize for 100+ clips

## Troubleshooting

**Timeline not scrolling?**
```tsx
<div className="overflow-x-auto">
  <Timeline />
</div>
```

**Clips not snapping?**
```tsx
setSnapToGrid(true);
```

**Performance issues?**
- Reduce zoom level
- Limit visible time range
- Use fewer tracks

## Resources

- **Full Docs:** `README.md`
- **Implementation Guide:** `IMPLEMENTATION_GUIDE.md`
- **Complete Guide:** `TIMELINE_COMPLETE.md`

## Support

Check the documentation files or examine the source code:
- Components: `app/components/timeline/*.tsx`
- Hook: `app/hooks/useTimeline.ts`
- Stores: `app/lib/store/*.ts`
- Utils: `app/lib/timeline/*.ts`
