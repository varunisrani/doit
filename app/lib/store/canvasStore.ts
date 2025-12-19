import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  CanvasElement,
  ImageElement,
  TextElement,
  ShapeElement,
  VideoElement,
  Transform,
  ElementStyle,
} from '@/app/types/elements';

// Default transform for new elements
const defaultTransform: Transform = {
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  anchorX: 0.5,
  anchorY: 0.5,
  flipX: false,
  flipY: false,
};

// Default style for new elements
const defaultStyle: ElementStyle = {
  opacity: 1,
  blendMode: 'normal',
  zIndex: 0,
};

interface CanvasState {
  // Canvas elements
  elements: CanvasElement[];

  // Actions
  addElement: (element: CanvasElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateElementTransform: (id: string, updates: Partial<Transform>) => void;
  updateElementStyle: (id: string, updates: Partial<ElementStyle>) => void;
  duplicateElement: (id: string) => void;
  clearElements: () => void;
  setElements: (elements: CanvasElement[]) => void;

  // Z-index management
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Element creation helpers
  createTextElement: (text: string, x?: number, y?: number) => string;
  createShapeElement: (shapeType: ShapeElement['shapeType'], x?: number, y?: number) => string;
  createImageElement: (src: string, naturalWidth: number, naturalHeight: number, x?: number, y?: number) => string;

  // Utility
  getElementById: (id: string) => CanvasElement | undefined;
  getElementsByType: (type: CanvasElement['type']) => CanvasElement[];
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      elements: [],

      // Actions
      addElement: (element) =>
        set((state) => {
          // Ensure unique zIndex
          const maxZIndex = state.elements.length > 0
            ? Math.max(...state.elements.map((el) => el.style.zIndex))
            : -1;
          element.style.zIndex = maxZIndex + 1;
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
            const maxZIndex = Math.max(...state.elements.map((el) => el.style.zIndex), 0);
            const duplicate = JSON.parse(JSON.stringify(element));
            duplicate.id = crypto.randomUUID();
            duplicate.name = `${element.name} (Copy)`;
            duplicate.transform.x = element.transform.x + 20;
            duplicate.transform.y = element.transform.y + 20;
            duplicate.style.zIndex = maxZIndex + 1;
            state.elements.push(duplicate);
          }
        }),

      clearElements: () =>
        set((state) => {
          state.elements = [];
        }),

      setElements: (elements) =>
        set((state) => {
          state.elements = elements;
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

      // Element creation helpers
      createTextElement: (text, x = 100, y = 100) => {
        const id = crypto.randomUUID();
        const element: TextElement = {
          id,
          type: 'text',
          name: `Text ${Date.now()}`,
          transform: {
            ...defaultTransform,
            x,
            y,
            width: 300,
            height: 50,
          },
          style: { ...defaultStyle },
          filters: [],
          locked: false,
          visible: true,
          content: text,
          fontFamily: 'Inter, sans-serif',
          fontSize: 24,
          fontWeight: 400,
          fontStyle: 'normal',
          textDecoration: 'none',
          color: '#ffffff',
          textAlign: 'left',
          verticalAlign: 'top',
          lineHeight: 1.2,
          letterSpacing: 0,
          wordSpacing: 0,
          autoSize: true,
        };

        set((state) => {
          const maxZIndex = state.elements.length > 0
            ? Math.max(...state.elements.map((el) => el.style.zIndex))
            : -1;
          element.style.zIndex = maxZIndex + 1;
          state.elements.push(element);
        });

        return id;
      },

      createShapeElement: (shapeType, x = 100, y = 100) => {
        const id = crypto.randomUUID();
        const element: ShapeElement = {
          id,
          type: 'shape',
          name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${Date.now()}`,
          transform: {
            ...defaultTransform,
            x,
            y,
          },
          style: { ...defaultStyle },
          filters: [],
          locked: false,
          visible: true,
          shapeType,
          fillColor: '#3b82f6',
          strokeColor: '#1d4ed8',
          strokeWidth: 2,
        };

        set((state) => {
          const maxZIndex = state.elements.length > 0
            ? Math.max(...state.elements.map((el) => el.style.zIndex))
            : -1;
          element.style.zIndex = maxZIndex + 1;
          state.elements.push(element);
        });

        return id;
      },

      createImageElement: (src, naturalWidth, naturalHeight, x = 100, y = 100) => {
        const id = crypto.randomUUID();
        // Scale to fit within 400x400 while maintaining aspect ratio
        const maxSize = 400;
        const scale = Math.min(maxSize / naturalWidth, maxSize / naturalHeight, 1);
        const width = naturalWidth * scale;
        const height = naturalHeight * scale;

        const element: ImageElement = {
          id,
          type: 'image',
          name: `Image ${Date.now()}`,
          transform: {
            ...defaultTransform,
            x,
            y,
            width,
            height,
          },
          style: { ...defaultStyle },
          filters: [],
          locked: false,
          visible: true,
          src,
          naturalWidth,
          naturalHeight,
        };

        set((state) => {
          const maxZIndex = state.elements.length > 0
            ? Math.max(...state.elements.map((el) => el.style.zIndex))
            : -1;
          element.style.zIndex = maxZIndex + 1;
          state.elements.push(element);
        });

        return id;
      },

      // Utility
      getElementById: (id) => {
        return get().elements.find((el) => el.id === id);
      },

      getElementsByType: (type) => {
        return get().elements.filter((el) => el.type === type);
      },
    })),
    {
      name: 'video-editor-canvas',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        elements: state.elements,
      }),
    }
  )
);
