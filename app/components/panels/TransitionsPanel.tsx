'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  TransitionType,
  TransitionDirection,
  transitionCategories,
  transitionMetadata,
  createTransition,
  generateTransitionPreview,
  easingFunctions
} from '@/app/lib/effects/transitions';

interface TransitionsPanelProps {
  onTransitionSelect?: (type: TransitionType, direction: TransitionDirection) => void;
  selectedClipId?: string | null;
}

export default function TransitionsPanel({
  onTransitionSelect,
  selectedClipId
}: TransitionsPanelProps) {
  const [activeCategory, setActiveCategory] = useState('fade');
  const [transitionDuration, setTransitionDuration] = useState(500);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('in');
  const [selectedEasing, setSelectedEasing] = useState<keyof typeof easingFunctions>('easeInOutQuad');
  const [draggedTransition, setDraggedTransition] = useState<TransitionType | null>(null);

  const canvasRefs = useRef<Map<TransitionType, HTMLCanvasElement>>(new Map());

  // Generate previews when category changes
  useEffect(() => {
    const category = transitionCategories.find(c => c.id === activeCategory);
    if (!category) return;

    category.transitions.forEach(transitionType => {
      const canvas = canvasRefs.current.get(transitionType);
      if (canvas) {
        const transition = createTransition(
          transitionType,
          transitionDirection,
          transitionDuration,
          selectedEasing
        );
        generateTransitionPreview(canvas, transition, { width: 120, height: 68 });
      }
    });
  }, [activeCategory, transitionDirection, transitionDuration, selectedEasing]);

  const handleTransitionClick = (type: TransitionType) => {
    if (onTransitionSelect) {
      onTransitionSelect(type, transitionDirection);
    }
  };

  const handleDragStart = (e: React.DragEvent, type: TransitionType) => {
    setDraggedTransition(type);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/transition', JSON.stringify({
      type,
      direction: transitionDirection,
      duration: transitionDuration,
      easing: selectedEasing
    }));
  };

  const handleDragEnd = () => {
    setDraggedTransition(null);
  };

  const activeTransitions = transitionCategories.find(
    c => c.id === activeCategory
  )?.transitions ?? [];

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Transitions</h2>
        <p className="text-sm text-gray-400">
          {selectedClipId ? 'Click or drag to apply' : 'Select a clip first'}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {transitionCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4 border-b border-gray-700 bg-gray-850">
        {/* Direction Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Direction</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTransitionDirection('in')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                transitionDirection === 'in'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Transition In
            </button>
            <button
              onClick={() => setTransitionDirection('out')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                transitionDirection === 'out'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Transition Out
            </button>
          </div>
        </div>

        {/* Duration Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Duration: {transitionDuration}ms
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={transitionDuration}
            onChange={(e) => setTransitionDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100ms</span>
            <span>2000ms</span>
          </div>
        </div>

        {/* Easing Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Easing</label>
          <select
            value={selectedEasing}
            onChange={(e) => setSelectedEasing(e.target.value as keyof typeof easingFunctions)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="Basic">
              <option value="linear">Linear</option>
              <option value="easeInOutQuad">Ease In Out Quad</option>
              <option value="easeInOutCubic">Ease In Out Cubic</option>
              <option value="easeInOutQuart">Ease In Out Quart</option>
            </optgroup>
            <optgroup label="Ease In">
              <option value="easeInQuad">Ease In Quad</option>
              <option value="easeInCubic">Ease In Cubic</option>
              <option value="easeInQuart">Ease In Quart</option>
              <option value="easeInExpo">Ease In Expo</option>
            </optgroup>
            <optgroup label="Ease Out">
              <option value="easeOutQuad">Ease Out Quad</option>
              <option value="easeOutCubic">Ease Out Cubic</option>
              <option value="easeOutQuart">Ease Out Quart</option>
              <option value="easeOutExpo">Ease Out Expo</option>
            </optgroup>
            <optgroup label="Advanced">
              <option value="easeInOutExpo">Ease In Out Expo</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Transitions Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {activeTransitions.map(type => {
            const metadata = transitionMetadata[type];
            const isDragging = draggedTransition === type;

            return (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onDragEnd={handleDragEnd}
                onClick={() => handleTransitionClick(type)}
                className={`group relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  isDragging
                    ? 'opacity-50 scale-95'
                    : 'hover:bg-gray-700 hover:scale-105'
                } ${!selectedClipId ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={metadata.description}
              >
                {/* Preview Canvas */}
                <div className="relative aspect-video bg-gray-900">
                  <canvas
                    ref={(el) => {
                      if (el) canvasRefs.current.set(type, el);
                    }}
                    width={120}
                    height={68}
                    className="w-full h-full"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                      {metadata.icon}
                    </div>
                  </div>
                </div>

                {/* Transition Info */}
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {metadata.name}
                    </span>
                    <span className="text-lg ml-1">{metadata.icon}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {transitionDirection === 'in' ? 'In' : 'Out'} • {transitionDuration}ms
                  </div>
                </div>

                {/* Drag Indicator */}
                {isDragging && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {activeTransitions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No transitions available</p>
          </div>
        )}
      </div>

      {/* Quick Apply Buttons */}
      {selectedClipId && (
        <div className="p-4 border-t border-gray-700 bg-gray-850">
          <div className="text-xs text-gray-400 mb-2">Quick Apply:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTransitionClick('fade')}
              className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Fade {transitionDirection === 'in' ? 'In' : 'Out'}
            </button>
            <button
              onClick={() => handleTransitionClick('dissolve')}
              className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Dissolve
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
        }

        .slider::-moz-range-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}
