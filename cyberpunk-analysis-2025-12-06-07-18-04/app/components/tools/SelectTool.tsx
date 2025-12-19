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
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Move className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Select Tool</h3>
        </div>
        <p className="text-sm text-gray-400">
          Click on an element to select and edit it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Move className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">Selected Element</h3>
      </div>

      {/* Element Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>ID:</span>
          <span className="text-gray-400 font-mono">{selectedElement.id}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Position:</span>
          <span className="text-gray-400">
            X: {Math.round(selectedElement.x)}, Y: {Math.round(selectedElement.y)}
          </span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Size:</span>
          <span className="text-gray-400">
            {Math.round(selectedElement.width)} × {Math.round(selectedElement.height)}
          </span>
        </div>
        {selectedElement.rotation !== undefined && (
          <div className="flex justify-between text-gray-300">
            <span>Rotation:</span>
            <span className="text-gray-400">{Math.round(selectedElement.rotation)}°</span>
          </div>
        )}
      </div>

      {/* Position Controls */}
      <div className="border-t border-gray-700 pt-4">
        <label className="text-sm text-gray-300 block mb-2">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 block mb-1">X</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) =>
                onMove && onMove(selectedElement.id, Number(e.target.value), selectedElement.y)
              }
              disabled={selectedElement.locked}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Y</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) =>
                onMove && onMove(selectedElement.id, selectedElement.x, Number(e.target.value))
              }
              disabled={selectedElement.locked}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="border-t border-gray-700 pt-4">
        <label className="text-sm text-gray-300 block mb-2">Size</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Width</label>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) =>
                onResize &&
                onResize(selectedElement.id, Number(e.target.value), selectedElement.height)
              }
              disabled={selectedElement.locked}
              min="20"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Height</label>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) =>
                onResize &&
                onResize(selectedElement.id, selectedElement.width, Number(e.target.value))
              }
              disabled={selectedElement.locked}
              min="20"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Rotation Control */}
      {selectedElement.rotation !== undefined && (
        <div className="border-t border-gray-700 pt-4">
          <label className="text-sm text-gray-300 block mb-2">
            Rotation: {Math.round(selectedElement.rotation)}°
          </label>
          <input
            type="range"
            value={selectedElement.rotation}
            onChange={(e) => onRotate && onRotate(selectedElement.id, Number(e.target.value))}
            disabled={selectedElement.locked}
            min="0"
            max="360"
            className="w-full accent-blue-500 disabled:opacity-50"
          />
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-700 pt-4 space-y-2">
        <button
          onClick={() => onLock && onLock(selectedElement.id, !selectedElement.locked)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
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
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy className="w-4 h-4" />
          Duplicate
        </button>

        <button
          onClick={() => onDelete && onDelete(selectedElement.id)}
          disabled={selectedElement.locked}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SelectTool;
