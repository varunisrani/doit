'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Move, Trash2, Copy, Lock, Unlock } from 'lucide-react';

export interface SelectableElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
}

interface SelectToolProps {
  selectedElement?: SelectableElement;
  onMove?: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onRotate?: (id: string, rotation: number) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onLock?: (id: string, locked: boolean) => void;
}

export const SelectTool: React.FC<SelectToolProps> = ({
  selectedElement,
  onMove,
  onResize,
  onRotate,
  onDelete,
  onDuplicate,
  onLock,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    if (!selectedElement || selectedElement.locked) return;

    e.preventDefault();
    e.stopPropagation();

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!selectedElement) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      if (isDragging && onMove) {
        onMove(selectedElement.id, selectedElement.x + deltaX, selectedElement.y + deltaY);
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing && onResize && resizeHandle) {
        let newWidth = selectedElement.width;
        let newHeight = selectedElement.height;

        if (resizeHandle.includes('e')) {
          newWidth = Math.max(20, selectedElement.width + deltaX);
        } else if (resizeHandle.includes('w')) {
          newWidth = Math.max(20, selectedElement.width - deltaX);
        }

        if (resizeHandle.includes('s')) {
          newHeight = Math.max(20, selectedElement.height + deltaY);
        } else if (resizeHandle.includes('n')) {
          newHeight = Math.max(20, selectedElement.height - deltaY);
        }

        onResize(selectedElement.id, newWidth, newHeight);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, isResizing, dragStart, selectedElement, onMove, onResize, resizeHandle]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!selectedElement) {
    return (
      <div className="panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
            <Move className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-[var(--text-primary)] font-semibold text-lg">Select Tool</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Click on an element to select and edit it. Use <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)' }}>Shift+Click</kbd> for multiple selection.
        </p>
      </div>
    );
  }

  return (
    <div className="panel p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Move className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-[var(--text-primary)] font-semibold text-lg">Selected Element</h3>
      </div>

      {/* Modern Element Info */}
      <div
        className="p-4 rounded-lg border border-[var(--border-secondary)] space-y-3"
        style={{ background: 'var(--surface-hover)' }}
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--text-secondary)]">ID:</span>
          <span className="text-[var(--text-primary)] font-mono text-xs px-2 py-1 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border-primary)' }}>
            {selectedElement.id}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--text-secondary)]">Position:</span>
          <span className="text-[var(--text-primary)] font-mono font-medium">
            X: {Math.round(selectedElement.x)}, Y: {Math.round(selectedElement.y)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--text-secondary)]">Size:</span>
          <span className="text-[var(--text-primary)] font-mono font-medium">
            {Math.round(selectedElement.width)} × {Math.round(selectedElement.height)}
          </span>
        </div>
        {selectedElement.rotation !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-secondary)]">Rotation:</span>
            <span className="text-[var(--accent)] font-mono font-medium">{Math.round(selectedElement.rotation)}°</span>
          </div>
        )}
      </div>

      {/* Position Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
          <label className="text-sm font-medium text-[var(--text-primary)]">Position</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-2">X</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) =>
                onMove && onMove(selectedElement.id, Number(e.target.value), selectedElement.y)
              }
              disabled={selectedElement.locked}
              className="input"
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: '0.875rem',
                background: 'var(--surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-2">Y</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) =>
                onMove && onMove(selectedElement.id, selectedElement.x, Number(e.target.value))
              }
              disabled={selectedElement.locked}
              className="input"
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: '0.875rem',
                background: 'var(--surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
          <label className="text-sm font-medium text-[var(--text-primary)]">Size</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-2">Width</label>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) =>
                onResize &&
                onResize(selectedElement.id, Number(e.target.value), selectedElement.height)
              }
              disabled={selectedElement.locked}
              min="20"
              className="input"
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: '0.875rem',
                background: 'var(--surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-2">Height</label>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) =>
                onResize &&
                onResize(selectedElement.id, selectedElement.width, Number(e.target.value))
              }
              disabled={selectedElement.locked}
              min="20"
              className="input"
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: '0.875rem',
                background: 'var(--surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Rotation Control */}
      {selectedElement.rotation !== undefined && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: 'var(--info)' }}></div>
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Rotation: {Math.round(selectedElement.rotation)}°
            </label>
          </div>
          <input
            type="range"
            value={selectedElement.rotation}
            onChange={(e) => onRotate && onRotate(selectedElement.id, Number(e.target.value))}
            disabled={selectedElement.locked}
            min="0"
            max="360"
            className="w-full"
            style={{
              accentColor: 'var(--primary)',
            }}
          />
        </div>
      )}

      {/* Modern Actions */}
      <div className="space-y-3 pt-4 border-t border-[var(--border-primary)]">
        <button
          onClick={() => onLock && onLock(selectedElement.id, !selectedElement.locked)}
          className={`btn w-full flex items-center justify-center gap-2 ${
            selectedElement.locked ? 'btn-warning' : 'btn-secondary'
          }`}
          style={{ minHeight: '44px' }}
        >
          {selectedElement.locked ? (
            <>
              <Unlock className="w-4 h-4" />
              Unlock Element
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Lock Element
            </>
          )}
        </button>

        <button
          onClick={() => onDuplicate && onDuplicate(selectedElement.id)}
          disabled={selectedElement.locked}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          style={{ minHeight: '44px' }}
        >
          <Copy className="w-4 h-4" />
          Duplicate
        </button>

        <button
          onClick={() => onDelete && onDelete(selectedElement.id)}
          disabled={selectedElement.locked}
          className="btn btn-danger w-full flex items-center justify-center gap-2"
          style={{ minHeight: '44px' }}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SelectTool;
