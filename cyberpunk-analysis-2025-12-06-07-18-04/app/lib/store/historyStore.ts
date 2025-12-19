import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Types
export interface HistoryState {
  id: string;
  timestamp: number;
  description: string;
  state: any; // The serialized state snapshot
}

interface HistoryStoreState {
  // History stacks
  past: HistoryState[];
  future: HistoryState[];

  // Settings
  maxHistorySize: number;
  isRecording: boolean; // To temporarily disable recording

  // Actions
  pushState: (state: any, description: string) => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  clear: () => void;
  clearFuture: () => void;

  // Utilities
  canUndo: () => boolean;
  canRedo: () => boolean;
  getUndoDescription: () => string | null;
  getRedoDescription: () => string | null;
  setMaxHistorySize: (size: number) => void;
  setRecording: (enabled: boolean) => void;

  // Batch operations
  startBatch: () => void;
  endBatch: (state: any, description: string) => void;
  isBatching: boolean;

  // History info
  getHistorySize: () => number;
  getHistory: () => HistoryState[];
  getFuture: () => HistoryState[];
}

const MAX_HISTORY_SIZE = 50;

export const useHistoryStore = create<HistoryStoreState>()(
  immer((set, get) => ({
    // Initial state
    past: [],
    future: [],
    maxHistorySize: MAX_HISTORY_SIZE,
    isRecording: true,
    isBatching: false,

    // Push a new state to history
    pushState: (state, description) =>
      set((draft) => {
        if (!draft.isRecording || draft.isBatching) {
          return;
        }

        // Create history entry
        const historyEntry: HistoryState = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          description,
          state: serializeState(state),
        };

        // Add to past
        draft.past.push(historyEntry);

        // Limit history size
        if (draft.past.length > draft.maxHistorySize) {
          draft.past.shift();
        }

        // Clear future (new action invalidates redo stack)
        draft.future = [];
      }),

    // Undo last action
    undo: () => {
      const state = get();
      if (state.past.length === 0) {
        return null;
      }

      let undoneState: HistoryState | null = null;

      set((draft) => {
        const lastState = draft.past.pop();
        if (lastState) {
          draft.future.push(lastState);
          undoneState = lastState;
        }
      });

      return undoneState;
    },

    // Redo last undone action
    redo: () => {
      const state = get();
      if (state.future.length === 0) {
        return null;
      }

      let redoneState: HistoryState | null = null;

      set((draft) => {
        const nextState = draft.future.pop();
        if (nextState) {
          draft.past.push(nextState);
          redoneState = nextState;
        }
      });

      return redoneState;
    },

    // Clear all history
    clear: () =>
      set((draft) => {
        draft.past = [];
        draft.future = [];
      }),

    // Clear only future (redo) stack
    clearFuture: () =>
      set((draft) => {
        draft.future = [];
      }),

    // Check if undo is available
    canUndo: () => {
      return get().past.length > 0;
    },

    // Check if redo is available
    canRedo: () => {
      return get().future.length > 0;
    },

    // Get description of next undo action
    getUndoDescription: () => {
      const state = get();
      if (state.past.length === 0) return null;
      return state.past[state.past.length - 1].description;
    },

    // Get description of next redo action
    getRedoDescription: () => {
      const state = get();
      if (state.future.length === 0) return null;
      return state.future[state.future.length - 1].description;
    },

    // Set maximum history size
    setMaxHistorySize: (size) =>
      set((draft) => {
        draft.maxHistorySize = Math.max(1, size);
        // Trim history if necessary
        while (draft.past.length > draft.maxHistorySize) {
          draft.past.shift();
        }
      }),

    // Enable/disable recording
    setRecording: (enabled) =>
      set((draft) => {
        draft.isRecording = enabled;
      }),

    // Start batch operation (multiple actions as one undo)
    startBatch: () =>
      set((draft) => {
        draft.isBatching = true;
      }),

    // End batch operation
    endBatch: (state, description) =>
      set((draft) => {
        draft.isBatching = false;

        if (!draft.isRecording) {
          return;
        }

        // Create history entry for the batch
        const historyEntry: HistoryState = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          description,
          state: serializeState(state),
        };

        // Add to past
        draft.past.push(historyEntry);

        // Limit history size
        if (draft.past.length > draft.maxHistorySize) {
          draft.past.shift();
        }

        // Clear future
        draft.future = [];
      }),

    // Get total history size
    getHistorySize: () => {
      const state = get();
      return state.past.length;
    },

    // Get past history
    getHistory: () => {
      return get().past;
    },

    // Get future history
    getFuture: () => {
      return get().future;
    },
  }))
);

// Helper functions for state serialization

/**
 * Serialize state for storage in history
 * Deep clone the state to prevent mutations
 */
function serializeState(state: any): any {
  try {
    // Convert Sets and Maps to arrays/objects for serialization
    return JSON.parse(JSON.stringify(state, replacer));
  } catch (error) {
    console.error('Failed to serialize state:', error);
    return null;
  }
}

/**
 * Deserialize state from history
 * Restore any special data structures
 */
export function deserializeState(serialized: any): any {
  try {
    return JSON.parse(JSON.stringify(serialized), reviver);
  } catch (error) {
    console.error('Failed to deserialize state:', error);
    return null;
  }
}

/**
 * Custom JSON replacer to handle Sets, Maps, etc.
 */
function replacer(key: string, value: any): any {
  if (value instanceof Set) {
    return {
      __type: 'Set',
      value: Array.from(value),
    };
  }
  if (value instanceof Map) {
    return {
      __type: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
}

/**
 * Custom JSON reviver to restore Sets, Maps, etc.
 */
function reviver(key: string, value: any): any {
  if (value && typeof value === 'object' && value.__type === 'Set') {
    return new Set(value.value);
  }
  if (value && typeof value === 'object' && value.__type === 'Map') {
    return new Map(value.value);
  }
  return value;
}

/**
 * Create a snapshot of multiple stores
 */
export function createSnapshot(stores: Record<string, any>): any {
  const snapshot: Record<string, any> = {};

  for (const [name, store] of Object.entries(stores)) {
    snapshot[name] = store.getState();
  }

  return snapshot;
}

/**
 * Restore a snapshot to multiple stores
 */
export function restoreSnapshot(snapshot: any, stores: Record<string, any>): void {
  for (const [name, state] of Object.entries(snapshot)) {
    if (stores[name]) {
      stores[name].setState(state);
    }
  }
}
