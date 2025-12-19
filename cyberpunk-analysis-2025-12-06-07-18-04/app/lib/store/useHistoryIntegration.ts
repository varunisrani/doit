import { useEffect, useCallback } from 'react';
import { useEditorStore } from './editorStore';
import { useTimelineStore } from './timelineStore';
import { useSelectionStore } from './selectionStore';
import { useHistoryStore, createSnapshot, restoreSnapshot, deserializeState } from './historyStore';

/**
 * Hook to integrate history tracking with editor stores
 *
 * Usage:
 * - Call this hook in your main app component
 * - Use the returned functions to record state changes
 * - Use undo/redo functions to navigate history
 */
export function useHistoryIntegration() {
  const historyStore = useHistoryStore();
  const editorStore = useEditorStore();
  const timelineStore = useTimelineStore();
  const selectionStore = useSelectionStore();

  const stores = {
    editor: editorStore,
    timeline: timelineStore,
    selection: selectionStore,
  };

  /**
   * Record current state to history
   */
  const recordState = useCallback((description: string) => {
    const snapshot = createSnapshot(stores);
    historyStore.pushState(snapshot, description);
  }, [historyStore, stores]);

  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    if (!historyStore.canUndo()) {
      return false;
    }

    // Get current state before undo
    const currentSnapshot = createSnapshot(stores);

    // Perform undo
    const undoneState = historyStore.undo();

    if (undoneState && undoneState.state) {
      const deserializedState = deserializeState(undoneState.state);
      restoreSnapshot(deserializedState, stores);
      return true;
    }

    return false;
  }, [historyStore, stores]);

  /**
   * Redo last undone action
   */
  const redo = useCallback(() => {
    if (!historyStore.canRedo()) {
      return false;
    }

    const redoneState = historyStore.redo();

    if (redoneState && redoneState.state) {
      const deserializedState = deserializeState(redoneState.state);
      restoreSnapshot(deserializedState, stores);
      return true;
    }

    return false;
  }, [historyStore, stores]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    historyStore.clear();
  }, [historyStore]);

  /**
   * Start batch operation
   */
  const startBatch = useCallback(() => {
    historyStore.startBatch();
  }, [historyStore]);

  /**
   * End batch operation
   */
  const endBatch = useCallback((description: string) => {
    const snapshot = createSnapshot(stores);
    historyStore.endBatch(snapshot, description);
  }, [historyStore, stores]);

  /**
   * Temporarily disable history recording
   */
  const pauseRecording = useCallback(() => {
    historyStore.setRecording(false);
  }, [historyStore]);

  /**
   * Resume history recording
   */
  const resumeRecording = useCallback(() => {
    historyStore.setRecording(true);
  }, [historyStore]);

  // Set up keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (modifier && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    recordState,
    undo,
    redo,
    clearHistory,
    startBatch,
    endBatch,
    pauseRecording,
    resumeRecording,
    canUndo: historyStore.canUndo(),
    canRedo: historyStore.canRedo(),
    undoDescription: historyStore.getUndoDescription(),
    redoDescription: historyStore.getRedoDescription(),
  };
}

/**
 * HOC to wrap actions with history recording
 *
 * Example:
 * const addClipWithHistory = withHistory(
 *   () => timelineStore.addClip(...),
 *   'Add clip'
 * );
 */
export function withHistory<T extends (...args: any[]) => any>(
  action: T,
  description: string
): T {
  return ((...args: Parameters<T>) => {
    const historyStore = useHistoryStore.getState();
    const editorStore = useEditorStore.getState();
    const timelineStore = useTimelineStore.getState();
    const selectionStore = useSelectionStore.getState();

    const stores = {
      editor: { getState: () => editorStore, setState: useEditorStore.setState },
      timeline: { getState: () => timelineStore, setState: useTimelineStore.setState },
      selection: { getState: () => selectionStore, setState: useSelectionStore.setState },
    };

    // Record state before action
    const snapshot = createSnapshot({
      editor: editorStore,
      timeline: timelineStore,
      selection: selectionStore,
    });

    // Execute action
    const result = action(...args);

    // Record state after action
    historyStore.pushState(snapshot, description);

    return result;
  }) as T;
}
