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
    <div className="h-full flex flex-col bg-[var(--surface)] text-[var(--text-primary)] border-r border-[var(--border-primary)] shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Transitions</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          {selectedClipId ? 'Click or drag to apply' : 'Select a clip first'}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]/50">
        {transitionCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 relative ${
              activeCategory === category.id
                ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {category.name}
            {activeCategory === category.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-6 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]/30">
        {/* Direction Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-wide">
            Direction
          </label>
          <div className="flex gap-3 p-1 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
            <button
              onClick={() => setTransitionDirection('in')}
              className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                transitionDirection === 'in'
                  ? 'bg-[var(--primary)] text-[var(--text-inverse)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              In
            </button>
            <button
              onClick={() => setTransitionDirection('out')}
              className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                transitionDirection === 'out'
                  ? 'bg-[var(--primary)] text-[var(--text-inverse)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              Out
            </button>
          </div>
        </div>

        {/* Duration Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-wide">
            Duration: {transitionDuration}ms
          </label>
          <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={transitionDuration}
              onChange={(e) => setTransitionDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-[var(--surface-hover)] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
              <span>100ms</span>
              <span>2000ms</span>
            </div>
          </div>
        </div>

        {/* Easing Select */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-wide">
            Easing
          </label>
          <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
            <select
              value={selectedEasing}
              onChange={(e) => setSelectedEasing(e.target.value as keyof typeof easingFunctions)}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            >
              <optgroup label="Basic" className="text-[var(--text-secondary)]">
                <option value="linear">Linear</option>
                <option value="easeInOutQuad">Ease In Out Quad</option>
                <option value="easeInOutCubic">Ease In Out Cubic</option>
                <option value="easeInOutQuart">Ease In Out Quart</option>
              </optgroup>
              <optgroup label="Ease In" className="text-[var(--text-secondary)]">
                <option value="easeInQuad">Ease In Quad</option>
                <option value="easeInCubic">Ease In Cubic</option>
                <option value="easeInQuart">Ease In Quart</option>
                <option value="easeInExpo">Ease In Expo</option>
              </optgroup>
              <optgroup label="Ease Out" className="text-[var(--text-secondary)]">
                <option value="easeOutQuad">Ease Out Quad</option>
                <option value="easeOutCubic">Ease Out Cubic</option>
                <option value="easeOutQuart">Ease Out Quart</option>
                <option value="easeOutExpo">Ease Out Expo</option>
              </optgroup>
              <optgroup label="Advanced" className="text-[var(--text-secondary)]">
                <option value="easeInOutExpo">Ease In Out Expo</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Transitions Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
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
                className={`group relative bg-[var(--surface-elevated)] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                  isDragging
                    ? 'opacity-50 scale-95 border-[var(--primary)]/50'
                    : 'border-[var(--border-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-secondary)] hover:shadow-lg hover:scale-[1.02]'
                } ${!selectedClipId ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={metadata.description}
              >
                {/* Preview Canvas */}
                <div className="relative aspect-video bg-[var(--surface)]">
                  <canvas
                    ref={(el) => {
                      if (el) canvasRefs.current.set(type, el);
                    }}
                    width={120}
                    height={68}
                    className="w-full h-full"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-start p-2">
                    <div className="text-white">
                      <p className="text-xs font-medium">{metadata.name}</p>
                      <p className="text-xs opacity-75">Click to apply</p>
                    </div>
                  </div>

                  {/* Type indicator */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                    {transitionDirection === 'in' ? 'In' : 'Out'}
                  </div>
                </div>

                {/* Transition Info */}
                <div className="p-3 bg-[var(--surface-elevated)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {metadata.name}
                    </span>
                    <span className="text-lg text-[var(--text-secondary)]">{metadata.icon}</span>
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    {transitionDuration}ms
                  </div>
                </div>

                {/* Drag Indicator */}
                {isDragging && (
                  <div className="absolute inset-0 border-2 border-[var(--primary)] rounded-xl pointer-events-none bg-[var(--primary)]/5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {activeTransitions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] font-medium">No transitions available</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Quick Apply Buttons */}
      {selectedClipId && (
        <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--surface-elevated)]/50">
          <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-3">
            Quick Apply
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleTransitionClick('fade')}
              className="py-2.5 px-3 bg-[var(--surface)] border border-[var(--border-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-secondary)] rounded-lg text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:shadow-sm"
            >
              Fade {transitionDirection === 'in' ? 'In' : 'Out'}
            </button>
            <button
              onClick={() => handleTransitionClick('dissolve')}
              className="py-2.5 px-3 bg-[var(--surface)] border border-[var(--border-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-secondary)] rounded-lg text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:shadow-sm"
            >
              Dissolve
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: var(--primary);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid var(--surface);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: var(--primary);
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid var(--surface);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-webkit-slider-thumb:hover {
          background: var(--primary-light);
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb:hover {
          background: var(--primary-light);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
