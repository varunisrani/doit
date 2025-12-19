# Properties Panel System - Phase 5

A comprehensive properties panel system for the video editor, providing real-time element manipulation and management.

## Components

### 1. PropertiesPanel
The main properties panel that displays element properties based on selection.

**Features:**
- Shows properties for selected canvas elements
- Handles single and multiple selections
- Collapsible sections for better organization
- Real-time updates to canvas elements
- Element info display (name, type, ID)
- Visibility and lock toggles

**Usage:**
```tsx
import { PropertiesPanel } from '@/app/components/panels';

function Editor() {
  return (
    <div className="flex h-screen">
      {/* Main canvas area */}
      <div className="flex-1">
        {/* Canvas content */}
      </div>

      {/* Properties Panel - Right sidebar */}
      <PropertiesPanel />
    </div>
  );
}
```

### 2. TransformSection
Handles element transform properties (position, size, rotation, scale).

**Features:**
- Position inputs (X, Y)
- Size inputs (Width, Height) with aspect ratio lock
- Rotation control with reset button
- Scale controls (X, Y)
- Flip toggles (X, Y)
- Real-time updates

**Props:**
```typescript
interface TransformSectionProps {
  transform: Transform;
  onUpdate: (updates: Partial<Transform>) => void;
  disabled?: boolean;
}
```

### 3. StyleSection
Manages element styling properties.

**Features:**
- Opacity slider (0-100%)
- Blend mode dropdown (16 modes)
- Border controls:
  - Width
  - Radius
  - Style (solid, dashed, dotted)
  - Color
- Shadow controls:
  - Color
  - Blur
  - Offset X/Y
  - Spread
  - Add/Remove shadow

**Props:**
```typescript
interface StyleSectionProps {
  style: ElementStyle;
  onUpdate: (updates: Partial<ElementStyle>) => void;
  disabled?: boolean;
}
```

### 4. TextSection
Specific properties for text elements.

**Features:**
- Text content editor (textarea)
- Font family dropdown (19 common fonts)
- Font size input
- Font weight selector (9 weights)
- Text color picker
- Text alignment buttons (left, center, right, justify)
- Line height control
- Letter spacing control
- Background color (optional)
- Style toggles (italic, underline)

**Props:**
```typescript
interface TextSectionProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
  disabled?: boolean;
}
```

### 5. MediaPanel
Media library for managing project assets.

**Features:**
- File upload (drag & drop or button)
- Asset grid display with thumbnails
- Asset info (size, duration, dimensions)
- Drag assets to timeline/canvas
- Delete assets
- Supports image, video, and audio files
- Object URL management for memory efficiency

**Usage:**
```tsx
import { MediaPanel } from '@/app/components/panels';

function Editor() {
  return (
    <div className="flex h-screen">
      {/* Left sidebar - Media Library */}
      <MediaPanel />

      {/* Main canvas area */}
      <div className="flex-1">
        {/* Canvas content */}
      </div>
    </div>
  );
}
```

### 6. LayersPanel
Manages canvas element layers (z-index ordering).

**Features:**
- List all canvas elements
- Sorted by z-index (top to bottom)
- Drag to reorder layers
- Visibility toggle per layer
- Lock toggle per layer
- Multi-selection support (Ctrl/Cmd+Click)
- Visual feedback for selection and drag states
- Element type icons

**Usage:**
```tsx
import { LayersPanel } from '@/app/components/panels';

function Editor() {
  return (
    <div className="flex h-screen">
      {/* Main canvas area */}
      <div className="flex-1">
        {/* Canvas content */}
      </div>

      {/* Right sidebar - Layers */}
      <LayersPanel />
    </div>
  );
}
```

## Store Integration

All panels integrate with Zustand stores:

- **useCanvasStore**: Manages canvas elements
- **useSelectionStore**: Manages element selection
- **useEditorStore**: Manages project assets and settings

### Canvas Store (New)

Created in `app/lib/store/canvasStore.ts`:

```typescript
import { useCanvasStore } from '@/app/lib/store/canvasStore';

// Get elements
const elements = useCanvasStore((state) => state.elements);

// Update element
const updateElement = useCanvasStore((state) => state.updateElement);
updateElement(elementId, { name: 'New Name' });

// Update transform
const updateElementTransform = useCanvasStore((state) => state.updateElementTransform);
updateElementTransform(elementId, { x: 100, y: 50 });

// Update style
const updateElementStyle = useCanvasStore((state) => state.updateElementStyle);
updateElementStyle(elementId, { opacity: 0.5 });
```

## Complete Layout Example

```tsx
import {
  PropertiesPanel,
  MediaPanel,
  LayersPanel
} from '@/app/components/panels';

function VideoEditor() {
  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Left Sidebar - Media Library */}
      <div className="w-80">
        <MediaPanel />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-zinc-800">
          {/* Toolbar content */}
        </div>

        {/* Canvas and Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 bg-zinc-900">
            {/* Canvas content */}
          </div>

          {/* Timeline */}
          <div className="h-64 border-t border-zinc-800">
            {/* Timeline content */}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Layers and Properties */}
      <div className="w-80 flex flex-col">
        <div className="h-1/2 border-b border-zinc-800">
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

## Styling

All panels use consistent dark theme styling:

- Background: `bg-zinc-900`
- Borders: `border-zinc-800`
- Text: `text-white` (primary), `text-zinc-400` (secondary)
- Inputs: `bg-zinc-800 border-zinc-700`
- Hover states: `hover:bg-zinc-700`
- Focus: `focus:ring-2 focus:ring-blue-500`

## Features

### Real-time Updates
All property changes immediately update the canvas through the store.

### Multiple Selection Support
When multiple elements are selected:
- Properties panel shows a notice
- Changes apply to all selected elements
- Common properties are available

### Locked Elements
Locked elements:
- Cannot be modified
- Inputs are disabled
- Visual indication in layers panel

### Collapsible Sections
PropertiesPanel uses collapsible sections:
- Transform (default: open)
- Style (default: open)
- Text Properties (default: open, text only)
- Image Properties (default: closed, images only)
- Shape Properties (default: closed, shapes only)

### Responsive Design
All panels are designed for desktop use with:
- Fixed widths (320px for sidebars)
- Scrollable content areas
- Compact controls for space efficiency

## Type Safety

All components are fully typed with TypeScript:
- Element types from `@/app/types/elements`
- Store types from respective store files
- UI component types from `@/app/components/ui`

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Tooltips for icon buttons
- Disabled state handling
- Focus management
