# Global UI Plan 4: Glassmorphism

## Concept
A soft, modern aesthetic relying heavily on translucency, background blurs, and vivid background gradients.

## Global Styles (`globals.css`)
- **Theme**: Hybrid (Light/Dark).
- **Colors**:
    - `--background`: Mesh Gradient (Blue/Purple/Pink)
    - `--foreground`: `#FFFFFF` (White)
    - `--primary`: White with opacity
    - `--glass-border`: `rgba(255, 255, 255, 0.2)`
- **Typography**: Rounded sans-serif (Nunito/Quicksand).
- **Effects**: `backdrop-filter: blur(20px)`.

## Component Updates
### [Layout](file:///c:/Users/Varun%20israni/doit/app/layout.tsx)
- Vivid mesh gradient background.

### [Landing Page](file:///c:/Users/Varun%20israni/doit/app/page.tsx)
- Floating glass cards.
- Soft, fluid animations.

### [Editor Layout](file:///c:/Users/Varun%20israni/doit/app/components/layout/EditorLayout.tsx)
- **Sidebar**: Floating glass panel (`bg-white/10`).
- **Canvas**: Floating window with shadow.
- **Timeline**: Floating glass track container.
- **UI Elements**: Rounded corners (`rounded-2xl`).
