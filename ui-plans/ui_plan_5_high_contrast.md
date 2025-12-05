# Global UI Plan 5: High Contrast / Accessibility

## Concept
A design focused on maximum readability and usability.

## Global Styles (`globals.css`)
- **Theme**: High Contrast Dark or Light.
- **Colors**:
    - `--background`: `#000000` (Black)
    - `--foreground`: `#FFFFFF` (White)
    - `--primary`: `#FFFF00` (Yellow)
    - `--secondary`: `#00FFFF` (Cyan)
- **Typography**: Large, legible (Atkinson Hyperlegible).
- **Borders**: 2px solid White.

## Component Updates
### [Layout](     app/layout.tsx)
- Solid black background.

### [Landing Page](     app/page.tsx)
- Large text.
- Clear status messages.
- No subtle gradients.

### [Editor Layout](     app/components/layout/EditorLayout.tsx)
- **Sidebar**: Solid black with white borders.
- **Canvas**: High contrast boundary.
- **Timeline**: Clear tracks, large handles.
- **Buttons**: Outlined with thick borders.
