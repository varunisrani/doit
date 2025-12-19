# Video Editor Structure

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (Header.tsx)                                          [Export]  │
│  [Logo] Video Editor  [File▼] [Edit▼] [View▼]                          │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│          │                                              │               │
│ SIDEBAR  │            CANVAS AREA                       │  PROPERTIES   │
│ (Sidebar │         (EditorLayout.tsx)                   │   PANEL       │
│  .tsx)   │                                              │               │
│          │  ┌────────────────────────────────────┐      │ Transform     │
│ [◄]      │  │                                    │      │  Position X   │
│          │  │                                    │      │  Position Y   │
│ Tools ▼  │  │      Video Preview Canvas          │      │  Scale        │
│  Select  │  │         (16:9 ratio)               │      │               │
│  Cut     │  │                                    │      │ Opacity       │
│  Text    │  │                                    │      │               │
│  Image   │  └────────────────────────────────────┘      │ Blend Mode    │
│          │                                              │               │
│ Media ▼  │                                              │ Duration      │
│ [Upload] │                                              │               │
│  video_1 ├──────────────────────────────────────────────┤               │
│  intro   │         TIMELINE AREA                        │               │
│  bg.jpg  │  ┌────────────────────────────────────┐      │               │
│  music   │  │ Video │████████░░░░░░░░░░░░░░░░░░│      │               │
│          │  │ Audio │░░░░░████████░░░░░░░░░░░░░│      │               │
│ Effects ▶│  │ Text  │░░░░░░░░░░░░░░░░░░░░░░░░░│      │               │
│ Trans. ▶ │  └────────────────────────────────────┘      │               │
│          │                                              │    [►]        │
└──────────┴──────────────────────────────────────────────┴───────────────┘

Legend:
▼ = Expanded panel
▶ = Collapsed panel
◄ = Toggle button
████ = Timeline clip
```

## Component Hierarchy

```
EditorLayout (Main Container)
│
├── Header
│   ├── Logo & Title
│   ├── DropdownMenu (File)
│   │   ├── New Project
│   │   ├── Open Project
│   │   └── Save Project
│   │
│   ├── DropdownMenu (Edit)
│   │   ├── Undo
│   │   ├── Redo
│   │   ├── Cut
│   │   ├── Copy
│   │   └── Paste
│   │
│   ├── DropdownMenu (View)
│   │   ├── Zoom In
│   │   ├── Zoom Out
│   │   └── Fit to Screen
│   │
│   └── Export Button
│
├── Sidebar Toggle Button
│
├── Sidebar
│   ├── CollapsiblePanel (Tools)
│   │   ├── ToolButton (Select)
│   │   ├── ToolButton (Cut)
│   │   ├── ToolButton (Text)
│   │   └── ToolButton (Image)
│   │
│   ├── CollapsiblePanel (Media Library)
│   │   ├── Upload Button
│   │   └── MediaItem List
│   │       ├── video_clip_1.mp4
│   │       ├── intro_scene.mp4
│   │       ├── background.jpg
│   │       ├── soundtrack.mp3
│   │       └── Project Assets
│   │
│   ├── CollapsiblePanel (Effects)
│   └── CollapsiblePanel (Transitions)
│
├── Center Area
│   ├── Canvas Area
│   │   └── Video Preview Container
│   │       └── Placeholder Content
│   │
│   └── Timeline Area
│       ├── Timeline Header
│       │   ├── Title
│       │   └── Time Display
│       │
│       └── Timeline Tracks
│           ├── Video Track
│           ├── Audio Track
│           └── Text Track
│
├── Properties Toggle Button
│
└── Properties Panel
    ├── Transform Section
    │   ├── Position X Input
    │   ├── Position Y Input
    │   └── Scale Slider
    │
    ├── Opacity Slider
    ├── Blend Mode Select
    ├── Duration Input
    └── Empty State Message
```

## File Organization

```
app/
│
├── components/
│   └── layout/
│       ├── Header.tsx           (4.6 KB)
│       ├── Sidebar.tsx          (5.1 KB)
│       ├── EditorLayout.tsx     (8.2 KB)
│       └── index.ts             (119 B)
│
├── editor/
│   ├── layout.tsx               (290 B)
│   └── page.tsx                 (306 B)
│
└── page.tsx                     (Updated for redirect)
```

## State Management Plan

### Current State (Local)
- `showSidebar` - Toggle left sidebar
- `showProperties` - Toggle right properties panel
- `activeTool` - Selected tool in sidebar
- `isOpen` - Dropdown menu states

### Future Integration (Zustand)
- Timeline Store
  - Clips array
  - Playhead position
  - Selected clips
  - Track data

- Media Store
  - Media assets
  - Upload queue
  - Asset metadata

- Editor Store
  - Canvas dimensions
  - Zoom level
  - Active tool
  - Selection state

- History Store
  - Undo stack
  - Redo stack
  - Action history

## Responsive Behavior

### Desktop (Default)
- Full layout with all panels visible
- Sidebar: 256px (w-64)
- Properties: 320px (w-80)
- Toggle buttons: 24px (w-6)
- Canvas: Flexible (flex-1)
- Timeline: 256px height (h-64)

### Tablet (Planned)
- Collapsible sidebars
- Stacked timeline
- Floating properties panel

### Mobile (Planned)
- Bottom sheet navigation
- Full-screen canvas
- Modal-based properties

## Keyboard Shortcuts (Planned)

### File Operations
- `Ctrl+N` - New Project
- `Ctrl+O` - Open Project
- `Ctrl+S` - Save Project

### Edit Operations
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+X` - Cut
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste

### View Operations
- `Ctrl++` - Zoom In
- `Ctrl+-` - Zoom Out
- `Ctrl+0` - Fit to Screen
- `Space` - Play/Pause (future)

### Tools
- `V` - Select Tool
- `C` - Cut Tool
- `T` - Text Tool
- `I` - Image Tool

## Color Palette

```css
/* Background Shades */
--bg-primary: #09090b (zinc-950)
--bg-secondary: #18181b (zinc-900)
--bg-tertiary: #27272a (zinc-800)

/* Border Colors */
--border-primary: #27272a (zinc-800)
--border-secondary: #3f3f46 (zinc-700)

/* Text Colors */
--text-primary: #ffffff (white)
--text-secondary: #d4d4d8 (zinc-300)
--text-tertiary: #a1a1aa (zinc-400)
--text-muted: #71717a (zinc-500)
--text-subtle: #52525b (zinc-600)

/* Accent Colors */
--accent-primary: #2563eb (blue-600)
--accent-hover: #1d4ed8 (blue-700)
--accent-light: #3b82f6 (blue-500)

/* Gradients */
--gradient-logo: from-blue-500 to-purple-600
```

## Component Props Interface

### Header
```typescript
// No props - fully self-contained
```

### Sidebar
```typescript
// No props - manages own state
// Future: onToolSelect, selectedTool, mediaItems
```

### EditorLayout
```typescript
interface EditorLayoutProps {
  children?: React.ReactNode;
}
```

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE support

## Performance Considerations
- Lazy load timeline clips
- Virtual scrolling for long media libraries
- Debounced property updates
- Optimized re-renders with React.memo
- CSS Grid for efficient layout calculations

---

**Next Phase**: Timeline component with drag-and-drop functionality
