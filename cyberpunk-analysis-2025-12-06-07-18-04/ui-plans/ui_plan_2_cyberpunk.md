# Global UI Plan 2: Cyberpunk / Neon

## Concept
A futuristic, high-energy dark mode with glowing accents and a tech-heavy aesthetic.

## Global Styles (`globals.css`)
- **Theme**: Dark Mode forced.
- **Colors**:
    - `--background`: `#050505` (Deep Black)
    - `--foreground`: `#FFFFFF` (White)
    - `--primary`: `#06B6D4` (Neon Cyan)
    - `--secondary`: `#EC4899` (Neon Pink)
    - `--accent`: `#8B5CF6` (Electric Purple)
- **Typography**: JetBrains Mono or Orbitron headers.
- **Effects**: Glows (`box-shadow`), scanlines (CSS pattern).

## Component Updates
### [Layout](file:///c:/Users/Varun%20israni/doit/app/layout.tsx)
- Keep dark mode.
- Add global grid/scanline background overlay.

### [Landing Page](file:///c:/Users/Varun%20israni/doit/app/page.tsx)
- Glitch effect text.
- Neon loader animation.
- Dark background with glowing orbs.

### [Editor Layout](file:///c:/Users/Varun%20israni/doit/app/components/layout/EditorLayout.tsx)
- **Sidebar**: Semi-transparent black with blur.
- **Canvas**: Dark grid.
- **Timeline**: Glowing clips, neon playhead.
- **Borders**: Sharp, glowing borders.
