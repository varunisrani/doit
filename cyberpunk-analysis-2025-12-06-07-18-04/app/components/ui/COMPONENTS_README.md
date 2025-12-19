# Video Editor UI Components

A comprehensive set of reusable UI components built for a browser-based video editor application.

## Components Overview

### 1. Button (`Button.tsx`)
Versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- All standard button HTML attributes

**Usage:**
```tsx
import { Button } from '@/app/components/ui';

<Button variant="primary" size="md">Click Me</Button>
<Button variant="danger" onClick={handleDelete}>Delete</Button>
```

---

### 2. Slider (`Slider.tsx`)
Interactive range slider for adjusting values (volume, opacity, zoom, etc.)

**Props:**
- `value`: number - Current value
- `onChange`: (value: number) => void
- `min`: number (default: 0)
- `max`: number (default: 100)
- `step`: number (default: 1)
- `label`: string
- `showValue`: boolean (default: true)

**Usage:**
```tsx
import { Slider } from '@/app/components/ui';

<Slider
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  label="Volume"
/>
```

---

### 3. Dropdown (`Dropdown.tsx`)
Select/dropdown component with custom styling.

**Props:**
- `options`: Array of { value: string, label: string, disabled?: boolean }
- `value`: string - Selected value
- `onChange`: (value: string) => void
- `placeholder`: string
- `label`: string

**Usage:**
```tsx
import { Dropdown } from '@/app/components/ui';

<Dropdown
  options={[
    { value: '720p', label: '720p HD' },
    { value: '1080p', label: '1080p Full HD' },
    { value: '4k', label: '4K Ultra HD' }
  ]}
  value={resolution}
  onChange={setResolution}
  label="Export Quality"
/>
```

---

### 4. ColorPicker (`ColorPicker.tsx`)
Color picker with preset colors and custom hex input.

**Props:**
- `value`: string - Hex color value
- `onChange`: (color: string) => void
- `label`: string
- `presetColors`: string[] - Array of preset hex colors

**Usage:**
```tsx
import { ColorPicker } from '@/app/components/ui';

<ColorPicker
  value={backgroundColor}
  onChange={setBackgroundColor}
  label="Background Color"
/>
```

---

### 5. Input (`Input.tsx`)
Text input component with label, error states, and icon support.

**Props:**
- `label`: string
- `error`: string - Error message
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `fullWidth`: boolean
- All standard input HTML attributes

**Usage:**
```tsx
import { Input } from '@/app/components/ui';
import { Search } from 'lucide-react';

<Input
  label="Video Title"
  placeholder="Enter title..."
  leftIcon={<Search />}
  error={errors.title}
/>
```

---

### 6. Tooltip (`Tooltip.tsx`)
Tooltip wrapper component with positioning options.

**Props:**
- `content`: ReactNode - Tooltip content
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `delay`: number (default: 200ms)
- `disabled`: boolean

**Usage:**
```tsx
import { Tooltip } from '@/app/components/ui';

<Tooltip content="Export your video" position="top">
  <Button>Export</Button>
</Tooltip>
```

---

### 7. Modal (`Modal.tsx`)
Modal dialog component with customizable sizes.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean (default: true)
- `closeOnOverlayClick`: boolean (default: true)
- `closeOnEscape`: boolean (default: true)

**Usage:**
```tsx
import { Modal, ModalFooter } from '@/app/components/ui';

<Modal isOpen={isOpen} onClose={onClose} title="Export Settings">
  <div>Modal content here</div>
  <ModalFooter>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={handleExport}>Export</Button>
  </ModalFooter>
</Modal>
```

---

### 8. Tabs (`Tabs.tsx`)
Tab navigation component with multiple sections.

**Components:**
- `Tabs` - Container
- `TabsList` - Tab buttons container
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab panel content

**Usage:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui';

<Tabs defaultValue="video">
  <TabsList>
    <TabsTrigger value="video">Video</TabsTrigger>
    <TabsTrigger value="audio">Audio</TabsTrigger>
    <TabsTrigger value="effects">Effects</TabsTrigger>
  </TabsList>

  <TabsContent value="video">Video settings...</TabsContent>
  <TabsContent value="audio">Audio settings...</TabsContent>
  <TabsContent value="effects">Effects settings...</TabsContent>
</Tabs>
```

---

### 9. IconButton (`IconButton.tsx`)
Icon-only button for toolbars and compact UIs.

**Props:**
- `icon`: ReactNode - Icon component
- `variant`: 'default' | 'primary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `active`: boolean - Highlight as active state
- All standard button HTML attributes

**Usage:**
```tsx
import { IconButton } from '@/app/components/ui';
import { Play, Pause, SkipForward } from 'lucide-react';

<IconButton icon={<Play />} variant="primary" />
<IconButton icon={<Pause />} active={isPlaying} />
<IconButton icon={<SkipForward />} size="sm" />
```

---

### 10. ProgressBar (`ProgressBar.tsx`)
Progress indicators for exports and loading states.

**Components:**
- `ProgressBar` - Linear progress bar
- `CircularProgress` - Circular progress indicator

**ProgressBar Props:**
- `value`: number - Current progress
- `max`: number (default: 100)
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'success' | 'warning' | 'danger'
- `showLabel`: boolean
- `label`: string
- `animated`: boolean

**Usage:**
```tsx
import { ProgressBar, CircularProgress } from '@/app/components/ui';

<ProgressBar
  value={exportProgress}
  label="Exporting Video"
  showLabel
  variant="success"
/>

<CircularProgress
  value={renderProgress}
  size={80}
  variant="default"
/>
```

---

## Theming

All components use a dark theme by default with the following color scheme:

- **Background**: zinc-900, zinc-800
- **Text**: white, zinc-400
- **Accents**: blue-500, blue-600
- **Borders**: zinc-700
- **Errors**: red-500, red-600
- **Success**: green-500, green-600

## Accessibility Features

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus states and indicators
- Screen reader friendly markup
- Disabled state handling

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- lucide-react icons

## Import All Components

```tsx
import {
  Button,
  Slider,
  Dropdown,
  ColorPicker,
  Input,
  Tooltip,
  Modal,
  ModalFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  IconButton,
  ProgressBar,
  CircularProgress
} from '@/app/components/ui';
```
