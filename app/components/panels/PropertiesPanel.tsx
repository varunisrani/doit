'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import { TransformSection } from './TransformSection';
import { StyleSection } from './StyleSection';
import { TextSection } from './TextSection';
import { ChevronDown, ChevronRight, Info, Lock, Unlock, Eye, EyeOff, Move, Paintbrush, Type as TypeIcon, Image as ImageIcon, Shapes } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { IconButton } from '@/app/components/ui/IconButton';
import { Input } from '@/app/components/ui/Input';
import type { TextElement } from '@/app/types/elements';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = true,
  children,
  icon,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border-primary)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-hover)] transition-all duration-200 group"
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              {icon}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-[var(--primary)]/10 text-[var(--primary)] rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 bg-[var(--surface-elevated)]/50">{children}</div>
      </div>
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
    <div className="flex flex-col h-full bg-[var(--surface)] border-l border-[var(--border-primary)] w-80 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Properties</h2>
        </div>
        {selectedIds.length > 0 && (
          <span className="px-2 py-1 text-xs bg-[var(--primary)]/10 text-[var(--primary)] rounded-full font-medium">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedIds.length === 0 ? (
          // No selection state
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">No element selected</p>
            <p className="text-xs text-[var(--text-tertiary)] max-w-[200px]">
              Select an element on the canvas to view and edit its properties
            </p>
          </div>
        ) : multipleSelected ? (
          // Multiple selection state
          <div className="p-4">
            <div className="mb-6 p-4 bg-[var(--info-bg)] border border-[var(--info)]/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--info)] mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--info)] mb-1">
                    Multiple Selection
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {selectedIds.length} elements selected. Changes will apply to all selected elements.
                  </p>
                </div>
              </div>
            </div>

            {/* Show common properties for multiple selection */}
            <CollapsibleSection title="Transform" defaultOpen={true} badge="Common">
              <TransformSection
                transform={selectedElement!.transform}
                onUpdate={handleTransformUpdate}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Style" defaultOpen={true} badge="Common">
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
            <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]/30">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                    Element Name
                  </label>
                  <Input
                    value={selectedElement.name}
                    onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                    placeholder="Enter element name..."
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
                    <span className="text-xs text-[var(--text-secondary)] block mb-1">Type</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] capitalize">
                      {selectedElement.type}
                    </span>
                  </div>
                  <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
                    <span className="text-xs text-[var(--text-secondary)] block mb-1">ID</span>
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">
                      {selectedElement.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transform Section */}
            <CollapsibleSection title="Transform" defaultOpen={true} icon={<Move className="w-4 h-4" />}>
              <TransformSection
                transform={selectedElement.transform}
                onUpdate={handleTransformUpdate}
                disabled={selectedElement.locked}
              />
            </CollapsibleSection>

            {/* Style Section */}
            <CollapsibleSection title="Style" defaultOpen={true} icon={<Paintbrush className="w-4 h-4" />}>
              <StyleSection
                style={selectedElement.style}
                onUpdate={handleStyleUpdate}
                disabled={selectedElement.locked}
              />
            </CollapsibleSection>

            {/* Text Section (only for text elements) */}
            {selectedElement.type === 'text' && (
              <CollapsibleSection title="Text Properties" defaultOpen={true} icon={<TypeIcon className="w-4 h-4" />}>
                <TextSection
                  element={selectedElement as TextElement}
                  onUpdate={handleTextUpdate}
                  disabled={selectedElement.locked}
                />
              </CollapsibleSection>
            )}

            {/* Image Section (only for image elements) */}
            {selectedElement.type === 'image' && (
              <CollapsibleSection title="Image Properties" defaultOpen={false} icon={<ImageIcon className="w-4 h-4" />}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                      Preview
                    </label>
                    <div className="mt-2 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
                      <img
                        src={(selectedElement as any).src}
                        alt={selectedElement.name}
                        className="w-full h-auto rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
                      <span className="text-xs text-[var(--text-secondary)] block mb-1">Width</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {(selectedElement as any).naturalWidth}px
                      </span>
                    </div>
                    <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
                      <span className="text-xs text-[var(--text-secondary)] block mb-1">Height</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {(selectedElement as any).naturalHeight}px
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Shape Section (only for shape elements) */}
            {selectedElement.type === 'shape' && (
              <CollapsibleSection title="Shape Properties" defaultOpen={false} icon={<Shapes className="w-4 h-4" />}>
                <div className="space-y-4">
                  <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
                    <span className="text-xs text-[var(--text-secondary)] block mb-1">Shape Type</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] capitalize">
                      {(selectedElement as any).shapeType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                      Fill Color
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)]">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-[var(--border-secondary)] shadow-sm"
                        style={{ backgroundColor: (selectedElement as any).fillColor }}
                      />
                      <span className="text-sm font-mono text-[var(--text-primary)]">
                        {(selectedElement as any).fillColor}
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Visibility and Lock Controls */}
            <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--surface-elevated)]/50">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => updateElement(selectedElement.id, { visible: !selectedElement.visible })}
                  variant={selectedElement.visible ? 'primary' : 'secondary'}
                  size="sm"
                  leftIcon={selectedElement.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  className="w-full"
                >
                  {selectedElement.visible ? 'Visible' : 'Hidden'}
                </Button>
                <Button
                  onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
                  variant={selectedElement.locked ? 'danger' : 'secondary'}
                  size="sm"
                  leftIcon={selectedElement.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  className="w-full"
                >
                  {selectedElement.locked ? 'Locked' : 'Unlocked'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
