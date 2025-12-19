# Canvas System - Quick Start Guide

## Installation

No additional dependencies needed - uses existing project setup.

## Basic Usage

### 1. Import the Canvas

```tsx
import { EditorCanvas } from '@/app/components/canvas';
```

### 2. Use in Your Component

```tsx
export default function Editor() {
  return (
    <div className="w-full h-screen">
      <EditorCanvas />
    </div>
  );
}
```

### 3. Customize Settings

```tsx
<EditorCanvas
  width={1920}
  height={1080}
  showGrid={true}
  gridSize={50}
  className="border-2 border-gray-700"
/>
```

## Using Hooks

### Canvas Operations

```tsx
import { useCanvas } from '@/app/hooks';

function MyComponent() {
  const {
    zoom,
    zoomCanvas,
    resetView,
    fitToElements,
  } = useCanvas();

  return (
    <div>
      <button onClick={() => zoomCanvas(0.1)}>Zoom In</button>
      <button onClick={() => zoomCanvas(-0.1)}>Zoom Out</button>
      <button onClick={resetView}>Reset</button>
      <div>Current Zoom: {(zoom * 100).toFixed(0)}%</div>
    </div>
  );
}
```

### Selection Operations

```tsx
import { useSelection } from '@/app/hooks';

function MyComponent() {
  const {
    getSelectedElements,
    selectAll,
    clearAll,
    deleteSelected,
  } = useSelection();

  const selectedCount = getSelectedElements().length;

  return (
    <div>
      <button onClick={selectAll}>Select All</button>
      <button onClick={clearAll}>Clear</button>
      <button onClick={deleteSelected}>Delete</button>
      <div>Selected: {selectedCount}</div>
    </div>
  );
}
```

## Mouse Controls

| Action | Control |
|--------|---------|
| Select | Left Click |
| Multi-Select | Shift + Left Click |
| Box Select | Drag on empty area |
| Move | Drag on element |
| Resize | Drag resize handle |
| Rotate | Drag rotation handle |
| Pan | Middle Mouse or Space + Drag |
| Zoom | Mouse Wheel |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Shift | Multi-select mode |
| Ctrl/Cmd + A | Select all |
| Delete/Backspace | Delete selected |
| Ctrl/Cmd + D | Duplicate selected |
| Escape | Clear selection |

## Adding Elements to Canvas

Elements come from the timeline store. Add clips with position data:

```tsx
import { useTimelineStore } from '@/app/lib/store';

function addElementToCanvas() {
  const { addClip } = useTimelineStore();

  addClip('track-id', {
    type: 'image',
    name: 'My Image',
    startTime: 0,
    duration: 10,
    position: { x: 100, y: 100 },
    scale: { x: 1, y: 1 },
    rotation: 0,
  });
}
```

## Component Hierarchy

```
EditorCanvas
├── GridOverlay (optional grid & rulers)
├── Canvas Content (transformed)
│   ├── Background
│   ├── CanvasElement (for each element)
│   └── TransformControls (for selected elements)
└── SelectionBox (when box selecting)
```

## Working with Elements

### Get All Elements

```tsx
const { getAllElements } = useSelection();
const elements = getAllElements();
```

### Get Selected Elements

```tsx
const { getSelectedElementsData } = useSelection();
const selected = getSelectedElementsData();
```

### Move Element Programmatically

```tsx
const { moveElement } = useCanvas();
moveElement('element-id', 50, 50, element);
```

### Resize Element

```tsx
const { resizeElement } = useCanvas();
resizeElement(element, 'bottomRight', { x: 10, y: 10 });
```

### Rotate Element

```tsx
const { rotateElement } = useCanvas();
rotateElement(element, Math.PI / 4); // 45 degrees
```

## Coordinate Conversion

```tsx
const { screenToCanvas, canvasToScreen } = useCanvas();

// Mouse position to canvas coordinates
const canvasPoint = screenToCanvas(mouseX, mouseY);

// Canvas coordinates to screen position
const screenPoint = canvasToScreen(elementX, elementY);
```

## Complete Example

```tsx
'use client';

import { EditorCanvas } from '@/app/components/canvas';
import { useCanvas, useSelection } from '@/app/hooks';
import { useTimelineStore } from '@/app/lib/store';

export default function VideoEditor() {
  const { zoom, resetView } = useCanvas();
  const { selectAll, getSelectedElements } = useSelection();
  const { addTrack, addClip } = useTimelineStore();

  // Add a sample element
  const addSampleImage = () => {
    // First, ensure we have a track
    addTrack({ name: 'Layer 1', type: 'video' });

    // Then add a clip
    addClip('track-id', {
      type: 'image',
      name: 'Sample Image',
      startTime: 0,
      duration: 10,
      position: { x: 100, y: 100 },
      scale: { x: 1, y: 1 },
      rotation: 0,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 bg-gray-800 text-white">
        <button
          onClick={addSampleImage}
          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Image
        </button>
        <button
          onClick={selectAll}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Select All
        </button>
        <button
          onClick={resetView}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Reset View
        </button>
        <div className="ml-auto">
          Selected: {getSelectedElements().length} | Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <EditorCanvas showGrid={true} gridSize={50} />
      </div>
    </div>
  );
}
```

## Styling

All components use inline styles for precise control. To customize:

### Canvas Background

Controlled by `project.backgroundColor` in editorStore.

### Selection Color

Edit `SelectionBox.tsx` and `CanvasElement.tsx` border colors.

### Handle Colors

Edit `TransformControls.tsx` handle background colors.

### Grid Color

Edit `GridOverlay.tsx` line stroke colors.

## Troubleshooting

### Elements Not Showing

- Ensure clips have `position` property
- Check `visible` property is true
- Verify elements are within canvas bounds
- Check z-index ordering

### Selection Not Working

- Ensure elements aren't locked
- Check `locked` property on elements
- Verify mouse events are firing
- Check selection store state

### Transform Issues

- Verify element has valid width/height
- Check rotation value is in radians
- Ensure scale values are positive
- Verify handle positions are calculated

### Performance Issues

- Reduce grid density
- Disable grid for many elements
- Check for unnecessary re-renders
- Use React DevTools Profiler

## Next Steps

1. Add elements to timeline
2. Implement actual element creation (image upload, text tools, etc.)
3. Connect to undo/redo system
4. Add layers panel
5. Implement export functionality
6. Add effects and filters UI
7. Implement timeline synchronization

## Support

For issues or questions:
- Check `CANVAS_SYSTEM_COMPLETE.md` for detailed docs
- Review store structure in `app/lib/store/`
- Check canvas utilities in `app/lib/canvas/`
