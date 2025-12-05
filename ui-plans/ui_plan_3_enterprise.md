# Global UI Plan 3: Professional Enterprise

## Concept
A dense, utility-focused dark theme similar to VS Code or Adobe Premiere.

## Global Styles (`globals.css`)
- **Theme**: Dark Mode (Neutral).
- **Colors**:
    - `--background`: `#1E1E1E` (Dark Gray)
    - `--foreground`: `#CCCCCC` (Light Gray)
    - `--primary`: `#007ACC` (VS Code Blue)
    - `--secondary`: `#333333` (Panel Gray)
    - `--accent`: `#3E3E42` (Border Gray)
- **Typography**: Segoe UI or Roboto. Compact.
- **Borders**: 1px solid `#3E3E42`.

## Component Updates
### [Layout](file:///c:/Users/Varun%20israni/doit/app/layout.tsx)
- Solid dark background, no gradients.

### [Landing Page](file:///c:/Users/Varun%20israni/doit/app/page.tsx)
- Professional branding.
- Simple status indicators.
- No "flashy" animations.

### [Editor Layout](file:///c:/Users/Varun%20israni/doit/app/components/layout/EditorLayout.tsx)
- **Sidebar**: Solid dark gray (`#252526`).
- **Canvas**: Neutral gray.
- **Timeline**: High density, clear rulers.
- **Controls**: Standard buttons, high information density.
