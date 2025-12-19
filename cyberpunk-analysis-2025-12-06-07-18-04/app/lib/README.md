# App Library

This directory contains shared utilities, helpers, and state management for the video editor application.

## Contents

### State Management (`/store`)

Complete Zustand-based state management system for the video editor.

**Quick Links:**
- [Get Started in 5 Minutes](./store/QUICKSTART.md)
- [Complete Documentation](./store/INDEX.md)
- [Working Examples](./store/examples.tsx)

**Features:**
- 4 production-ready stores (~1,900 lines of code)
- Full TypeScript support
- Undo/redo with 50-state history
- Multi-select support
- Comprehensive documentation

**Stores:**
1. **editorStore** - Project settings, assets, tools, canvas
2. **timelineStore** - Tracks, clips, playback controls
3. **selectionStore** - Element and clip selection
4. **historyStore** - Undo/redo functionality

**Usage:**
```typescript
import {
  useEditorStore,
  useTimelineStore,
  useSelectionStore,
} from '@/app/lib/store';
import { useHistoryIntegration } from '@/app/lib/store/useHistoryIntegration';
```

**Documentation:**
- [INDEX.md](./store/INDEX.md) - Navigation and complete index
- [QUICKSTART.md](./store/QUICKSTART.md) - 5-minute getting started
- [README.md](./store/README.md) - Full API reference
- [ARCHITECTURE.md](./store/ARCHITECTURE.md) - System design
- [examples.tsx](./store/examples.tsx) - 8 working examples

---

For detailed information, see the [Store Documentation Index](./store/INDEX.md).
