# Global UI Plan 1: Modern Minimalist

## Concept
A clean, light-themed interface focusing on clarity and reducing visual noise. This design mimics modern design tools like Figma or Sketch.

## Global Styles (`globals.css`)
- **Theme**: Light Mode default.
- **Colors**:
    - `--background`: `#FFFFFF` (White)
    - `--foreground`: `#1F2937` (Dark Gray)
    - `--primary`: `#3B82F6` (Blue)
    - `--secondary`: `#6B7280` (Gray)
    - `--accent`: `#F3F4F6` (Light Gray)
- **Typography**: Inter or System UI. Clean, sans-serif.
- **Borders**: Subtle `#E5E7EB`.
- **Shadows**: Soft, diffuse shadows.

## Component Updates
### [Layout]( app/layout.tsx)
- Remove dark mode enforcement.
- Set background to white/light gray.

### [Landing Page]( app/page.tsx)
- Remove heavy gradients.
- Use a clean, minimal loader (e.g., simple spinner or progress bar).
- Black text on white background.

### [Editor Layout]( app/components/layout/EditorLayout.tsx)
- **Sidebar**: Light gray background (`bg-gray-50`).
- **Canvas**: Light gray checkerboard or solid white.
- **Timeline**: White background with distinct track lines.
- **Icons**: Thin stroke, dark gray.
