import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';

// Enable Immer plugin for Map and Set
enableMapSet();

// Types
export interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

interface SelectionState {
  // Canvas selection (for elements on the canvas)
  selectedElementIds: Set<string>;

  // Timeline selection (for clips in timeline)
  selectedClipIds: Set<string>;

  // Selection box (for drag-to-select)
  selectionBox: SelectionBox | null;
  isSelecting: boolean;

  // Multi-select mode
  multiSelectMode: boolean; // Ctrl/Cmd key held

  // Transform handle being dragged
  activeTransformHandle: string | null; // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw', 'rotate'

  // Hover state
  hoveredElementId: string | null;
  hoveredClipId: string | null;

  // Canvas element selection actions
  selectElement: (id: string) => void;
  selectElements: (ids: string[]) => void;
  deselectElement: (id: string) => void;
  toggleElementSelection: (id: string) => void;
  clearElementSelection: () => void;
  isElementSelected: (id: string) => boolean;
  getSelectedElements: () => string[];

  // Timeline clip selection actions
  selectClip: (id: string) => void;
  selectClips: (ids: string[]) => void;
  deselectClip: (id: string) => void;
  toggleClipSelection: (id: string) => void;
  clearClipSelection: () => void;
  isClipSelected: (id: string) => boolean;
  getSelectedClips: () => string[];

  // Selection box actions
  startSelection: (x: number, y: number) => void;
  updateSelection: (x: number, y: number, width: number, height: number) => void;
  endSelection: () => void;
  clearSelectionBox: () => void;

  // Multi-select mode
  setMultiSelectMode: (enabled: boolean) => void;

  // Transform handle
  setActiveTransformHandle: (handle: string | null) => void;

  // Hover state
  setHoveredElement: (id: string | null) => void;
  setHoveredClip: (id: string | null) => void;

  // Clear all selections
  clearAll: () => void;
}

export const useSelectionStore = create<SelectionState>()(
  immer((set, get) => ({
    // Initial state
    selectedElementIds: new Set(),
    selectedClipIds: new Set(),
    selectionBox: null,
    isSelecting: false,
    multiSelectMode: false,
    activeTransformHandle: null,
    hoveredElementId: null,
    hoveredClipId: null,

    // Canvas element selection actions
    selectElement: (id) =>
      set((state) => {
        if (!state.multiSelectMode) {
          state.selectedElementIds.clear();
        }
        state.selectedElementIds.add(id);
      }),

    selectElements: (ids) =>
      set((state) => {
        if (!state.multiSelectMode) {
          state.selectedElementIds.clear();
        }
        ids.forEach((id) => state.selectedElementIds.add(id));
      }),

    deselectElement: (id) =>
      set((state) => {
        state.selectedElementIds.delete(id);
      }),

    toggleElementSelection: (id) =>
      set((state) => {
        if (state.selectedElementIds.has(id)) {
          state.selectedElementIds.delete(id);
        } else {
          if (!state.multiSelectMode) {
            state.selectedElementIds.clear();
          }
          state.selectedElementIds.add(id);
        }
      }),

    clearElementSelection: () =>
      set((state) => {
        state.selectedElementIds.clear();
      }),

    isElementSelected: (id) => {
      return get().selectedElementIds.has(id);
    },

    getSelectedElements: () => {
      return Array.from(get().selectedElementIds);
    },

    // Timeline clip selection actions
    selectClip: (id) =>
      set((state) => {
        if (!state.multiSelectMode) {
          state.selectedClipIds.clear();
        }
        state.selectedClipIds.add(id);
      }),

    selectClips: (ids) =>
      set((state) => {
        if (!state.multiSelectMode) {
          state.selectedClipIds.clear();
        }
        ids.forEach((id) => state.selectedClipIds.add(id));
      }),

    deselectClip: (id) =>
      set((state) => {
        state.selectedClipIds.delete(id);
      }),

    toggleClipSelection: (id) =>
      set((state) => {
        if (state.selectedClipIds.has(id)) {
          state.selectedClipIds.delete(id);
        } else {
          if (!state.multiSelectMode) {
            state.selectedClipIds.clear();
          }
          state.selectedClipIds.add(id);
        }
      }),

    clearClipSelection: () =>
      set((state) => {
        state.selectedClipIds.clear();
      }),

    isClipSelected: (id) => {
      return get().selectedClipIds.has(id);
    },

    getSelectedClips: () => {
      return Array.from(get().selectedClipIds);
    },

    // Selection box actions
    startSelection: (x, y) =>
      set((state) => {
        state.isSelecting = true;
        state.selectionBox = { x, y, width: 0, height: 0 };
      }),

    updateSelection: (x, y, width, height) =>
      set((state) => {
        if (state.isSelecting) {
          state.selectionBox = { x, y, width, height };
        }
      }),

    endSelection: () =>
      set((state) => {
        state.isSelecting = false;
      }),

    clearSelectionBox: () =>
      set((state) => {
        state.selectionBox = null;
        state.isSelecting = false;
      }),

    // Multi-select mode
    setMultiSelectMode: (enabled) =>
      set((state) => {
        state.multiSelectMode = enabled;
      }),

    // Transform handle
    setActiveTransformHandle: (handle) =>
      set((state) => {
        state.activeTransformHandle = handle;
      }),

    // Hover state
    setHoveredElement: (id) =>
      set((state) => {
        state.hoveredElementId = id;
      }),

    setHoveredClip: (id) =>
      set((state) => {
        state.hoveredClipId = id;
      }),

    // Clear all selections
    clearAll: () =>
      set((state) => {
        state.selectedElementIds.clear();
        state.selectedClipIds.clear();
        state.selectionBox = null;
        state.isSelecting = false;
        state.activeTransformHandle = null;
        state.hoveredElementId = null;
        state.hoveredClipId = null;
      }),
  }))
);
