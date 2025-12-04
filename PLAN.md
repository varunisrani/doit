# Video Editor App - Development Plan

## Project Overview

Build a **browser-based video editor** similar to KineMaster using Next.js. The app will allow users to create videos from images with full editing capabilities - all processing happens client-side with **zero API dependencies**.

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Next.js 16 (App Router) | Core application framework |
| UI | React 19 + TypeScript | Component architecture |
| Styling | Tailwind CSS v4 | Responsive UI design |
| Canvas | HTML5 Canvas API | Image/video rendering |
| Video Encoding | FFmpeg.wasm | Client-side video encoding |
| State | Zustand | Lightweight state management |
| Drag & Drop | @dnd-kit/core | Timeline drag operations |
| Icons | Lucide React | UI icons |

### Key NPM Packages (No API Dependencies)

```json
{
  "@ffmpeg/ffmpeg": "^0.12.x",      // WebAssembly video encoder
  "@ffmpeg/util": "^0.12.x",        // FFmpeg utilities
  "zustand": "^4.x",                // State management
  "@dnd-kit/core": "^6.x",          // Drag and drop
  "@dnd-kit/sortable": "^8.x",      // Sortable lists
  "lucide-react": "^0.x",           // Icons
  "uuid": "^9.x"                    // Unique IDs for elements
}
```

---

## Core Features

### 1. Media Import
- [ ] Import images (PNG, JPG, WEBP, GIF)
- [ ] Drag & drop file upload
- [ ] File browser upload
- [ ] Image preview thumbnails
- [ ] Media library panel

### 2. Timeline Editor
- [ ] Multi-track timeline (video, audio, text, effects)
- [ ] Drag & drop clip arrangement
- [ ] Clip trimming (start/end handles)
- [ ] Clip duration adjustment
- [ ] Zoom in/out timeline
- [ ] Playhead scrubbing
- [ ] Snap-to-grid functionality

### 3. Canvas Editor (Preview)
- [ ] Real-time preview of composition
- [ ] Select and move elements
- [ ] Resize elements (corner/edge handles)
- [ ] Rotate elements
- [ ] Layer ordering (bring forward/send back)
- [ ] Zoom canvas view
- [ ] Grid/guide overlays

### 4. Image Editing
- [ ] Scale/stretch images
- [ ] Crop images
- [ ] Rotate images
- [ ] Flip horizontal/vertical
- [ ] Opacity adjustment
- [ ] Position (X, Y coordinates)
- [ ] Aspect ratio lock/unlock

### 5. Text Overlays
- [ ] Add text layers
- [ ] Font selection (Google Fonts loaded locally)
- [ ] Font size, color, weight
- [ ] Text alignment
- [ ] Text shadow/outline
- [ ] Text animations (fade, slide, scale)

### 6. Transitions
- [ ] Fade in/out
- [ ] Slide (left, right, up, down)
- [ ] Zoom in/out
- [ ] Dissolve/crossfade
- [ ] Wipe transitions
- [ ] Custom duration per transition

### 7. Animations & Keyframes
- [ ] Position keyframes
- [ ] Scale keyframes
- [ ] Rotation keyframes
- [ ] Opacity keyframes
- [ ] Easing functions (linear, ease-in, ease-out, bezier)
- [ ] Keyframe timeline editor

### 8. Filters & Effects
- [ ] Brightness/Contrast
- [ ] Saturation
- [ ] Blur
- [ ] Grayscale
- [ ] Sepia
- [ ] Color overlay
- [ ] Vignette

### 9. Audio Support
- [ ] Import audio files (MP3, WAV)
- [ ] Audio waveform visualization
- [ ] Volume control
- [ ] Audio trimming
- [ ] Multiple audio tracks
- [ ] Mute/solo tracks

### 10. Export
- [ ] Export as MP4 (H.264)
- [ ] Export as WebM
- [ ] Export as GIF
- [ ] Resolution options (720p, 1080p, 4K)
- [ ] Frame rate options (24, 30, 60 fps)
- [ ] Quality settings
- [ ] Export progress indicator

### 11. Project Management
- [ ] Save project to localStorage
- [ ] Load project from localStorage
- [ ] Export project as JSON file
- [ ] Import project from JSON file
- [ ] Auto-save functionality
- [ ] Project history (undo/redo)

---

## Application Architecture

```
app/
├── page.tsx                    # Redirect to editor
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
│
├── editor/
│   ├── page.tsx               # Main editor page
│   └── layout.tsx             # Editor layout
│
├── components/
│   ├── layout/
│   │   ├── EditorLayout.tsx   # Main editor container
│   │   ├── Header.tsx         # Top toolbar
│   │   └── Sidebar.tsx        # Left tools panel
│   │
│   ├── timeline/
│   │   ├── Timeline.tsx       # Timeline container
│   │   ├── TimelineTrack.tsx  # Individual track
│   │   ├── TimelineClip.tsx   # Clip on timeline
│   │   ├── Playhead.tsx       # Current time indicator
│   │   └── TimeRuler.tsx      # Time markers
│   │
│   ├── canvas/
│   │   ├── EditorCanvas.tsx   # Main canvas component
│   │   ├── CanvasElement.tsx  # Renderable element
│   │   ├── SelectionBox.tsx   # Selection handles
│   │   ├── TransformControls.tsx # Resize/rotate
│   │   └── GridOverlay.tsx    # Alignment grid
│   │
│   ├── panels/
│   │   ├── MediaPanel.tsx     # Media library
│   │   ├── PropertiesPanel.tsx # Element properties
│   │   ├── LayersPanel.tsx    # Layer management
│   │   ├── TransitionsPanel.tsx # Transition picker
│   │   ├── FiltersPanel.tsx   # Filters & effects
│   │   └── ExportPanel.tsx    # Export settings
│   │
│   ├── tools/
│   │   ├── Toolbar.tsx        # Tool selection
│   │   ├── SelectTool.tsx     # Selection tool
│   │   ├── TextTool.tsx       # Text creation
│   │   ├── CropTool.tsx       # Cropping tool
│   │   └── ZoomTool.tsx       # Zoom controls
│   │
│   ├── modals/
│   │   ├── ExportModal.tsx    # Export dialog
│   │   ├── ProjectModal.tsx   # Save/load project
│   │   └── SettingsModal.tsx  # App settings
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Slider.tsx
│       ├── Dropdown.tsx
│       ├── ColorPicker.tsx
│       ├── Input.tsx
│       └── Tooltip.tsx
│
├── lib/
│   ├── store/
│   │   ├── editorStore.ts     # Main editor state
│   │   ├── timelineStore.ts   # Timeline state
│   │   ├── selectionStore.ts  # Selection state
│   │   └── historyStore.ts    # Undo/redo history
│   │
│   ├── canvas/
│   │   ├── renderer.ts        # Canvas rendering engine
│   │   ├── elements.ts        # Element types & creation
│   │   ├── transforms.ts      # Transform calculations
│   │   └── hitTest.ts         # Click detection
│   │
│   ├── video/
│   │   ├── encoder.ts         # FFmpeg encoding wrapper
│   │   ├── frameGenerator.ts  # Generate frames from timeline
│   │   ├── exporter.ts        # Export orchestration
│   │   └── formats.ts         # Format configurations
│   │
│   ├── timeline/
│   │   ├── timeUtils.ts       # Time calculations
│   │   ├── snapUtils.ts       # Snap-to-grid logic
│   │   └── playback.ts        # Playback controller
│   │
│   ├── effects/
│   │   ├── transitions.ts     # Transition implementations
│   │   ├── filters.ts         # CSS/Canvas filters
│   │   └── animations.ts      # Keyframe animations
│   │
│   └── utils/
│       ├── fileUtils.ts       # File handling
│       ├── imageUtils.ts      # Image processing
│       ├── mathUtils.ts       # Math helpers
│       └── storageUtils.ts    # localStorage helpers
│
├── hooks/
│   ├── useCanvas.ts           # Canvas operations
│   ├── useTimeline.ts         # Timeline operations
│   ├── usePlayback.ts         # Playback controls
│   ├── useSelection.ts        # Selection management
│   ├── useKeyboard.ts         # Keyboard shortcuts
│   ├── useHistory.ts          # Undo/redo
│   └── useExport.ts           # Export operations
│
├── types/
│   ├── editor.ts              # Editor types
│   ├── timeline.ts            # Timeline types
│   ├── elements.ts            # Element types
│   ├── effects.ts             # Effects types
│   └── project.ts             # Project types
│
└── constants/
    ├── defaults.ts            # Default values
    ├── shortcuts.ts           # Keyboard shortcuts
    └── presets.ts             # Export presets
```

---

## Data Models

### Project Structure
```typescript
interface Project {
  id: string;
  name: string;
  settings: ProjectSettings;
  timeline: Timeline;
  assets: Asset[];
  createdAt: number;
  updatedAt: number;
}

interface ProjectSettings {
  width: number;           // 1920
  height: number;          // 1080
  fps: number;             // 30
  duration: number;        // in milliseconds
  backgroundColor: string; // #000000
}
```

### Timeline Structure
```typescript
interface Timeline {
  tracks: Track[];
  duration: number;
  zoom: number;
  scrollPosition: number;
}

interface Track {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  name: string;
  clips: Clip[];
  locked: boolean;
  visible: boolean;
  muted: boolean;
}

interface Clip {
  id: string;
  assetId: string | null;
  startTime: number;       // Position on timeline (ms)
  duration: number;        // Clip length (ms)
  inPoint: number;         // Trim start (ms)
  outPoint: number;        // Trim end (ms)
  element: CanvasElement;
  transitions: {
    in: Transition | null;
    out: Transition | null;
  };
  keyframes: Keyframe[];
}
```

### Canvas Elements
```typescript
interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape';
  transform: Transform;
  style: ElementStyle;
  filters: Filter[];
}

interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  anchorX: number;
  anchorY: number;
}

interface ElementStyle {
  opacity: number;
  blendMode: string;
  // Text specific
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: string;
  lineHeight?: number;
}
```

### Keyframes & Animations
```typescript
interface Keyframe {
  id: string;
  time: number;
  property: KeyframeProperty;
  value: number | string;
  easing: EasingFunction;
}

type KeyframeProperty =
  | 'x' | 'y'
  | 'width' | 'height'
  | 'rotation'
  | 'scaleX' | 'scaleY'
  | 'opacity';

type EasingFunction =
  | 'linear'
  | 'easeIn' | 'easeOut' | 'easeInOut'
  | 'cubicBezier';
```

---

## Implementation Phases

### Phase 1: Foundation
**Goal**: Basic editor layout and canvas rendering

- [ ] Set up project structure
- [ ] Install dependencies (zustand, lucide-react, uuid)
- [ ] Create editor layout (header, sidebar, canvas, timeline)
- [ ] Implement basic Zustand store
- [ ] Create canvas component with HTML5 Canvas
- [ ] Implement image upload functionality
- [ ] Render images on canvas
- [ ] Basic element selection

### Phase 2: Canvas Interactions
**Goal**: Full canvas manipulation capabilities

- [ ] Element selection with bounding box
- [ ] Move elements (drag)
- [ ] Resize elements (corner handles)
- [ ] Rotate elements
- [ ] Multi-select elements
- [ ] Layer ordering (z-index)
- [ ] Canvas zoom and pan
- [ ] Grid and snap guides

### Phase 3: Timeline Core
**Goal**: Functional timeline with clips

- [ ] Timeline component with time ruler
- [ ] Track management (add/remove)
- [ ] Clip rendering on tracks
- [ ] Drag clips to reposition
- [ ] Resize clips (trim)
- [ ] Playhead component
- [ ] Timeline zoom
- [ ] Scroll synchronization

### Phase 4: Playback System
**Goal**: Real-time preview playback

- [ ] Playback controller (play/pause/stop)
- [ ] Frame-by-frame rendering
- [ ] Playback speed control
- [ ] Loop playback option
- [ ] Keyboard shortcuts (space, arrows)
- [ ] Sync canvas with timeline position

### Phase 5: Properties Panel
**Goal**: Edit element properties

- [ ] Properties panel component
- [ ] Transform controls (x, y, width, height, rotation)
- [ ] Style controls (opacity, blend mode)
- [ ] Text properties (font, size, color)
- [ ] Filter controls
- [ ] Real-time preview updates

### Phase 6: Text & Shapes
**Goal**: Add text and basic shapes

- [ ] Text element creation
- [ ] Text editing (double-click to edit)
- [ ] Font picker (local fonts)
- [ ] Text styling options
- [ ] Basic shapes (rectangle, circle, line)
- [ ] Shape styling

### Phase 7: Transitions
**Goal**: Clip transitions

- [ ] Transition definitions
- [ ] Fade transition
- [ ] Slide transitions (4 directions)
- [ ] Zoom transitions
- [ ] Apply transitions to clips
- [ ] Transition duration control
- [ ] Preview transitions

### Phase 8: Keyframe Animations
**Goal**: Property animation over time

- [ ] Keyframe data structure
- [ ] Add keyframes to properties
- [ ] Keyframe timeline UI
- [ ] Interpolation engine
- [ ] Easing functions
- [ ] Preview animations

### Phase 9: Effects & Filters
**Goal**: Visual effects on elements

- [ ] Brightness/Contrast filter
- [ ] Saturation filter
- [ ] Blur filter
- [ ] Color filters (grayscale, sepia)
- [ ] Stack multiple filters
- [ ] Real-time filter preview

### Phase 10: Audio Support
**Goal**: Audio track management

- [ ] Audio file import
- [ ] Audio waveform generation
- [ ] Audio track on timeline
- [ ] Volume control
- [ ] Audio playback sync
- [ ] Mute/solo tracks

### Phase 11: FFmpeg Integration
**Goal**: Video export capability

- [ ] FFmpeg.wasm setup
- [ ] Frame capture from canvas
- [ ] Image sequence to video
- [ ] Add audio to video
- [ ] Export progress tracking
- [ ] Multiple format support

### Phase 12: Export Options
**Goal**: Complete export functionality

- [ ] Export modal UI
- [ ] Resolution presets
- [ ] Frame rate options
- [ ] Quality settings
- [ ] Format selection (MP4, WebM, GIF)
- [ ] Download exported file

### Phase 13: Project Management
**Goal**: Save and load projects

- [ ] Project data serialization
- [ ] Save to localStorage
- [ ] Load from localStorage
- [ ] Export project as JSON
- [ ] Import project from JSON
- [ ] Auto-save

### Phase 14: History & Undo
**Goal**: Undo/redo functionality

- [ ] Action history store
- [ ] Undo last action
- [ ] Redo undone action
- [ ] History limit (50 states)
- [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

### Phase 15: Polish & UX
**Goal**: Final refinements

- [ ] Keyboard shortcuts overlay
- [ ] Tooltips on all controls
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive layout adjustments
- [ ] Performance optimizations
- [ ] Dark/light theme toggle

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Play/Pause | `Space` |
| Undo | `Ctrl + Z` |
| Redo | `Ctrl + Y` / `Ctrl + Shift + Z` |
| Save Project | `Ctrl + S` |
| Select All | `Ctrl + A` |
| Delete | `Delete` / `Backspace` |
| Duplicate | `Ctrl + D` |
| Copy | `Ctrl + C` |
| Paste | `Ctrl + V` |
| Cut | `Ctrl + X` |
| Zoom In | `Ctrl + +` |
| Zoom Out | `Ctrl + -` |
| Fit to Screen | `Ctrl + 0` |
| Add Text | `T` |
| Select Tool | `V` |
| Move Playhead Left | `Left Arrow` |
| Move Playhead Right | `Right Arrow` |
| Go to Start | `Home` |
| Go to End | `End` |
| Split Clip | `S` |
| Group | `Ctrl + G` |
| Ungroup | `Ctrl + Shift + G` |

---

## UI Layout Mockup

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER: [Logo] [File▼] [Edit▼] [View▼]    [Undo][Redo]    [Export]    │
├─────────────┬───────────────────────────────────────┬───────────────────┤
│             │                                       │                   │
│   TOOLS     │         CANVAS PREVIEW                │   PROPERTIES      │
│             │                                       │                   │
│  [Select]   │   ┌─────────────────────────────┐     │   Transform       │
│  [Text]     │   │                             │     │   ├─ X: 100       │
│  [Shape]    │   │      [ Image Element ]      │     │   ├─ Y: 50        │
│  [Crop]     │   │           ↻                 │     │   ├─ W: 400       │
│             │   │      ○───────────○          │     │   ├─ H: 300       │
│  ─────────  │   │      │           │          │     │   └─ Rot: 0°      │
│             │   │      ○───────────○          │     │                   │
│   MEDIA     │   │                             │     │   Style           │
│   LIBRARY   │   └─────────────────────────────┘     │   ├─ Opacity: 100 │
│             │                                       │   └─ Blend: Normal│
│  [img1.jpg] │        [Zoom: 100%] [Fit]            │                   │
│  [img2.png] │                                       │   Filters         │
│  [img3.jpg] │                                       │   [+ Add Filter]  │
│             │                                       │                   │
├─────────────┴───────────────────────────────────────┴───────────────────┤
│  TIMELINE                                        [Zoom─────●───]        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 0:00    0:05    0:10    0:15    0:20    0:25    0:30            │   │
│  │   ▼ (playhead)                                                   │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ Video 1 │███ Clip 1 ███│    │████ Clip 2 ████│                  │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ Video 2 │      │███████ Clip 3 ███████│                         │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ Text    │          │░░ Title ░░│                                 │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ Audio   │▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁│                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  [◀◀] [▶ Play] [▶▶] [⏹]     00:00:05 / 00:00:30     [+ Track]         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

### Canvas Optimization
- Use `requestAnimationFrame` for rendering
- Implement dirty rectangle rendering (only redraw changed areas)
- Cache static elements as bitmap
- Use OffscreenCanvas for background rendering
- Limit preview resolution during editing

### Timeline Optimization
- Virtual scrolling for long timelines
- Thumbnail caching for clips
- Lazy load waveforms
- Debounce frequent updates

### Memory Management
- Release unused canvas contexts
- Clear image caches when not needed
- Use WeakMap for element references
- Implement asset unloading for large projects

### Export Optimization
- Web Worker for frame generation
- Streaming encode (don't buffer all frames)
- Show estimated time remaining
- Allow background export

---

## Browser Requirements

- Chrome 90+ (recommended)
- Firefox 90+
- Safari 15+
- Edge 90+

**Required APIs:**
- Canvas 2D API
- Web Workers
- WebAssembly (for FFmpeg)
- File System Access API (optional, for save dialogs)
- MediaRecorder API (fallback export)

---

## Testing Strategy

### Unit Tests
- Transform calculations
- Time utilities
- Keyframe interpolation
- Filter applications

### Integration Tests
- Canvas rendering pipeline
- Timeline clip operations
- Export process

### E2E Tests
- Complete workflow: import → edit → export
- Project save/load
- Undo/redo chains

---

## Success Criteria

1. **Import**: Users can import multiple images via drag-drop or file picker
2. **Arrange**: Users can arrange images on timeline with precise control
3. **Transform**: Users can move, resize, rotate images on canvas
4. **Animate**: Users can add keyframe animations to elements
5. **Effects**: Users can apply transitions and filters
6. **Preview**: Users can preview video in real-time
7. **Export**: Users can export video in MP4/WebM/GIF format
8. **Save**: Users can save and reload projects

---

## Future Enhancements (Post-MVP)

- Video file import (using FFmpeg for decoding)
- Green screen / chroma key
- Motion tracking
- Templates library
- Cloud project storage
- Collaborative editing
- Mobile responsive editing
- Plugin system

---

## Getting Started

```bash
# Install dependencies
npm install @ffmpeg/ffmpeg @ffmpeg/util zustand @dnd-kit/core @dnd-kit/sortable lucide-react uuid

# Install types
npm install -D @types/uuid

# Run development server
npm run dev
```

---

*This plan provides a comprehensive roadmap for building a fully-featured, browser-based video editor with no external API dependencies.*
