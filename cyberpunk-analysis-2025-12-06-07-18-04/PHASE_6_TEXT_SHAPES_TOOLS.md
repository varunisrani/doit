# Phase 6: Text & Shapes System - Complete Documentation

## Overview
A comprehensive text and shapes editing system for a browser-based video editor, featuring multiple tools, keyboard shortcuts, and a rich editing experience.

## Files Created

### 1. **TextTool.tsx** (`app/components/tools/TextTool.tsx`)
Complete text editing tool with advanced features:

#### Features:
- **Rich Text Editing**
  - Font family selection (8 fonts)
  - Font size (8-200px)
  - Text color picker
  - Bold, Italic, Underline
  - Text alignment (Left, Center, Right)

- **Advanced Styling**
  - Text shadow with color and blur controls
  - Text outline/stroke with width and color
  - Real-time preview

- **Usage Example:**
```tsx
import { TextTool } from '@/app/components/tools';

<TextTool
  onAddText={(element) => console.log('New text:', element)}
  selectedElement={selectedTextElement}
  onUpdateText={(element) => console.log('Updated:', element)}
/>
```

#### Text Element Interface:
```typescript
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  textShadow?: string;
  textStroke?: { width: number; color: string };
}
```

---

### 2. **ShapeTool.tsx** (`app/components/tools/ShapeTool.tsx`)
Comprehensive shape drawing and editing tool.

#### Features:
- **Shape Types:**
  - Rectangle (with border radius)
  - Circle
  - Triangle
  - Line
  - Arrow

- **Quick Add Presets:**
  - Small (100×100)
  - Medium (200×150)
  - Large (300×200)

- **Styling Options:**
  - Fill color with toggle
  - Stroke color
  - Stroke width (0-20px)
  - Border radius for rectangles
  - Opacity control (0-100%)

- **Usage Example:**
```tsx
import { ShapeTool } from '@/app/components/tools';

<ShapeTool
  onAddShape={(shape) => console.log('New shape:', shape)}
  selectedShape={selectedShapeElement}
  onUpdateShape={(shape) => console.log('Updated:', shape)}
/>
```

#### Shape Element Interface:
```typescript
interface ShapeElement {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius?: number;
  opacity: number;
}
```

---

### 3. **Toolbar.tsx** (`app/components/tools/Toolbar.tsx`)
Main tool selection bar with visual indicators.

#### Tools Available:
1. **Select Tool (V)** - Select and move objects
2. **Text Tool (T)** - Add and edit text
3. **Shape Tool (S)** - Draw shapes
4. **Hand Tool (H)** - Pan around canvas
5. **Crop Tool (C)** - Crop video or images
6. **Zoom Tool (Z)** - Zoom controls

#### Features:
- Active tool indicator with glow effect
- Tooltips with descriptions
- Keyboard shortcut display
- Quick keyboard reference

- **Usage Example:**
```tsx
import { Toolbar, ToolType } from '@/app/components/tools';

const [activeTool, setActiveTool] = useState<ToolType>('select');

<Toolbar
  activeTool={activeTool}
  onToolChange={setActiveTool}
/>
```

---

### 4. **SelectTool.tsx** (`app/components/tools/SelectTool.tsx`)
Default selection and manipulation tool.

#### Features:
- **Element Information Display**
  - ID, Position, Size, Rotation

- **Transform Controls**
  - Position (X, Y inputs)
  - Size (Width, Height inputs)
  - Rotation slider (0-360°)

- **Actions**
  - Lock/Unlock element
  - Duplicate element
  - Delete element

- **Usage Example:**
```tsx
import { SelectTool } from '@/app/components/tools';

<SelectTool
  selectedElement={selectedElement}
  onMove={(id, x, y) => moveElement(id, x, y)}
  onResize={(id, w, h) => resizeElement(id, w, h)}
  onRotate={(id, rotation) => rotateElement(id, rotation)}
  onDelete={(id) => deleteElement(id)}
  onDuplicate={(id) => duplicateElement(id)}
  onLock={(id, locked) => lockElement(id, locked)}
/>
```

---

### 5. **CropTool.tsx** (`app/components/tools/CropTool.tsx`)
Professional crop tool with aspect ratio controls.

#### Features:
- **Aspect Ratio Presets:**
  - Free (no constraint)
  - 16:9 (widescreen)
  - 4:3 (standard)
  - 1:1 (square)
  - 9:16 (portrait)

- **Visual Aids:**
  - Grid overlay (Rule of Thirds)
  - Real-time crop preview
  - Dimension display

- **Controls:**
  - Drag to move crop area
  - Resize handles
  - Numeric input for precision
  - Reset to full size

- **Usage Example:**
```tsx
import { CropTool } from '@/app/components/tools';

<CropTool
  targetElement={elementToCrop}
  onApplyCrop={(id, cropArea) => applyCrop(id, cropArea)}
  onCancelCrop={() => cancelCrop()}
/>
```

---

### 6. **ZoomTool.tsx** (`app/components/tools/ZoomTool.tsx`)
Complete zoom control system.

#### Features:
- **Zoom Controls:**
  - Zoom In/Out buttons
  - Slider (10%-500%)
  - Custom percentage input

- **Quick Zoom Presets:**
  - 25%, 50%, 75%, 100%, 150%, 200%

- **Special Functions:**
  - Fit to Screen
  - Actual Size (100%)

- **Keyboard Shortcuts:**
  - Ctrl + Plus: Zoom In
  - Ctrl + Minus: Zoom Out
  - Ctrl + 0: Actual Size
  - Ctrl + 9: Fit to Screen

- **Usage Example:**
```tsx
import { ZoomTool } from '@/app/components/tools';

<ZoomTool
  zoom={zoomLevel}
  onZoomChange={(zoom) => setZoomLevel(zoom)}
  onFitToScreen={() => fitToScreen()}
  onActualSize={() => setZoomLevel(1)}
/>
```

---

### 7. **useKeyboard.ts** (`app/hooks/useKeyboard.ts`)
Global keyboard shortcut system.

#### Shortcut Categories:

**Tool Switching:**
- `V` - Select Tool
- `T` - Text Tool
- `S` - Shape Tool
- `H` - Hand Tool
- `C` - Crop Tool
- `Z` - Zoom Tool

**Playback:**
- `Space` - Play/Pause

**Edit Operations:**
- `Delete/Backspace` - Delete selected element
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+X` - Cut
- `Ctrl+Z` - Undo
- `Ctrl+Shift+Z` or `Ctrl+Y` - Redo
- `Ctrl+S` - Save
- `Ctrl+A` - Select All
- `Escape` - Deselect

**Zoom:**
- `Ctrl++` - Zoom In
- `Ctrl+-` - Zoom Out
- `Ctrl+0` - Actual Size
- `Ctrl+9` - Fit to Screen

#### Usage Example:
```tsx
import { useKeyboard } from '@/app/hooks/useKeyboard';

useKeyboard({
  onToolChange: (tool) => setActiveTool(tool),
  onPlayPause: () => togglePlayback(),
  onDelete: () => deleteSelected(),
  onCopy: () => copySelected(),
  onPaste: () => pasteClipboard(),
  onCut: () => cutSelected(),
  onUndo: () => undo(),
  onRedo: () => redo(),
  onSave: () => save(),
  onZoomIn: () => zoomIn(),
  onZoomOut: () => zoomOut(),
  onZoomActual: () => setZoom(1),
  onZoomFit: () => fitToScreen(),
  onSelectAll: () => selectAll(),
  onDeselect: () => deselect(),
  disabled: false, // Set to true to disable shortcuts
});
```

**Features:**
- Automatic input field detection (shortcuts disabled in text inputs)
- Modifier key support (Ctrl/Cmd)
- Customizable callbacks
- Can be disabled globally

---

### 8. **CanvasEditor.tsx** (`app/components/tools/CanvasEditor.tsx`)
Complete integration example showing all tools working together.

#### Features:
- Full canvas editor with all tools
- Element management (add, move, resize, delete)
- Zoom and pan
- Keyboard shortcuts integration
- Properties panel
- Responsive layout

---

## Installation & Setup

### 1. Install Dependencies
Make sure you have lucide-react installed:
```bash
npm install lucide-react
# or
yarn add lucide-react
```

### 2. Import Components
```tsx
import {
  Toolbar,
  TextTool,
  ShapeTool,
  SelectTool,
  CropTool,
  ZoomTool,
  ToolType,
  ShapeType,
  ShapeElement,
  SelectableElement
} from '@/app/components/tools';

import { useKeyboard, KEYBOARD_SHORTCUTS } from '@/app/hooks/useKeyboard';
```

### 3. Basic Implementation
```tsx
'use client';

import { useState } from 'react';
import { Toolbar, ToolType } from '@/app/components/tools';
import { useKeyboard } from '@/app/hooks/useKeyboard';

export default function VideoEditor() {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [zoom, setZoom] = useState(1);

  useKeyboard({
    onToolChange: setActiveTool,
    onZoomIn: () => setZoom(z => Math.min(5, z + 0.1)),
    onZoomOut: () => setZoom(z => Math.max(0.1, z - 0.1)),
  });

  return (
    <div className="h-screen flex flex-col">
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
      {/* Your canvas and tool panels here */}
    </div>
  );
}
```

---

## Styling

All components use **dark theme** styling with:
- Background: `bg-gray-800`, `bg-gray-900`
- Borders: `border-gray-700`, `border-gray-600`
- Text: `text-white`, `text-gray-300`, `text-gray-400`
- Accent colors:
  - Blue (`bg-blue-600`) - Select/Default
  - Purple (`bg-purple-600`) - Shapes
  - Green (`bg-green-600`) - Crop
  - Teal (`bg-teal-600`) - Zoom

---

## Best Practices

### 1. Element Management
```tsx
// Store all canvas elements in state
const [elements, setElements] = useState<CanvasElement[]>([]);

// Add element
const addElement = (element) => {
  setElements([...elements, element]);
};

// Update element
const updateElement = (updatedElement) => {
  setElements(elements.map(el =>
    el.id === updatedElement.id ? { ...el, ...updatedElement } : el
  ));
};

// Delete element
const deleteElement = (id) => {
  setElements(elements.filter(el => el.id !== id));
};
```

### 2. Canvas Rendering
```tsx
// Render elements on canvas
const renderElement = (element: CanvasElement) => {
  if (element.type === 'text') {
    return (
      <div
        key={element.id}
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          color: element.color,
          // ... other styles
        }}
      >
        {element.text}
      </div>
    );
  }
  // ... handle other element types
};
```

### 3. Keyboard Shortcut Customization
```tsx
// Disable shortcuts in specific contexts
const [shortcutsDisabled, setShortcutsDisabled] = useState(false);

useKeyboard({
  disabled: shortcutsDisabled,
  // ... other handlers
});
```

### 4. Zoom Implementation
```tsx
// Apply zoom to canvas
<div
  style={{
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
  }}
>
  {/* Canvas content */}
</div>
```

---

## Advanced Features

### Double-Click to Edit Text
```tsx
<div
  onDoubleClick={() => {
    setActiveTool('text');
    setSelectedElement(element);
  }}
>
  {element.text}
</div>
```

### Click and Drag to Draw Shapes
```tsx
const [isDrawing, setIsDrawing] = useState(false);
const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });

const handleMouseDown = (e) => {
  if (activeTool === 'shape') {
    setIsDrawing(true);
    setDrawStart({ x: e.clientX, y: e.clientY });
  }
};

const handleMouseUp = (e) => {
  if (isDrawing) {
    const width = Math.abs(e.clientX - drawStart.x);
    const height = Math.abs(e.clientY - drawStart.y);

    // Create shape with calculated dimensions
    addShape({ x: drawStart.x, y: drawStart.y, width, height });
    setIsDrawing(false);
  }
};
```

---

## Troubleshooting

### Issue: Keyboard shortcuts not working
**Solution:** Make sure shortcuts are not disabled and you're not focused on an input field.

### Issue: Elements not rendering
**Solution:** Ensure elements have `position: 'absolute'` and proper x/y coordinates.

### Issue: Zoom not working
**Solution:** Apply `transform: scale(zoom)` to the canvas container and set `transformOrigin: 'top left'`.

### Issue: Tools not switching
**Solution:** Verify the `activeTool` state is being updated correctly.

---

## Next Steps

1. **Implement Undo/Redo System**
   - Use a history stack to track changes
   - Implement time-travel debugging

2. **Add Layer System**
   - Z-index management
   - Layer visibility toggle
   - Layer locking

3. **Export Functionality**
   - Export canvas to image
   - Export to video
   - Save project as JSON

4. **Animation Support**
   - Keyframe animation
   - Transitions between states
   - Timeline integration

5. **Collaboration Features**
   - Real-time collaboration
   - Comments and annotations
   - Version control

---

## API Reference

### Toolbar Component
```typescript
interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}
```

### TextTool Component
```typescript
interface TextToolProps {
  onAddText: (element: TextElement) => void;
  selectedElement?: TextElement;
  onUpdateText?: (element: TextElement) => void;
}
```

### ShapeTool Component
```typescript
interface ShapeToolProps {
  onAddShape: (element: ShapeElement) => void;
  selectedShape?: ShapeElement;
  onUpdateShape?: (element: ShapeElement) => void;
  isDrawing?: boolean;
}
```

### SelectTool Component
```typescript
interface SelectToolProps {
  selectedElement?: SelectableElement;
  onMove?: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onRotate?: (id: string, rotation: number) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onLock?: (id: string, locked: boolean) => void;
}
```

### CropTool Component
```typescript
interface CropToolProps {
  targetElement?: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onApplyCrop?: (id: string, cropArea: CropArea) => void;
  onCancelCrop?: () => void;
}
```

### ZoomTool Component
```typescript
interface ZoomToolProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen?: () => void;
  onActualSize?: () => void;
}
```

### useKeyboard Hook
```typescript
interface KeyboardShortcuts {
  onToolChange?: (tool: ToolType) => void;
  onPlayPause?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomActual?: () => void;
  onZoomFit?: () => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
  disabled?: boolean;
}
```

---

## License
This code is part of the browser-based Video Editor application.

---

## Support
For questions or issues, please refer to the main project documentation.
