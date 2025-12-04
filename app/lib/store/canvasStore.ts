import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  CanvasElement,
  ImageElement,
  TextElement,
  ShapeElement,
  VideoElement
} from '@/app/types/elements';

interface CanvasState {
  // Canvas elements
  elements: CanvasElement[];

  // Actions
  addElement: (element: CanvasElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateElementTransform: (id: string, updates: Partial<CanvasElement['transform']>) => void;
  updateElementStyle: (id: string, updates: Partial<CanvasElement['style']>) => void;
  duplicateElement: (id: string) => void;
  clearElements: () => void;

  // Z-index management
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Utility
  getElementById: (id: string) => CanvasElement | undefined;
  getElementsByType: (type: CanvasElement['type']) => CanvasElement[];
}

export const useCanvasStore = create<CanvasState>()(
  immer((set, get) => ({
    // Initial state
    elements: [],

    // Actions
    addElement: (element) =>
      set((state) => {
        state.elements.push(element);
      }),

    removeElement: (id) =>
      set((state) => {
        state.elements = state.elements.filter((el) => el.id !== id);
      }),

    updateElement: (id, updates) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          Object.assign(element, updates);
        }
      }),

    updateElementTransform: (id, updates) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          Object.assign(element.transform, updates);
        }
      }),

    updateElementStyle: (id, updates) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          Object.assign(element.style, updates);
        }
      }),

    duplicateElement: (id) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          const duplicate = {
            ...element,
            id: crypto.randomUUID(),
            name: `${element.name} (Copy)`,
            transform: {
              ...element.transform,
              x: element.transform.x + 20,
              y: element.transform.y + 20,
            },
          };
          state.elements.push(duplicate);
        }
      }),

    clearElements: () =>
      set((state) => {
        state.elements = [];
      }),

    // Z-index management
    bringToFront: (id) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          const maxZIndex = Math.max(...state.elements.map((el) => el.style.zIndex), 0);
          element.style.zIndex = maxZIndex + 1;
        }
      }),

    sendToBack: (id) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          const minZIndex = Math.min(...state.elements.map((el) => el.style.zIndex), 0);
          element.style.zIndex = minZIndex - 1;
        }
      }),

    bringForward: (id) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          element.style.zIndex += 1;
        }
      }),

    sendBackward: (id) =>
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          element.style.zIndex -= 1;
        }
      }),

    // Utility
    getElementById: (id) => {
      return get().elements.find((el) => el.id === id);
    },

    getElementsByType: (type) => {
      return get().elements.filter((el) => el.type === type);
    },
  }))
);
