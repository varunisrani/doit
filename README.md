# Video Editor Pro

Doit is a browser-based Next.js video-editor prototype with a compositing canvas, multitrack timeline, animation controls, and local project persistence.

## Core features

- Project launcher with new, continue, and recent-project workflows.
- Interactive 1920×1080-style canvas with selection, pan, zoom, text, and shape tools.
- Multitrack timeline, playhead, clips, playback controls, and snapping utilities.
- Properties, layers, media, analysis, and transitions panels.
- Keyframe and easing utilities for animated element properties.
- Undo/redo-oriented Zustand stores and keyboard-shortcut hooks.
- Automatic browser-local project saving plus JSON project import/export.

## Technology stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS 4
- Zustand and Immer for client-side state
- dnd-kit for drag-and-drop interactions
- Lucide React icons
- FFmpeg WebAssembly packages are declared as dependencies

## Prerequisites

- Node.js and npm
- A modern browser with localStorage support

## Local setup

```bash
git clone https://github.com/varunisrani/doit.git
cd doit
npm ci
npm run dev
```

Next.js uses `http://localhost:3000` by default. The editor is available at `/editor`; `/tools-demo` exposes a tools demonstration.

Production and lint commands:

```bash
npm run build
npm run start
npm run lint
```

## Configuration

No environment variables are referenced by the primary application source.

## Project structure

- `app/page.tsx` — project launcher and recent-project list.
- `app/editor/` — editor route.
- `app/components/` — canvas, timeline, playback, tools, panels, layout, keyframes, modals, and UI primitives.
- `app/hooks/` — canvas, selection, timeline, playback, keyboard, and autosave behavior.
- `app/lib/` — state stores, storage, canvas math, effects, and timeline utilities.
- `app/types/` and `app/constants/` — editor domain models and defaults.
- `cyberpunk-analysis-2025-12-06-07-18-04/` — a separate checked-in design/implementation snapshot, not used by the root app.

## Status and limitations

This is a feature-rich prototype rather than a complete video-production tool. Projects are stored only in the current browser and large embedded assets are skipped by the persistence layer. The visible “Export Video” action currently logs to the console; the source does not connect the declared FFmpeg packages to a completed media-rendering workflow. Some keyboard actions are placeholders, and no automated test script is defined.