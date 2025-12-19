import { useCallback, useEffect } from 'react';
import { useSelectionStore } from '../lib/store/selectionStore';
import { useTimelineStore } from '../lib/store/timelineStore';
import { CanvasElement, getElementsBounds } from '../lib/canvas/elements';
import { Point } from '../lib/utils/mathUtils';
import { isPointInElement } from '../lib/canvas/transforms';

interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useSelection() {
  const {
    selectedElementIds,
    selectedClipIds,
    selectionBox,
    isSelecting,
    multiSelectMode,
    hoveredElementId,
    activeTransformHandle,
    selectElement,
    selectElements,
    deselectElement,
    toggleElementSelection,
    clearElementSelection,
    isElementSelected,
    getSelectedElements,
    selectClip,
    deselectClip,
    toggleClipSelection,
    clearClipSelection,
    isClipSelected,
    getSelectedClips,
    startSelection,
    updateSelection,
    endSelection,
    clearSelectionBox,
    setMultiSelectMode,
    setHoveredElement,
    setActiveTransformHandle,
    clearAll,
  } = useSelectionStore();

  const { tracks } = useTimelineStore();

  /**
   * Gets all canvas elements from timeline clips
   */
  const getAllElements = useCallback((): CanvasElement[] => {
    const elements: CanvasElement[] = [];

    tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        if (clip.position) {
          elements.push({
            id: clip.id,
            type: clip.type as any,
            x: clip.position.x,
            y: clip.position.y,
            width: clip.scale ? clip.scale.x * 100 : 100,
            height: clip.scale ? clip.scale.y * 100 : 100,
            rotation: clip.rotation || 0,
            opacity: clip.opacity || 1,
            visible: true,
            locked: clip.locked || false,
            zIndex: 0,
          } as CanvasElement);
        }
      });
    });

    return elements;
  }, [tracks]);

  /**
   * Gets currently selected canvas elements
   */
  const getSelectedElementsData = useCallback((): CanvasElement[] => {
    const allElements = getAllElements();
    const selectedIds = getSelectedElements();
    return allElements.filter((el) => selectedIds.includes(el.id));
  }, [getAllElements, getSelectedElements]);

  /**
   * Calculates the bounding box of selected elements
   */
  const getSelectionBounds = useCallback((): SelectionBounds | null => {
    const selectedElements = getSelectedElementsData();
    if (selectedElements.length === 0) return null;

    return getElementsBounds(selectedElements);
  }, [getSelectedElementsData]);

  /**
   * Selects element at point
   */
  const selectElementAtPoint = useCallback(
    (point: Point, multiSelect: boolean = false) => {
      const allElements = getAllElements();

      // Find element at point (from top to bottom)
      const elementAtPoint = [...allElements]
        .reverse()
        .find((element) => !element.locked && isPointInElement(point, element));

      if (elementAtPoint) {
        if (multiSelect) {
          toggleElementSelection(elementAtPoint.id);
        } else {
          selectElement(elementAtPoint.id);
        }
        return elementAtPoint.id;
      }

      // If no element found and not multi-selecting, clear selection
      if (!multiSelect) {
        clearElementSelection();
      }

      return null;
    },
    [getAllElements, selectElement, toggleElementSelection, clearElementSelection]
  );

  /**
   * Selects elements within a rectangle
   */
  const selectElementsInRect = useCallback(
    (rect: { x: number; y: number; width: number; height: number }, multiSelect: boolean = false) => {
      const allElements = getAllElements();

      const elementsInRect = allElements.filter((element) => {
        if (element.locked) return false;

        // Check if element bounds intersect with selection rect
        const elementRight = element.x + element.width;
        const elementBottom = element.y + element.height;
        const rectRight = rect.x + rect.width;
        const rectBottom = rect.y + rect.height;

        return !(
          element.x > rectRight ||
          elementRight < rect.x ||
          element.y > rectBottom ||
          elementBottom < rect.y
        );
      });

      const elementIds = elementsInRect.map((el) => el.id);

      if (multiSelect) {
        selectElements(elementIds);
      } else {
        if (elementIds.length > 0) {
          selectElements(elementIds);
        }
      }

      return elementIds;
    },
    [getAllElements, selectElements]
  );

  /**
   * Starts box selection
   */
  const startBoxSelection = useCallback(
    (point: Point) => {
      startSelection(point.x, point.y);
    },
    [startSelection]
  );

  /**
   * Updates box selection
   */
  const updateBoxSelection = useCallback(
    (startPoint: Point, currentPoint: Point) => {
      const x = Math.min(startPoint.x, currentPoint.x);
      const y = Math.min(startPoint.y, currentPoint.y);
      const width = Math.abs(currentPoint.x - startPoint.x);
      const height = Math.abs(currentPoint.y - startPoint.y);

      updateSelection(x, y, width, height);

      // Auto-select elements in the box
      if (width > 5 || height > 5) {
        selectElementsInRect({ x, y, width, height }, multiSelectMode);
      }
    },
    [updateSelection, selectElementsInRect, multiSelectMode]
  );

  /**
   * Ends box selection
   */
  const endBoxSelection = useCallback(() => {
    endSelection();

    // Clear box after a short delay
    setTimeout(() => {
      clearSelectionBox();
    }, 100);
  }, [endSelection, clearSelectionBox]);

  /**
   * Selects all elements
   */
  const selectAll = useCallback(() => {
    const allElements = getAllElements();
    const unlockedElements = allElements.filter((el) => !el.locked);
    selectElements(unlockedElements.map((el) => el.id));
  }, [getAllElements, selectElements]);

  /**
   * Deletes selected elements
   */
  const deleteSelected = useCallback(() => {
    const selectedIds = getSelectedElements();
    // This would need to be implemented in the timeline store
    // For now, just clear the selection
    clearElementSelection();
  }, [getSelectedElements, clearElementSelection]);

  /**
   * Duplicates selected elements
   */
  const duplicateSelected = useCallback(() => {
    const selectedElements = getSelectedElementsData();
    // This would need to be implemented to actually duplicate the clips
    // For now, just a placeholder
    return selectedElements;
  }, [getSelectedElementsData]);

  /**
   * Groups selected elements
   */
  const groupSelected = useCallback(() => {
    const selectedElements = getSelectedElementsData();
    if (selectedElements.length < 2) return null;

    // This would create a group object
    // For now, just return the bounds
    return getElementsBounds(selectedElements);
  }, [getSelectedElementsData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Multi-select mode (Shift key)
      if (e.key === 'Shift') {
        setMultiSelectMode(true);
      }

      // Select all (Ctrl/Cmd + A)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
      }

      // Delete (Delete or Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedIds = getSelectedElements();
        if (selectedIds.length > 0) {
          e.preventDefault();
          deleteSelected();
        }
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
      }

      // Escape - clear selection
      if (e.key === 'Escape') {
        clearAll();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setMultiSelectMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    setMultiSelectMode,
    selectAll,
    deleteSelected,
    duplicateSelected,
    clearAll,
    getSelectedElements,
  ]);

  return {
    // Selection state
    selectedElementIds,
    selectedClipIds,
    selectionBox,
    isSelecting,
    multiSelectMode,
    hoveredElementId,
    activeTransformHandle,

    // Element selection
    selectElement,
    selectElements,
    deselectElement,
    toggleElementSelection,
    clearElementSelection,
    isElementSelected,
    getSelectedElements,
    getSelectedElementsData,
    selectElementAtPoint,
    selectElementsInRect,

    // Clip selection
    selectClip,
    deselectClip,
    toggleClipSelection,
    clearClipSelection,
    isClipSelected,
    getSelectedClips,

    // Box selection
    startBoxSelection,
    updateBoxSelection,
    endBoxSelection,
    clearSelectionBox,

    // Selection bounds
    getSelectionBounds,

    // Hover state
    setHoveredElement,

    // Transform handle
    setActiveTransformHandle,

    // Bulk operations
    selectAll,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    clearAll,

    // Utilities
    getAllElements,
  };
}
