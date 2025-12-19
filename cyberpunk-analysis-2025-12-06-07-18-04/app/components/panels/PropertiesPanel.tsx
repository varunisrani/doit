'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import { TransformSection } from './TransformSection';
import { StyleSection } from './StyleSection';
import { TextSection } from './TextSection';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import type { TextElement } from '@/app/types/elements';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        )}
      </button>
      {isOpen && <div className="px-4 py-3">{children}</div>}
    </div>
  );
};

export const PropertiesPanel: React.FC = () => {
  const { elements, updateElement, updateElementTransform, updateElementStyle } = useCanvasStore();
  const { selectedElementIds, getSelectedElements } = useSelectionStore();

  const selectedIds = getSelectedElements();
  const selectedElement = selectedIds.length === 1 ? elements.find((el) => el.id === selectedIds[0]) : null;
  const multipleSelected = selectedIds.length > 1;

  // Handle transform updates
  const handleTransformUpdate = (updates: Partial<typeof selectedElement.transform>) => {
    if (!selectedElement) return;

    if (multipleSelected) {
      // Apply to all selected elements
      selectedIds.forEach((id) => {
        updateElementTransform(id, updates);
      });
    } else {
      updateElementTransform(selectedElement.id, updates);
    }
  };

  // Handle style updates
  const handleStyleUpdate = (updates: Partial<typeof selectedElement.style>) => {
    if (!selectedElement) return;

    if (multipleSelected) {
      // Apply to all selected elements
      selectedIds.forEach((id) => {
        updateElementStyle(id, updates);
      });
    } else {
      updateElementStyle(selectedElement.id, updates);
    }
  };

  // Handle text element updates
  const handleTextUpdate = (updates: Partial<TextElement>) => {
    if (!selectedElement || selectedElement.type !== 'text') return;

    if (multipleSelected) {
      // Apply to all selected text elements
      selectedIds.forEach((id) => {
        const el = elements.find((e) => e.id === id);
        if (el && el.type === 'text') {
          updateElement(id, updates);
        }
      });
    } else {
      updateElement(selectedElement.id, updates);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white">Properties</h2>
        {selectedIds.length > 0 && (
          <span className="text-xs text-zinc-500">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedIds.length === 0 ? (
          // No selection state
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Info className="w-12 h-12 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-500 mb-2">No element selected</p>
            <p className="text-xs text-zinc-600">
              Select an element on the canvas to view and edit its properties
            </p>
          </div>
        ) : multipleSelected ? (
          // Multiple selection state
          <div className="p-4">
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded-md">
              <p className="text-xs text-blue-400">
                {selectedIds.length} elements selected. Changes will apply to all selected elements.
              </p>
            </div>

            {/* Show common properties for multiple selection */}
            <CollapsibleSection title="Transform" defaultOpen={true}>
              <TransformSection
                transform={selectedElement!.transform}
                onUpdate={handleTransformUpdate}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Style" defaultOpen={true}>
              <StyleSection
                style={selectedElement!.style}
                onUpdate={handleStyleUpdate}
              />
            </CollapsibleSection>
          </div>
        ) : selectedElement ? (
          // Single selection state
          <div>
            {/* Element Info */}
            <div className="p-4 border-b border-zinc-800">
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Type</span>
                  <span className="text-xs text-white font-medium capitalize">
                    {selectedElement.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">ID</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {selectedElement.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Transform Section */}
            <CollapsibleSection title="Transform" defaultOpen={true}>
              <TransformSection
                transform={selectedElement.transform}
                onUpdate={handleTransformUpdate}
                disabled={selectedElement.locked}
              />
            </CollapsibleSection>

            {/* Style Section */}
            <CollapsibleSection title="Style" defaultOpen={true}>
              <StyleSection
                style={selectedElement.style}
                onUpdate={handleStyleUpdate}
                disabled={selectedElement.locked}
              />
            </CollapsibleSection>

            {/* Text Section (only for text elements) */}
            {selectedElement.type === 'text' && (
              <CollapsibleSection title="Text Properties" defaultOpen={true}>
                <TextSection
                  element={selectedElement as TextElement}
                  onUpdate={handleTextUpdate}
                  disabled={selectedElement.locked}
                />
              </CollapsibleSection>
            )}

            {/* Image Section (only for image elements) */}
            {selectedElement.type === 'image' && (
              <CollapsibleSection title="Image Properties" defaultOpen={false}>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400">Source</label>
                    <div className="mt-1 p-2 bg-zinc-800 rounded-md">
                      <img
                        src={(selectedElement as any).src}
                        alt={selectedElement.name}
                        className="w-full h-auto rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-400">Width:</span>
                      <span className="ml-2 text-white">{(selectedElement as any).naturalWidth}px</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Height:</span>
                      <span className="ml-2 text-white">{(selectedElement as any).naturalHeight}px</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Shape Section (only for shape elements) */}
            {selectedElement.type === 'shape' && (
              <CollapsibleSection title="Shape Properties" defaultOpen={false}>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2">Shape Type</label>
                    <span className="text-sm text-white capitalize">
                      {(selectedElement as any).shapeType}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2">Fill Color</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-zinc-600"
                        style={{ backgroundColor: (selectedElement as any).fillColor }}
                      />
                      <span className="text-sm text-white font-mono">
                        {(selectedElement as any).fillColor}
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Visibility and Lock */}
            <div className="p-4 border-t border-zinc-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateElement(selectedElement.id, { visible: !selectedElement.visible })}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    selectedElement.visible
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {selectedElement.visible ? 'Visible' : 'Hidden'}
                </button>
                <button
                  onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    selectedElement.locked
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {selectedElement.locked ? 'Locked' : 'Unlocked'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
