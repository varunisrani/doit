'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

interface ZoomToolProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen?: () => void;
  onActualSize?: () => void;
}

export const ZoomTool: React.FC<ZoomToolProps> = ({
  zoom,
  onZoomChange,
  onFitToScreen,
  onActualSize,
}) => {
  const zoomPresets = [
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1 },
    { label: '150%', value: 1.5 },
    { label: '200%', value: 2 },
  ];

  const handleZoomIn = () => {
    const newZoom = Math.min(5, zoom + 0.1);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, zoom - 0.1);
    onZoomChange(newZoom);
  };

  const handleSliderChange = (value: number) => {
    onZoomChange(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <ZoomIn className="w-5 h-5 text-teal-400" />
        <h3 className="text-white font-semibold">Zoom Tool</h3>
      </div>

      {/* Current Zoom Display */}
      <div className="bg-gray-700 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white mb-1">
          {Math.round(zoom * 100)}%
        </div>
        <div className="text-xs text-gray-400">Current Zoom Level</div>
      </div>

      {/* Zoom Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleZoomOut}
          className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
          <span>Out</span>
        </button>
        <button
          onClick={handleZoomIn}
          className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
          <span>In</span>
        </button>
      </div>

      {/* Zoom Slider */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Zoom Level</label>
        <input
          type="range"
          value={zoom}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          min="0.1"
          max="5"
          step="0.1"
          className="w-full accent-teal-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>10%</span>
          <span>500%</span>
        </div>
      </div>

      {/* Zoom Presets */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Quick Zoom</label>
        <div className="grid grid-cols-3 gap-2">
          {zoomPresets.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => onZoomChange(value)}
              className={`px-3 py-2 rounded ${
                Math.abs(zoom - value) < 0.01
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors text-sm`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fit to Screen / Actual Size */}
      <div className="border-t border-gray-700 pt-4 space-y-2">
        <button
          onClick={onFitToScreen}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <Maximize className="w-4 h-4" />
          Fit to Screen
        </button>
        <button
          onClick={onActualSize}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <Minimize className="w-4 h-4" />
          Actual Size (100%)
        </button>
      </div>

      {/* Zoom Tips */}
      <div className="bg-gray-700 rounded p-3 text-sm text-gray-300">
        <p className="font-semibold mb-2">Keyboard Shortcuts:</p>
        <ul className="space-y-1 text-xs">
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">+</kbd> Zoom In
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">-</kbd> Zoom Out
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">0</kbd> Actual Size
          </li>
          <li>
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">9</kbd> Fit to Screen
          </li>
        </ul>
      </div>

      {/* Custom Zoom Input */}
      <div className="border-t border-gray-700 pt-4">
        <label className="text-sm text-gray-300 block mb-2">Custom Zoom (%)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={Math.round(zoom * 100)}
            onChange={(e) => {
              const value = Number(e.target.value) / 100;
              if (value >= 0.1 && value <= 5) {
                onZoomChange(value);
              }
            }}
            min="10"
            max="500"
            step="10"
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-teal-500 focus:outline-none"
          />
          <button
            onClick={() => onZoomChange(zoom)}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomTool;
