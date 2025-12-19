'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../lib/store/editorStore';
import { useCanvasStore } from '../lib/store/canvasStore';
import { useTimelineStore } from '../lib/store/timelineStore';
import {
  saveProject,
  getUserPreferences,
  type ProjectData,
} from '../lib/storage/localStorage';
import { serializeProjectData } from '../lib/storage/serialization';

interface UseAutoSaveOptions {
  /** Auto-save interval in seconds. Default: 30 */
  interval?: number;
  /** Whether auto-save is enabled. Default: true */
  enabled?: boolean;
  /** Callback when auto-save completes */
  onSave?: (success: boolean) => void;
  /** Callback when auto-save fails */
  onError?: (error: Error) => void;
}

export function useAutoSave(options: UseAutoSaveOptions = {}) {
  const {
    interval = 30,
    enabled = true,
    onSave,
    onError,
  } = options;

  const lastSaveTimeRef = useRef<number>(Date.now());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // Get store values
  const project = useEditorStore((state) => state.project);
  const metadata = useEditorStore((state) => state.metadata);
  const assets = useEditorStore((state) => state.assets);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const setHasUnsavedChanges = useEditorStore((state) => state.setHasUnsavedChanges);

  const elements = useCanvasStore((state) => state.elements);
  const tracks = useTimelineStore((state) => state.tracks);

  // Save function
  const save = useCallback(async (): Promise<boolean> => {
    if (isSavingRef.current) {
      return false;
    }

    // Don't save if project has no ID
    if (!metadata.id) {
      return false;
    }

    isSavingRef.current = true;

    try {
      const projectData: ProjectData = serializeProjectData(
        project,
        metadata,
        tracks,
        elements,
        assets
      );

      const success = saveProject(projectData);

      if (success) {
        lastSaveTimeRef.current = Date.now();
        setHasUnsavedChanges(false);
        onSave?.(true);
        console.log('Project auto-saved:', metadata.name);
      } else {
        onSave?.(false);
        console.warn('Auto-save failed');
      }

      return success;
    } catch (error) {
      console.error('Auto-save error:', error);
      onError?.(error instanceof Error ? error : new Error('Auto-save failed'));
      return false;
    } finally {
      isSavingRef.current = false;
    }
  }, [project, metadata, assets, elements, tracks, setHasUnsavedChanges, onSave, onError]);

  // Manual save function (exposed to components)
  const saveNow = useCallback(async (): Promise<boolean> => {
    // Cancel any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    return save();
  }, [save]);

  // Debounced save on changes
  const scheduleSave = useCallback((delayMs: number = 2000) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save();
      saveTimeoutRef.current = null;
    }, delayMs);
  }, [save]);

  // Auto-save interval
  useEffect(() => {
    if (!enabled) return;

    const preferences = getUserPreferences();
    const actualInterval = preferences.autoSaveEnabled
      ? (preferences.autoSaveInterval || interval) * 1000
      : interval * 1000;

    const intervalId = setInterval(() => {
      if (hasUnsavedChanges && metadata.id) {
        save();
      }
    }, actualInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, interval, hasUnsavedChanges, metadata.id, save]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Try to save synchronously
        const projectData: ProjectData = serializeProjectData(
          project,
          metadata,
          tracks,
          elements,
          assets
        );
        saveProject(projectData);

        // Show confirmation dialog
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, project, metadata, assets, elements, tracks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    /** Manually trigger a save */
    saveNow,
    /** Schedule a debounced save */
    scheduleSave,
    /** Whether there are unsaved changes */
    hasUnsavedChanges,
    /** Whether a save operation is in progress */
    isSaving: isSavingRef.current,
    /** Last save timestamp */
    lastSaveTime: lastSaveTimeRef.current,
  };
}

/**
 * Hook to track changes and trigger auto-save
 */
export function useAutoSaveOnChange() {
  const { scheduleSave } = useAutoSave();

  const setHasUnsavedChanges = useEditorStore((state) => state.setHasUnsavedChanges);

  // Mark as changed and schedule save
  const markChanged = useCallback(() => {
    setHasUnsavedChanges(true);
    scheduleSave(2000); // 2 second debounce
  }, [setHasUnsavedChanges, scheduleSave]);

  return { markChanged };
}

export default useAutoSave;
