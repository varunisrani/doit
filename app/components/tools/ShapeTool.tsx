'use client';

import React, { useState } from 'react';
import { Square, Circle, Triangle, Minus, ArrowRight, Shapes } from 'lucide-react';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow';

export interface ShapeElement {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius?: number;
  opacity: number;
}

interface ShapeToolProps {
  onAddShape: (element: ShapeElement) => void;
  selectedShape?: ShapeElement;
  onUpdateShape?: (element: ShapeElement) => void;
  isDrawing?: boolean;
}

export const ShapeTool: React.FC<ShapeToolProps> = ({
  onAddShape,
  selectedShape,
  onUpdateShape,
  isDrawing = false,
}) => {
  const [selectedType, setSelectedType] = useState<ShapeType>('rectangle');
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [borderRadius, setBorderRadius] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [fillEnabled, setFillEnabled] = useState(true);

  const shapeTypes: Array<{
    type: ShapeType;
    icon: React.ReactNode;
    label: string;
  }> = [
    { type: 'rectangle', icon: <Square className="w-5 h-5" />, label: 'Rectangle' },
    { type: 'circle', icon: <Circle className="w-5 h-5" />, label: 'Circle' },
    { type: 'triangle', icon: <Triangle className="w-5 h-5" />, label: 'Triangle' },
    { type: 'line', icon: <Minus className="w-5 h-5" />, label: 'Line' },
    { type: 'arrow', icon: <ArrowRight className="w-5 h-5" />, label: 'Arrow' },
  ];

  const presetShapes = [
    { label: 'Small', width: 100, height: 100 },
    { label: 'Medium', width: 200, height: 150 },
    { label: 'Large', width: 300, height: 200 },
  ];

  const handleAddPresetShape = (width: number, height: number) => {
    const newShape: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: selectedType,
      x: 150,
      y: 150,
      width,
      height,
      fillColor: fillEnabled ? fillColor : 'transparent',
      strokeColor,
      strokeWidth,
      borderRadius: selectedType === 'rectangle' ? borderRadius : 0,
      opacity,
    };

    onAddShape(newShape);
  };

  const handleUpdateShape = () => {
    if (selectedShape && onUpdateShape) {
      const updatedShape: ShapeElement = {
        ...selectedShape,
        fillColor: fillEnabled ? fillColor : 'transparent',
        strokeColor,
        strokeWidth,
        borderRadius: selectedShape.type === 'rectangle' ? borderRadius : 0,
        opacity,
      };

      onUpdateShape(updatedShape);
    }
  };

  React.useEffect(() => {
    if (selectedShape) {
      setSelectedType(selectedShape.type);
      if (selectedShape.fillColor && selectedShape.fillColor !== 'transparent') {
        setFillColor(selectedShape.fillColor);
        setFillEnabled(true);
      } else {
        setFillEnabled(false);
      }
      setStrokeColor(selectedShape.strokeColor);
      setStrokeWidth(selectedShape.strokeWidth);
      setBorderRadius(selectedShape.borderRadius || 0);
      setOpacity(selectedShape.opacity);
    }
  }, [selectedShape]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Shapes className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">Shape Tool</h3>
      </div>

      {/* Shape Type Selection */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Shape Type</label>
        <div className="grid grid-cols-5 gap-2">
          {shapeTypes.map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-3 rounded flex flex-col items-center gap-1 ${
                selectedType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors`}
              title={label}
            >
              {icon}
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Sizes */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Quick Add</label>
        <div className="grid grid-cols-3 gap-2">
          {presetShapes.map(({ label, width, height }) => (
            <button
              key={label}
              onClick={() => handleAddPresetShape(width, height)}
              className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-purple-600 transition-colors text-sm"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fill Color */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">Fill Color</label>
          <input
            type="checkbox"
            checked={fillEnabled}
            onChange={(e) => setFillEnabled(e.target.checked)}
            className="w-4 h-4 accent-purple-500"
          />
        </div>
        {fillEnabled && (
          <div className="flex gap-2">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-12 h-10 bg-gray-700 rounded border border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Stroke Color */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Stroke Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-12 h-10 bg-gray-700 rounded border border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <label className="text-sm text-gray-300 block mb-1">
          Stroke Width: {strokeWidth}px
        </label>
        <input
          type="range"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          min="0"
          max="20"
          className="w-full accent-purple-500"
        />
      </div>

      {/* Border Radius (for rectangles) */}
      {selectedType === 'rectangle' && (
        <div>
          <label className="text-sm text-gray-300 block mb-1">
            Border Radius: {borderRadius}px
          </label>
          <input
            type="range"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            min="0"
            max="50"
            className="w-full accent-purple-500"
          />
        </div>
      )}

      {/* Opacity */}
      <div>
        <label className="text-sm text-gray-300 block mb-1">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          min="0"
          max="1"
          step="0.1"
          className="w-full accent-purple-500"
        />
      </div>

      {/* Drawing Instructions */}
      <div className="bg-gray-700 rounded p-3 text-sm text-gray-300">
        <p className="font-semibold mb-1">How to draw:</p>
        <p>Click and drag on the canvas to draw the selected shape.</p>
      </div>

      {/* Update Button (when shape is selected) */}
      {selectedShape && onUpdateShape && (
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={handleUpdateShape}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors font-medium"
          >
            Update Shape
          </button>
        </div>
      )}
    </div>
  );
};

export default ShapeTool;
