import { useCallback, useRef } from 'react';
import { useEditorStore } from '../lib/store/editorStore';
import { useTimelineStore } from '../lib/store/timelineStore';
import { useSelectionStore } from '../lib/store/selectionStore';
import { CanvasElement } from '../lib/canvas/elements';
import { Point } from '../lib/utils/mathUtils';
import { transformElementByHandle, HandleType } from '../lib/canvas/transforms';

interface UseCanvasOptions {
  onElementUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const { zoom, panX, panY, setZoom, setPan } = useEditorStore((state) => ({
    zoom: state.canvasTransform.zoom,
    panX: state.canvasTransform.panX,
    panY: state.canvasTransform.panY,
    setZoom: state.setZoom,
    setPan: state.setPan,
  }));

  const { updateClip } = useTimelineStore();
  const { getSelectedElements } = useSelectionStore();

  const dragStateRef = useRef<{
    isDragging: boolean;
    startPos: Point;
    startElementPos: Map<string, Point>;
    isPanning: boolean;
    startPan: Point;
  }>({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    startElementPos: new Map(),
    isPanning: false,
    startPan: { x: 0, y: 0 },
  });

  /**
   * Converts screen coordinates to canvas coordinates
   */
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => {
      return {
        x: (screenX - panX) / zoom,
        y: (screenY - panY) / zoom,
      };
    },
    [zoom, panX, panY]
  );

  /**
   * Converts canvas coordinates to screen coordinates
   */
  const canvasToScreen = useCallback(
    (canvasX: number, canvasY: number): Point => {
      return {
        x: canvasX * zoom + panX,
        y: canvasY * zoom + panY,
      };
    },
    [zoom, panX, panY]
  );

  /**
   * Zooms the canvas
   */
  const zoomCanvas = useCallback(
    (delta: number, centerX?: number, centerY?: number) => {
      const newZoom = Math.max(0.1, Math.min(5, zoom + delta));

      // If center point provided, zoom towards it
      if (centerX !== undefined && centerY !== undefined) {
        const canvasPoint = screenToCanvas(centerX, centerY);
        const newPanX = centerX - canvasPoint.x * newZoom;
        const newPanY = centerY - canvasPoint.y * newZoom;
        setPan(newPanX, newPanY);
      }

      setZoom(newZoom);
    },
    [zoom, setZoom, setPan, screenToCanvas]
  );

  /**
   * Zooms using mouse wheel
   */
  const handleWheel = useCallback(
    (e: WheelEvent, canvasRect: DOMRect) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;

      zoomCanvas(delta, mouseX, mouseY);
    },
    [zoomCanvas]
  );

  /**
   * Pans the canvas
   */
  const panCanvas = useCallback(
    (deltaX: number, deltaY: number) => {
      setPan(panX + deltaX, panY + deltaY);
    },
    [panX, panY, setPan]
  );

  /**
   * Starts panning
   */
  const startPanning = useCallback((x: number, y: number) => {
    dragStateRef.current.isPanning = true;
    dragStateRef.current.startPan = { x: panX, y: panY };
    dragStateRef.current.startPos = { x, y };
  }, [panX, panY]);

  /**
   * Updates panning
   */
  const updatePanning = useCallback((x: number, y: number) => {
    if (!dragStateRef.current.isPanning) return;

    const deltaX = x - dragStateRef.current.startPos.x;
    const deltaY = y - dragStateRef.current.startPos.y;

    setPan(
      dragStateRef.current.startPan.x + deltaX,
      dragStateRef.current.startPan.y + deltaY
    );
  }, [setPan]);

  /**
   * Stops panning
   */
  const stopPanning = useCallback(() => {
    dragStateRef.current.isPanning = false;
  }, []);

  /**
   * Moves an element
   */
  const moveElement = useCallback(
    (elementId: string, deltaX: number, deltaY: number, element: CanvasElement) => {
      const newX = element.x + deltaX / zoom;
      const newY = element.y + deltaY / zoom;

      updateClip(elementId, {
        position: { x: newX, y: newY },
      });

      if (options.onElementUpdate) {
        options.onElementUpdate(elementId, { x: newX, y: newY });
      }
    },
    [zoom, updateClip, options]
  );

  /**
   * Moves multiple elements
   */
  const moveElements = useCallback(
    (elements: CanvasElement[], deltaX: number, deltaY: number) => {
      elements.forEach((element) => {
        moveElement(element.id, deltaX, deltaY, element);
      });
    },
    [moveElement]
  );

  /**
   * Starts dragging elements
   */
  const startDragging = useCallback((x: number, y: number, elements: CanvasElement[]) => {
    dragStateRef.current.isDragging = true;
    dragStateRef.current.startPos = { x, y };
    dragStateRef.current.startElementPos.clear();

    elements.forEach((element) => {
      dragStateRef.current.startElementPos.set(element.id, {
        x: element.x,
        y: element.y,
      });
    });
  }, []);

  /**
   * Updates element drag
   */
  const updateDragging = useCallback(
    (x: number, y: number, elements: CanvasElement[]) => {
      if (!dragStateRef.current.isDragging) return;

      const deltaX = x - dragStateRef.current.startPos.x;
      const deltaY = y - dragStateRef.current.startPos.y;

      elements.forEach((element) => {
        const startPos = dragStateRef.current.startElementPos.get(element.id);
        if (startPos) {
          const newX = startPos.x + deltaX / zoom;
          const newY = startPos.y + deltaY / zoom;

          updateClip(element.id, {
            position: { x: newX, y: newY },
          });

          if (options.onElementUpdate) {
            options.onElementUpdate(element.id, { x: newX, y: newY });
          }
        }
      });
    },
    [zoom, updateClip, options]
  );

  /**
   * Stops dragging
   */
  const stopDragging = useCallback(() => {
    dragStateRef.current.isDragging = false;
    dragStateRef.current.startElementPos.clear();
  }, []);

  /**
   * Resizes an element
   */
  const resizeElement = useCallback(
    (
      element: CanvasElement,
      handleType: HandleType,
      delta: Point,
      maintainAspectRatio: boolean = false
    ) => {
      const updates = transformElementByHandle(element, handleType, delta, maintainAspectRatio);

      updateClip(element.id, {
        position: { x: updates.x ?? element.x, y: updates.y ?? element.y },
        scale: {
          x: (updates.width ?? element.width) / element.width,
          y: (updates.height ?? element.height) / element.height,
        },
      });

      if (options.onElementUpdate) {
        options.onElementUpdate(element.id, updates);
      }
    },
    [updateClip, options]
  );

  /**
   * Rotates an element
   */
  const rotateElement = useCallback(
    (element: CanvasElement, rotation: number) => {
      updateClip(element.id, {
        rotation,
      });

      if (options.onElementUpdate) {
        options.onElementUpdate(element.id, { rotation });
      }
    },
    [updateClip, options]
  );

  /**
   * Fits canvas to show all elements
   */
  const fitToElements = useCallback(
    (elements: CanvasElement[], padding: number = 50) => {
      if (elements.length === 0) return;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      elements.forEach((element) => {
        minX = Math.min(minX, element.x);
        minY = Math.min(minY, element.y);
        maxX = Math.max(maxX, element.x + element.width);
        maxY = Math.max(maxY, element.y + element.height);
      });

      const width = maxX - minX;
      const height = maxY - minY;
      const centerX = minX + width / 2;
      const centerY = minY + height / 2;

      // Calculate zoom to fit
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const zoomX = (canvasWidth - padding * 2) / width;
      const zoomY = (canvasHeight - padding * 2) / height;
      const newZoom = Math.min(zoomX, zoomY, 5);

      // Center the view
      const newPanX = canvasWidth / 2 - centerX * newZoom;
      const newPanY = canvasHeight / 2 - centerY * newZoom;

      setZoom(newZoom);
      setPan(newPanX, newPanY);
    },
    [setZoom, setPan]
  );

  /**
   * Resets canvas view
   */
  const resetView = useCallback(() => {
    setZoom(1);
    setPan(0, 0);
  }, [setZoom, setPan]);

  return {
    // Transform state
    zoom,
    panX,
    panY,

    // Coordinate conversion
    screenToCanvas,
    canvasToScreen,

    // Zoom operations
    zoomCanvas,
    handleWheel,

    // Pan operations
    panCanvas,
    startPanning,
    updatePanning,
    stopPanning,

    // Element manipulation
    moveElement,
    moveElements,
    startDragging,
    updateDragging,
    stopDragging,
    resizeElement,
    rotateElement,

    // View operations
    fitToElements,
    resetView,

    // Drag state
    isDragging: dragStateRef.current.isDragging,
    isPanning: dragStateRef.current.isPanning,
  };
}
