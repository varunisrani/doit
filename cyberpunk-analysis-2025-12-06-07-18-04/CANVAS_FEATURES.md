# Canvas System - Feature Overview

## Visual Feature Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        EDITOR CANVAS                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [0px]  [100px]  [200px]  [300px]  [400px]  <- Ruler      │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 0px │  ┌────────────────┐   Grid Overlay                 │  │
│  │     │  │                │   ╔═══════════╗                 │  │
│  │100px│  │  Video Element │   ║  Selected ║ <- Selection   │  │
│  │     │  │                │   ║  Element  ║    Box         │  │
│  │     │  └────────────────┘   ╚═══════════╝                 │  │
│  │200px│     ↑                      ┌─○ Rotation Handle     │  │
│  │     │  Unlocked                  │                        │  │
│  │     │   Element        ╔═════════╪═════════╗             │  │
│  │300px│                  ║ ■───────┼───────■ ║             │  │
│  │     │    🔒 LOCKED     ║ │   Transform   │ ║             │  │
│  │     │                  ║ │   Controls    │ ║             │  │
│  │400px│                  ║ ■───────┴───────■ ║             │  │
│  │     │                  ╚═══════════════════╝             │  │
│  └─────┴───────────────────────────────────────────────────┘  │
│                                                                 │
│  Info: Zoom 100% | Pan (0,0) | Elements: 3 | Selected: 1      │
└─────────────────────────────────────────────────────────────────┘

Legend:
  ■ = Resize Handle (8 total: corners + edges)
  ○ = Rotation Handle
  ╔╗ = Selection Outline
  🔒 = Locked Element
  ┼ = Grid Lines
```

## Interaction Flow

```
User Action                Canvas Response              Store Update
───────────────────────────────────────────────────────────────────
Click on Element    →      Select Element        →     selectionStore
                           Show Transform Controls

Drag Element        →      Move Element          →     timelineStore
                           Update Position              (clip.position)

Drag Resize Handle  →      Resize Element        →     timelineStore
                           Update Dimensions            (clip.scale)

Drag Rotation       →      Rotate Element        →     timelineStore
                           Update Angle                 (clip.rotation)

Mouse Wheel         →      Zoom Canvas           →     editorStore
                           Recalculate Grid             (canvasTransform)

Middle Mouse Drag   →      Pan Canvas            →     editorStore
                           Update Viewport              (canvasTransform)

Shift + Click       →      Multi-Select          →     selectionStore
                           Add to Selection

Drag Empty Area     →      Box Selection         →     selectionStore
                           Show Selection Box

Ctrl/Cmd + A        →      Select All            →     selectionStore
                           Update Selection

Delete Key          →      Delete Selected       →     timelineStore
                           Remove Elements              (remove clips)
```

## Component Responsibilities

```
EditorCanvas
├── Manages mouse events
├── Handles drag states
├── Coordinates rendering
└── Provides info overlay

CanvasElement
├── Renders individual elements
├── Handles element-specific styling
├── Shows locked indicator
└── Displays selection outline

TransformControls
├── Renders resize handles
├── Renders rotation handle
├── Shows bounding box
└── Displays size/rotation info

SelectionBox
├── Shows box selection area
└── Visual feedback during drag

GridOverlay
├── Renders grid lines
├── Shows rulers
├── Displays origin markers
└── Adapts to zoom level
```

## Hook Responsibilities

```
useCanvas
├── Coordinate conversion
├── Zoom operations
├── Pan operations
├── Element manipulation
│   ├── Move
│   ├── Resize
│   └── Rotate
└── View operations

useSelection
├── Element selection
├── Multi-select
├── Box selection
├── Selection bounds
├── Keyboard shortcuts
└── Bulk operations
    ├── Select all
    ├── Delete
    ├── Duplicate
    └── Group
```

## Data Flow

```
┌─────────────┐
│ User Input  │ (Mouse/Keyboard)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│EditorCanvas │ (Event Handlers)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Hooks     │ (useCanvas/useSelection)
└──────┬──────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│editorStore │ │timelineStore│selectionStore
└──────┬─────┘ └──────┬─────┘ └──────┬─────┘
       │              │              │
       └──────────────┴──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │  Re-render   │
              └──────────────┘
```

## State Management

```
editorStore
├── canvasTransform
│   ├── zoom: number (0.1 - 5.0)
│   ├── panX: number
│   └── panY: number
├── project
│   ├── width: number
│   ├── height: number
│   └── backgroundColor: string
└── currentTool: Tool

timelineStore
├── tracks[]
│   └── clips[]
│       ├── position: {x, y}
│       ├── scale: {x, y}
│       └── rotation: number

selectionStore
├── selectedElementIds: Set<string>
├── selectedClipIds: Set<string>
├── selectionBox: {x, y, width, height}
├── isSelecting: boolean
├── multiSelectMode: boolean
├── hoveredElementId: string | null
└── activeTransformHandle: string | null
```

## Coordinate Systems

```
Screen Space                Canvas Space
(Viewport)                  (Project)
┌──────────────┐            ┌─────────────┐
│              │            │             │
│  Mouse XY    │  ──────►   │ Element XY  │
│              │ Convert    │             │
│  Zoom 150%   │            │  1920×1080  │
│  Pan 100,50  │            │             │
└──────────────┘            └─────────────┘

Formula:
  canvasX = (screenX - panX) / zoom
  canvasY = (screenY - panY) / zoom

  screenX = canvasX * zoom + panX
  screenY = canvasY * zoom + panY
```

## Transform Controls Layout

```
        Rotation Handle
              ○
              │
              │
       ■──────┼──────■   ← Top handles
       │             │
       │             │
   ■───┤   Element   ├───■  ← Middle handles
       │             │
       │             │
       ■─────────────■   ← Bottom handles

Handle Positions:
  topLeft, topCenter, topRight
  middleLeft, middleRight
  bottomLeft, bottomCenter, bottomRight
  rotation (above topCenter)
```

## Resize Handle Cursors

```
nw-resize    n-resize    ne-resize
    ↖           ↑           ↗
         ┌─────────┐
w-resize │         │ e-resize
    ←    │         │    →
         └─────────┘
    ↙           ↓           ↘
sw-resize    s-resize    se-resize

Cursors adjust based on element rotation
```

## Grid Overlay Structure

```
┌────────────────────────────────────┐
│ 0  100  200  300  400  500  600    │ ← Horizontal Ruler
├────────────────────────────────────┤
│ │  ┊   ┊   ┊   ┊   ┊   ┊          │
│ 100  ┊   ┊   ┊   ┊   ┊   ┊        │ ← Vertical Ruler
│ │  ┊   ┊   ┊   ┊   ┊   ┊          │
│ 200  ┊   ┊   ┊   ┊   ┊   ┊        │
│ │  ┊   ┊   ┊   ┊   ┊   ┊          │
│ 300  ┊   ┊   ┊   ┊   ┊   ┊        │
│ │                                  │
└────────────────────────────────────┘

┊ = Grid Line (50px intervals)
│ = Origin Line (0,0 position)
Numbers = Ruler Marks
```

## Element Types

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Image     │  │    Text     │  │   Shape     │  │   Video     │
│             │  │             │  │             │  │             │
│  [Picture]  │  │   Sample    │  │   ████████  │  │  [▶ Play]  │
│             │  │   Text      │  │   ████████  │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
     ↓                 ↓                 ↓                 ↓
  Filters          Styling          Fill/Stroke       Playback
```

## Performance Optimization

```
Rendering Strategy
├── requestAnimationFrame
│   └── Smooth 60fps updates
├── CSS Transforms
│   └── Hardware acceleration
├── Memoized Calculations
│   ├── Grid lines
│   └── Ruler marks
├── Conditional Rendering
│   ├── Grid density check
│   └── Invisible elements
└── Ref-based State
    └── Drag operations
```

## Event Flow

```
MouseDown
    │
    ├─ On Element → Start Drag
    │                  │
    │                  └─→ Store start position
    │
    ├─ On Handle → Start Transform
    │                 │
    │                 └─→ Store handle type
    │
    ├─ On Empty → Start Box Select
    │                │
    │                └─→ Create selection box
    │
    └─ Middle Button → Start Pan
                        │
                        └─→ Store start pan

MouseMove
    │
    ├─ Dragging → Update Element Position
    ├─ Transforming → Update Element Size/Rotation
    ├─ Box Selecting → Update Selection Box
    └─ Panning → Update Canvas Pan

MouseUp
    │
    └─→ End Current Operation
        └─→ Clear temporary state

Wheel
    │
    └─→ Zoom Canvas
        └─→ Adjust around cursor
```

## Keyboard Shortcuts Flow

```
KeyDown
    │
    ├─ Shift → Enable Multi-Select Mode
    │
    ├─ Ctrl/Cmd + A → Select All Elements
    │
    ├─ Delete → Delete Selected Elements
    │
    ├─ Ctrl/Cmd + D → Duplicate Selected
    │
    └─ Escape → Clear All Selections

KeyUp
    │
    └─ Shift → Disable Multi-Select Mode
```

## Integration Points

```
External Systems
    │
    ├─→ Timeline Store
    │   └─ Clips become canvas elements
    │
    ├─→ Editor Store
    │   └─ Canvas transform & project settings
    │
    ├─→ Selection Store
    │   └─ Selection state management
    │
    └─→ History Store (future)
        └─ Undo/redo operations
```

## Browser Rendering Pipeline

```
React Component Tree
        ↓
   Virtual DOM Diff
        ↓
   Real DOM Update
        ↓
   CSS Transform Apply
        ↓
Browser Compositor (GPU)
        ↓
   Screen Pixels
```

This visual guide complements the detailed documentation and provides a quick reference for understanding the Canvas system architecture and interactions.
