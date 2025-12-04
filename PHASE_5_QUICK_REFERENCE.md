# Phase 5 - Properties Panel System - Quick Reference

## Import and Use

```tsx
// Import all panels
import {
  PropertiesPanel,
  TransformSection,
  StyleSection,
  TextSection,
  MediaPanel,
  LayersPanel
} from '@/app/components/panels';

// Import stores
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import { useEditorStore } from '@/app/lib/store/editorStore';
```

## Component Quick Reference

### PropertiesPanel
```tsx
<PropertiesPanel />
```
**Width:** 320px
**Features:** Auto-detects selected elements and shows relevant properties

### MediaPanel
```tsx
<MediaPanel />
```
**Width:** 320px
**Features:** Upload, manage, and drag assets

### LayersPanel
```tsx
<LayersPanel />
```
**Width:** 320px
**Features:** Reorder, toggle visibility, lock layers

### TransformSection
```tsx
<TransformSection
  transform={element.transform}
  onUpdate={(updates) => updateElementTransform(id, updates)}
  disabled={false}
/>
```

### StyleSection
```tsx
<StyleSection
  style={element.style}
  onUpdate={(updates) => updateElementStyle(id, updates)}
  disabled={false}
/>
```

### TextSection
```tsx
<TextSection
  element={textElement}
  onUpdate={(updates) => updateElement(id, updates)}
  disabled={false}
/>
```

## Store Actions Quick Reference

### Canvas Store
```tsx
const {
  elements,
  addElement,
  removeElement,
  updateElement,
  updateElementTransform,
  updateElementStyle,
  duplicateElement,
  bringToFront,
  sendToBack,
} = useCanvasStore();
```

### Selection Store
```tsx
const {
  selectedElementIds,
  selectElement,
  selectElements,
  clearElementSelection,
  getSelectedElements,
} = useSelectionStore();
```

### Editor Store (Assets)
```tsx
const {
  assets,
  addAsset,
  removeAsset,
  updateAsset,
} = useEditorStore();
```

## Typical Layout

```tsx
function VideoEditor() {
  return (
    <div className="flex h-screen">
      {/* Left - Media */}
      <MediaPanel />

      {/* Center - Canvas */}
      <div className="flex-1">
        <Canvas />
        <Timeline />
      </div>

      {/* Right - Layers & Properties */}
      <div className="w-80 flex flex-col">
        <div className="h-1/2">
          <LayersPanel />
        </div>
        <div className="h-1/2">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
```

## Common Operations

### Create and Add Element
```tsx
import { useCanvasStore } from '@/app/lib/store/canvasStore';

const addElement = useCanvasStore((state) => state.addElement);

const newElement: TextElement = {
  id: crypto.randomUUID(),
  type: 'text',
  name: 'My Text',
  content: 'Hello World',
  fontFamily: 'Arial',
  fontSize: 24,
  fontWeight: 400,
  fontStyle: 'normal',
  textDecoration: 'none',
  color: '#ffffff',
  textAlign: 'left',
  verticalAlign: 'top',
  lineHeight: 1.2,
  letterSpacing: 0,
  wordSpacing: 0,
  autoSize: true,
  transform: {
    x: 100,
    y: 100,
    width: 200,
    height: 50,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    anchorX: 0.5,
    anchorY: 0.5,
    flipX: false,
    flipY: false,
  },
  style: {
    opacity: 1,
    blendMode: 'normal',
    zIndex: 0,
  },
  filters: [],
  locked: false,
  visible: true,
};

addElement(newElement);
```

### Update Element Transform
```tsx
const updateElementTransform = useCanvasStore(
  (state) => state.updateElementTransform
);

updateElementTransform(elementId, {
  x: 150,
  y: 200,
  rotation: 45,
});
```

### Update Element Style
```tsx
const updateElementStyle = useCanvasStore(
  (state) => state.updateElementStyle
);

updateElementStyle(elementId, {
  opacity: 0.5,
  blendMode: 'multiply',
  shadow: {
    color: '#000000',
    blur: 10,
    offsetX: 5,
    offsetY: 5,
  },
});
```

### Handle Selection
```tsx
const selectElement = useSelectionStore((state) => state.selectElement);
const getSelectedElements = useSelectionStore((state) => state.getSelectedElements);

// Select an element
selectElement(elementId);

// Get selected IDs
const selectedIds = getSelectedElements();
```

### Upload Asset
```tsx
const addAsset = useEditorStore((state) => state.addAsset);

const handleFileUpload = async (file: File) => {
  const url = URL.createObjectURL(file);

  const asset: Asset = {
    id: crypto.randomUUID(),
    name: file.name,
    type: 'image',
    url,
    thumbnail: url,
    size: file.size,
    createdAt: Date.now(),
  };

  addAsset(asset);
};
```

## Keyboard Shortcuts (Suggested)

| Action | Shortcut |
|--------|----------|
| Select Multiple | Ctrl/Cmd + Click |
| Delete Element | Delete/Backspace |
| Duplicate | Ctrl/Cmd + D |
| Bring to Front | Ctrl/Cmd + Shift + ] |
| Send to Back | Ctrl/Cmd + Shift + [ |
| Toggle Lock | Ctrl/Cmd + L |
| Toggle Visibility | Ctrl/Cmd + H |

## Element Types

### Text Element
Required properties:
- content, fontFamily, fontSize, fontWeight, color, textAlign, lineHeight, letterSpacing

### Image Element
Required properties:
- src, naturalWidth, naturalHeight

### Shape Element
Required properties:
- shapeType, fillColor

### Video Element
Required properties:
- src, duration, currentTime

## Blend Modes Available

1. normal
2. multiply
3. screen
4. overlay
5. darken
6. lighten
7. color-dodge
8. color-burn
9. hard-light
10. soft-light
11. difference
12. exclusion
13. hue
14. saturation
15. color
16. luminosity

## Font Families Available

Arial, Helvetica, Times New Roman, Georgia, Courier New, Verdana, Trebuchet MS, Impact, Comic Sans MS, Palatino, Garamond, Bookman, Avant Garde, Roboto, Open Sans, Lato, Montserrat, Poppins, Inter

## Font Weights Available

100 (Thin), 200 (Extra Light), 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi Bold), 700 (Bold), 800 (Extra Bold), 900 (Black)

## Color Format

All colors use hex format: `#RRGGBB` (e.g., `#ff0000` for red)

## File Size Reference

| Component | Lines | Size |
|-----------|-------|------|
| PropertiesPanel | 286 | ~11.3 KB |
| MediaPanel | 248 | ~8.2 KB |
| LayersPanel | 201 | ~6.9 KB |
| TextSection | 227 | ~7.4 KB |
| StyleSection | 213 | ~6.1 KB |
| TransformSection | 183 | ~5.7 KB |
| canvasStore | 142 | ~3.8 KB |
| **Total** | **1,507** | **~50 KB** |
