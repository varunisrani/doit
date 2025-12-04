'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Crop, Check, X, Maximize2, Grid3x3 } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropToolProps {
  targetElement?: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onApplyCrop?: (id: string, cropArea: CropArea) => void;
  onCancelCrop?: () => void;
}

export const CropTool: React.FC<CropToolProps> = ({
  targetElement,
  onApplyCrop,
  onCancelCrop,
}) => {
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: targetElement?.width || 100,
    height: targetElement?.height || 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const aspectRatioPresets = [
    { label: 'Free', ratio: null },
    { label: '16:9', ratio: 16 / 9 },
    { label: '4:3', ratio: 4 / 3 },
    { label: '1:1', ratio: 1 },
    { label: '9:16', ratio: 9 / 16 },
  ];

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
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
      if (!targetElement) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      if (isDragging) {
        setCropArea((prev) => ({
          ...prev,
          x: Math.max(0, Math.min(targetElement.width - prev.width, prev.x + deltaX)),
          y: Math.max(0, Math.min(targetElement.height - prev.height, prev.y + deltaY)),
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing && resizeHandle) {
        setCropArea((prev) => {
          let newX = prev.x;
          let newY = prev.y;
          let newWidth = prev.width;
          let newHeight = prev.height;

          if (resizeHandle.includes('e')) {
            newWidth = Math.min(targetElement.width - prev.x, Math.max(50, prev.width + deltaX));
          } else if (resizeHandle.includes('w')) {
            const change = Math.min(prev.x, Math.max(-prev.width + 50, deltaX));
            newX = prev.x + change;
            newWidth = prev.width - change;
          }

          if (resizeHandle.includes('s')) {
            newHeight = Math.min(
              targetElement.height - prev.y,
              Math.max(50, prev.height + deltaY)
            );
          } else if (resizeHandle.includes('n')) {
            const change = Math.min(prev.y, Math.max(-prev.height + 50, deltaY));
            newY = prev.y + change;
            newHeight = prev.height - change;
          }

          // Apply aspect ratio if set
          if (aspectRatio) {
            if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
              newHeight = newWidth / aspectRatio;
            } else {
              newWidth = newHeight * aspectRatio;
            }
          }

          return { x: newX, y: newY, width: newWidth, height: newHeight };
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, isResizing, dragStart, targetElement, resizeHandle, aspectRatio]
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

  React.useEffect(() => {
    if (targetElement) {
      setCropArea({
        x: 0,
        y: 0,
        width: targetElement.width,
        height: targetElement.height,
      });
    }
  }, [targetElement]);

  const handleApply = () => {
    if (targetElement && onApplyCrop) {
      onApplyCrop(targetElement.id, cropArea);
    }
  };

  const handleReset = () => {
    if (targetElement) {
      setCropArea({
        x: 0,
        y: 0,
        width: targetElement.width,
        height: targetElement.height,
      });
    }
  };

  if (!targetElement) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Crop className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-semibold">Crop Tool</h3>
        </div>
        <p className="text-sm text-gray-400">Select an element to crop.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Crop className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold">Crop Tool</h3>
      </div>

      {/* Aspect Ratio Presets */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Aspect Ratio</label>
        <div className="grid grid-cols-5 gap-2">
          {aspectRatioPresets.map(({ label, ratio }) => (
            <button
              key={label}
              onClick={() => setAspectRatio(ratio)}
              className={`px-2 py-2 rounded text-sm ${
                aspectRatio === ratio
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Area Dimensions */}
      <div className="border-t border-gray-700 pt-4">
        <label className="text-sm text-gray-300 block mb-2">Crop Area</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 block mb-1">X</label>
            <input
              type="number"
              value={Math.round(cropArea.x)}
              onChange={(e) =>
                setCropArea((prev) => ({
                  ...prev,
                  x: Math.max(0, Math.min(targetElement.width - prev.width, Number(e.target.value))),
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Y</label>
            <input
              type="number"
              value={Math.round(cropArea.y)}
              onChange={(e) =>
                setCropArea((prev) => ({
                  ...prev,
                  y: Math.max(
                    0,
                    Math.min(targetElement.height - prev.height, Number(e.target.value))
                  ),
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Width</label>
            <input
              type="number"
              value={Math.round(cropArea.width)}
              onChange={(e) =>
                setCropArea((prev) => ({
                  ...prev,
                  width: Math.max(50, Math.min(targetElement.width - prev.x, Number(e.target.value))),
                }))
              }
              min="50"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Height</label>
            <input
              type="number"
              value={Math.round(cropArea.height)}
              onChange={(e) =>
                setCropArea((prev) => ({
                  ...prev,
                  height: Math.max(
                    50,
                    Math.min(targetElement.height - prev.y, Number(e.target.value))
                  ),
                }))
              }
              min="50"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid Toggle */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 ${
            showGrid ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } transition-colors`}
        >
          <Grid3x3 className="w-4 h-4" />
          Show Grid (Rule of Thirds)
        </button>
      </div>

      {/* Crop Info */}
      <div className="bg-gray-700 rounded p-3 text-sm text-gray-300 space-y-1">
        <p>
          <span className="font-semibold">Original:</span> {targetElement.width} × {targetElement.height}
        </p>
        <p>
          <span className="font-semibold">Crop:</span> {Math.round(cropArea.width)} ×{' '}
          {Math.round(cropArea.height)}
        </p>
        <p>
          <span className="font-semibold">Ratio:</span>{' '}
          {(cropArea.width / cropArea.height).toFixed(2)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-700 pt-4 space-y-2">
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          Reset to Full Size
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCancelCrop}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropTool;
