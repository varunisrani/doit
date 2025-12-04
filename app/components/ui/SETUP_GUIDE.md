# Video Editor UI Components - Setup Guide

## File Structure

All components are located in `app/components/ui/`:

```
app/components/ui/
├── Button.tsx              # Reusable button with variants
├── Slider.tsx              # Range slider for values
├── Dropdown.tsx            # Dropdown/select component
├── ColorPicker.tsx         # Color picker component
├── Input.tsx               # Text input with label support
├── Tooltip.tsx             # Tooltip wrapper component
├── Modal.tsx               # Modal dialog component
├── Tabs.tsx                # Tab navigation component
├── IconButton.tsx          # Icon-only button for toolbars
├── ProgressBar.tsx         # Progress bar for exports
├── index.ts                # Central export file
├── demo.tsx                # Interactive component showcase
├── COMPONENTS_README.md    # Detailed documentation
└── SETUP_GUIDE.md          # This file
```

## Quick Start

### 1. Import Components

All components are exported from the central `index.ts` file:

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

### 2. Basic Usage Examples

#### Button
```tsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

#### Slider
```tsx
const [volume, setVolume] = useState(50);
<Slider
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  label="Volume"
/>
```

#### Dropdown
```tsx
const options = [
  { value: '1080p', label: '1080p Full HD' },
  { value: '4k', label: '4K Ultra HD' }
];
<Dropdown
  options={options}
  value={quality}
  onChange={setQuality}
  label="Export Quality"
/>
```

#### Color Picker
```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  label="Background Color"
/>
```

#### Modal
```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Settings">
  <div>Modal content</div>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSave}>Save</Button>
  </ModalFooter>
</Modal>
```

## Dependencies

These components use the following dependencies (already installed):

- **React 19** - Latest React version
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **lucide-react** - Icon library

## Viewing the Demo

To see all components in action:

1. Create a route to view the demo component
2. Import and render the demo:

```tsx
import ComponentsDemo from '@/app/components/ui/demo';

export default function DemoPage() {
  return <ComponentsDemo />;
}
```

## Color Scheme Reference

All components follow this dark theme color scheme:

```css
/* Backgrounds */
bg-zinc-900     /* Primary background */
bg-zinc-800     /* Secondary background */
bg-zinc-700     /* Tertiary background */

/* Text */
text-white      /* Primary text */
text-zinc-400   /* Secondary text */
text-zinc-500   /* Tertiary text */

/* Accents */
bg-blue-600     /* Primary accent */
bg-blue-700     /* Primary accent hover */

/* Borders */
border-zinc-700 /* Border color */
border-zinc-600 /* Lighter border */

/* Status Colors */
bg-red-600      /* Danger/Error */
bg-green-600    /* Success */
bg-yellow-600   /* Warning */
```

## Customization

### Modifying Colors

To change the color scheme, simply replace the Tailwind color classes in each component. For example:

```tsx
// Change blue accent to purple
bg-blue-600 → bg-purple-600
bg-blue-700 → bg-purple-700
```

### Adding New Variants

Each component is designed to be easily extended. For example, to add a new button variant:

```tsx
// In Button.tsx
const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-zinc-700 hover:bg-zinc-600 text-white',
  ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  // Add your custom variant
  success: 'bg-green-600 hover:bg-green-700 text-white'
};
```

## TypeScript Support

All components are fully typed with TypeScript interfaces. Import types as needed:

```tsx
import type { ButtonProps, SliderProps, DropdownOption } from '@/app/components/ui';
```

## Accessibility Features

All components include:

- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Disabled states
- ✅ Error states (where applicable)

## Best Practices

1. **Use the Tooltip component** for icon buttons and controls without labels
2. **Always provide labels** for form inputs using the `label` prop
3. **Handle errors gracefully** using the `error` prop on Input components
4. **Close modals properly** by managing the `isOpen` state
5. **Use appropriate variants** to convey the purpose of buttons (danger for destructive actions)

## Common Patterns

### Form with Validation
```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### Toolbar with Icon Buttons
```tsx
<div className="flex gap-2">
  <Tooltip content="Play">
    <IconButton icon={<Play />} variant="primary" />
  </Tooltip>
  <Tooltip content="Pause">
    <IconButton icon={<Pause />} />
  </Tooltip>
</div>
```

### Settings Panel with Tabs
```tsx
<Tabs defaultValue="video">
  <TabsList>
    <TabsTrigger value="video">Video</TabsTrigger>
    <TabsTrigger value="audio">Audio</TabsTrigger>
  </TabsList>
  <TabsContent value="video">
    {/* Video settings */}
  </TabsContent>
  <TabsContent value="audio">
    {/* Audio settings */}
  </TabsContent>
</Tabs>
```

## Need Help?

- Check `COMPONENTS_README.md` for detailed component documentation
- View `demo.tsx` for interactive examples
- All components include TypeScript types for autocomplete support

## Next Steps

Now that you have all the base UI components, you can:

1. Build your video editor interface
2. Create composite components (Timeline, VideoPlayer, etc.)
3. Implement the video editing logic
4. Add state management (React Context, Zustand, etc.)
5. Integrate with video processing libraries

Happy coding! 🎬
