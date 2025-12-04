'use client';

import { useEffect, useCallback } from 'react';

export type ToolType = 'select' | 'text' | 'shape' | 'hand' | 'crop' | 'zoom';

interface KeyboardShortcuts {
  onToolChange?: (tool: ToolType) => void;
  onPlayPause?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomActual?: () => void;
  onZoomFit?: () => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
  disabled?: boolean;
}

export const useKeyboard = ({
  onToolChange,
  onPlayPause,
  onDelete,
  onCopy,
  onPaste,
  onCut,
  onUndo,
  onRedo,
  onSave,
  onZoomIn,
  onZoomOut,
  onZoomActual,
  onZoomFit,
  onSelectAll,
  onDeselect,
  disabled = false,
}: KeyboardShortcuts = {}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true';

      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const key = event.key.toLowerCase();

      // Tool switching shortcuts (when not in input field)
      if (!isInputField && !isCtrl && !isShift) {
        switch (key) {
          case 'v':
            event.preventDefault();
            onToolChange?.('select');
            break;
          case 't':
            event.preventDefault();
            onToolChange?.('text');
            break;
          case 's':
            event.preventDefault();
            onToolChange?.('shape');
            break;
          case 'h':
            event.preventDefault();
            onToolChange?.('hand');
            break;
          case 'c':
            event.preventDefault();
            onToolChange?.('crop');
            break;
          case 'z':
            event.preventDefault();
            onToolChange?.('zoom');
            break;
          case ' ':
            // Spacebar for play/pause
            event.preventDefault();
            onPlayPause?.();
            break;
          case 'delete':
          case 'backspace':
            // Delete selected element
            if (!isInputField) {
              event.preventDefault();
              onDelete?.();
            }
            break;
          case 'escape':
            // Deselect
            event.preventDefault();
            onDeselect?.();
            break;
        }
      }

      // Ctrl/Cmd shortcuts
      if (isCtrl) {
        switch (key) {
          case 'c':
            // Copy
            if (!isInputField) {
              event.preventDefault();
              onCopy?.();
            }
            break;
          case 'v':
            // Paste
            if (!isInputField) {
              event.preventDefault();
              onPaste?.();
            }
            break;
          case 'x':
            // Cut
            if (!isInputField) {
              event.preventDefault();
              onCut?.();
            }
            break;
          case 'z':
            // Undo/Redo
            event.preventDefault();
            if (isShift) {
              onRedo?.();
            } else {
              onUndo?.();
            }
            break;
          case 'y':
            // Redo (alternative)
            event.preventDefault();
            onRedo?.();
            break;
          case 's':
            // Save
            event.preventDefault();
            onSave?.();
            break;
          case 'a':
            // Select All
            if (!isInputField) {
              event.preventDefault();
              onSelectAll?.();
            }
            break;
          case '=':
          case '+':
            // Zoom In
            event.preventDefault();
            onZoomIn?.();
            break;
          case '-':
          case '_':
            // Zoom Out
            event.preventDefault();
            onZoomOut?.();
            break;
          case '0':
            // Actual Size
            event.preventDefault();
            onZoomActual?.();
            break;
          case '9':
            // Fit to Screen
            event.preventDefault();
            onZoomFit?.();
            break;
        }
      }
    },
    [
      disabled,
      onToolChange,
      onPlayPause,
      onDelete,
      onCopy,
      onPaste,
      onCut,
      onUndo,
      onRedo,
      onSave,
      onZoomIn,
      onZoomOut,
      onZoomActual,
      onZoomFit,
      onSelectAll,
      onDeselect,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

// Export keyboard shortcuts reference for documentation
export const KEYBOARD_SHORTCUTS = {
  tools: {
    select: 'V',
    text: 'T',
    shape: 'S',
    hand: 'H',
    crop: 'C',
    zoom: 'Z',
  },
  playback: {
    playPause: 'Space',
  },
  edit: {
    delete: 'Delete/Backspace',
    copy: 'Ctrl+C',
    paste: 'Ctrl+V',
    cut: 'Ctrl+X',
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Shift+Z or Ctrl+Y',
    save: 'Ctrl+S',
    selectAll: 'Ctrl+A',
    deselect: 'Escape',
  },
  zoom: {
    zoomIn: 'Ctrl++',
    zoomOut: 'Ctrl+-',
    actualSize: 'Ctrl+0',
    fitToScreen: 'Ctrl+9',
  },
};

export default useKeyboard;
