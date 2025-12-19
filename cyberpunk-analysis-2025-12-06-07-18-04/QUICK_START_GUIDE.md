# Quick Start Guide - Text & Shapes System

## Getting Started in 5 Minutes

### Step 1: View the Demo
Navigate to the demo page to see everything in action:
```
http://localhost:3000/tools-demo
```

### Step 2: Try the Keyboard Shortcuts
Once on the demo page, try these shortcuts:

**Tool Switching:**
- Press `T` - Switch to Text Tool
- Press `S` - Switch to Shape Tool
- Press `V` - Switch to Select Tool
- Press `Z` - Switch to Zoom Tool

**Zoom Controls:**
- Press `Ctrl + Plus` - Zoom In
- Press `Ctrl + Minus` - Zoom Out
- Press `Ctrl + 0` - Reset to 100%

**Edit Operations:**
- Select an element and press `Delete` - Delete it
- Select an element and press `Ctrl + C` then `Ctrl + V` - Duplicate it

### Step 3: Add Your First Text
1. Press `T` to activate Text Tool
2. Type some text in the "Text Content" field
3. Choose a font and size
4. Click "Add Text"
5. Your text appears on the canvas!

### Step 4: Add Your First Shape
1. Press `S` to activate Shape Tool
2. Click one of the shape type buttons (Rectangle, Circle, etc.)
3. Click a preset size (Small, Medium, Large)
4. Your shape appears on the canvas!

### Step 5: Edit Elements
1. Press `V` to activate Select Tool
2. Click on any element to select it
3. Drag to move it
4. Edit properties in the tool panel

---

## Integration Guide

### Basic Setup

#### 1. Create a simple video editor page:

```tsx
'use client';

import { useState } from 'react';
import { Toolbar, TextTool, ShapeTool, SelectTool, ToolType } from '@/app/components/tools';
import { useKeyboard } from '@/app/hooks/useKeyboard';

export default function MyVideoEditor() {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [elements, setElements] = useState([]);

  // Setup keyboard shortcuts
  useKeyboard({
    onToolChange: setActiveTool,
    onDelete: () => {
      // Delete selected element
    },
  });

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Toolbar at the top */}
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />

      <div className="flex flex-1">
        {/* Tool panel on the left */}
        <div className="w-80 p-4">
          {activeTool === 'text' && (
            <TextTool onAddText={(text) => setElements([...elements, text])} />
          )}
          {activeTool === 'shape' && (
            <ShapeTool onAddShape={(shape) => setElements([...elements, shape])} />
          )}
          {activeTool === 'select' && <SelectTool />}
        </div>

        {/* Canvas in the center */}
        <div className="flex-1 bg-gray-800">
          {/* Your canvas here */}
        </div>
      </div>
    </div>
  );
}
```

#### 2. Handle Element State

```tsx
'use client';

import { useState } from 'react';

// Define your element types
type TextElement = {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  // ... other properties
};

type ShapeElement = {
  id: string;
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  // ... other properties
};

type CanvasElement = TextElement | ShapeElement;

export default function MyEditor() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Add element
  const addElement = (element: CanvasElement) => {
    setElements([...elements, element]);
    setSelectedId(element.id);
  };

  // Update element
  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  // Delete element
  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Move element
  const moveElement = (id: string, x: number, y: number) => {
    updateElement(id, { x, y });
  };

  // ... rest of your component
}
```

#### 3. Render Elements on Canvas

```tsx
const renderElement = (element: CanvasElement) => {
  const isSelected = element.id === selectedId;

  if (element.type === 'text') {
    return (
      <div
        key={element.id}
        onClick={() => setSelectedId(element.id)}
        onDoubleClick={() => setActiveTool('text')}
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          fontSize: element.fontSize,
          color: element.color,
          cursor: 'pointer',
          outline: isSelected ? '2px solid #3b82f6' : 'none',
          padding: '4px',
          userSelect: 'none',
        }}
      >
        {element.text}
      </div>
    );
  }

  if (element.type === 'shape') {
    return (
      <div
        key={element.id}
        onClick={() => setSelectedId(element.id)}
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          backgroundColor: element.fillColor,
          borderRadius: element.shapeType === 'circle' ? '50%' : 0,
          cursor: 'pointer',
          outline: isSelected ? '2px solid #3b82f6' : 'none',
        }}
      />
    );
  }
};

// In your canvas div:
<div className="relative w-full h-full">
  {elements.map(renderElement)}
</div>
```

---

## Common Use Cases

### Use Case 1: Add Text Overlay to Video

```tsx
import { TextTool } from '@/app/components/tools';

function VideoWithText() {
  const [textOverlays, setTextOverlays] = useState([]);

  const handleAddText = (textElement) => {
    // Add text to the video
    setTextOverlays([...textOverlays, {
      ...textElement,
      timestamp: currentVideoTime, // When to show this text
      duration: 5, // Show for 5 seconds
    }]);
  };

  return (
    <TextTool
      onAddText={handleAddText}
    />
  );
}
```

### Use Case 2: Create Shape Annotations

```tsx
import { ShapeTool } from '@/app/components/tools';

function VideoAnnotation() {
  const [shapes, setShapes] = useState([]);

  const handleAddShape = (shape) => {
    // Add shape annotation
    setShapes([...shapes, {
      ...shape,
      timestamp: currentVideoTime,
    }]);
  };

  return (
    <ShapeTool
      onAddShape={handleAddShape}
    />
  );
}
```

### Use Case 3: Crop Video Frame

```tsx
import { CropTool } from '@/app/components/tools';

function VideoCropper() {
  const [cropArea, setCropArea] = useState(null);

  const handleApplyCrop = (id, crop) => {
    // Apply crop to video
    setCropArea(crop);
    applyCropToVideo(crop);
  };

  return (
    <CropTool
      targetElement={videoFrame}
      onApplyCrop={handleApplyCrop}
      onCancelCrop={() => setCropArea(null)}
    />
  );
}
```

### Use Case 4: Zoom Canvas for Precision Editing

```tsx
import { ZoomTool } from '@/app/components/tools';

function PrecisionEditor() {
  const [zoom, setZoom] = useState(1);

  return (
    <>
      <ZoomTool
        zoom={zoom}
        onZoomChange={setZoom}
        onFitToScreen={() => setZoom(0.8)}
        onActualSize={() => setZoom(1)}
      />

      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Your canvas content */}
      </div>
    </>
  );
}
```

---

## Advanced Techniques

### 1. Implement Drag to Move

```tsx
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

const handleMouseDown = (e, element) => {
  setIsDragging(true);
  setDragStart({ x: e.clientX - element.x, y: e.clientY - element.y });
};

const handleMouseMove = (e) => {
  if (!isDragging) return;

  const newX = e.clientX - dragStart.x;
  const newY = e.clientY - dragStart.y;

  updateElement(selectedId, { x: newX, y: newY });
};

const handleMouseUp = () => {
  setIsDragging(false);
};
```

### 2. Implement Undo/Redo

```tsx
const [history, setHistory] = useState<CanvasElement[][]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);

const addToHistory = (newElements: CanvasElement[]) => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(newElements);
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};

const undo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setElements(history[historyIndex - 1]);
  }
};

const redo = () => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(historyIndex + 1);
    setElements(history[historyIndex + 1]);
  }
};

useKeyboard({
  onUndo: undo,
  onRedo: redo,
});
```

### 3. Save and Load Projects

```tsx
const saveProject = () => {
  const project = {
    version: '1.0',
    elements,
    zoom,
    canvasSize: { width: 1920, height: 1080 },
  };

  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.json';
  a.click();
};

const loadProject = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const project = JSON.parse(e.target?.result as string);
    setElements(project.elements);
    setZoom(project.zoom);
  };
  reader.readAsText(file);
};
```

---

## Performance Tips

### 1. Optimize Rendering
```tsx
import { memo } from 'react';

const CanvasElement = memo(({ element, isSelected, onClick }) => {
  // ... render logic
}, (prevProps, nextProps) => {
  // Only re-render if these properties changed
  return (
    prevProps.element === nextProps.element &&
    prevProps.isSelected === nextProps.isSelected
  );
});
```

### 2. Debounce Expensive Operations
```tsx
import { debounce } from 'lodash';

const debouncedUpdate = debounce((id, updates) => {
  updateElement(id, updates);
}, 100);
```

### 3. Virtual Rendering for Many Elements
```tsx
// Only render elements visible in viewport
const visibleElements = elements.filter(el => {
  return (
    el.x + el.width > viewportX &&
    el.x < viewportX + viewportWidth &&
    el.y + el.height > viewportY &&
    el.y < viewportY + viewportHeight
  );
});
```

---

## Styling Customization

### Change Theme Colors

```tsx
// Override default colors in your component
<TextTool
  className="bg-slate-800" // Instead of bg-gray-800
  accentColor="emerald" // For buttons and highlights
/>
```

### Custom Button Styles

```tsx
// Wrap tools in a custom styled container
<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
  <TextTool {...props} />
</div>
```

---

## Troubleshooting

### Problem: Elements not appearing
**Solution:** Check that elements have valid x, y, width, height values and position: absolute

### Problem: Keyboard shortcuts conflict with browser
**Solution:** Use event.preventDefault() in the useKeyboard hook

### Problem: Zoom makes canvas too small/large
**Solution:** Set min/max limits: `const zoom = Math.max(0.1, Math.min(5, newZoom))`

### Problem: Can't select elements
**Solution:** Ensure elements have cursor: pointer and onClick handlers

---

## Next Steps

1. **Add Timeline Integration** - Sync elements with video timeline
2. **Implement Layers Panel** - Z-index management and visibility
3. **Add Animation** - Keyframes and transitions
4. **Export Functionality** - Render to video or image
5. **Collaboration** - Real-time multi-user editing

---

## Resources

- **Demo Page:** `/tools-demo`
- **Full Documentation:** `PHASE_6_TEXT_SHAPES_TOOLS.md`
- **Example Component:** `app/components/tools/CanvasEditor.tsx`

---

## Support

For issues or questions:
1. Check the full documentation
2. Review the example implementations
3. Test with the demo page

Happy editing!
