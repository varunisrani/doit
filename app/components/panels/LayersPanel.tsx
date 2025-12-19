'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Image as ImageIcon,
  Type,
  Square,
  Video,
  GripVertical,
} from 'lucide-react';
import { IconButton } from '@/app/components/ui/IconButton';
import type { CanvasElement } from '@/app/types/elements';

export const LayersPanel: React.FC = () => {
  const { elements, updateElement } = useCanvasStore();
  const { selectedElementIds, selectElement, toggleElementSelection, setMultiSelectMode } = useSelectionStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Sort elements by z-index (highest first)
  const sortedElements = [...elements].sort((a, b) => b.style.zIndex - a.style.zIndex);

  const getElementIcon = (element: CanvasElement) => {
    switch (element.type) {
      case 'image':
        return ImageIcon;
      case 'text':
        return Type;
      case 'shape':
        return Square;
      case 'video':
        return Video;
      default:
        return Square;
    }
  };

  const handleElementClick = (id: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setMultiSelectMode(true);
      toggleElementSelection(id);
    } else {
      setMultiSelectMode(false);
      selectElement(id);
    }
  };

  const toggleVisibility = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = elements.find((el) => el.id === id);
    if (element) {
      updateElement(id, { visible: !element.visible });
    }
  };

  const toggleLock = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = elements.find((el) => el.id === id);
    if (element) {
      updateElement(id, { locked: !element.locked });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedElement = elements.find((el) => el.id === draggedId);
    const targetElement = elements.find((el) => el.id === targetId);

    if (draggedElement && targetElement) {
      // Swap z-index values
      const tempZIndex = draggedElement.style.zIndex;
      updateElement(draggedId, { style: { ...draggedElement.style, zIndex: targetElement.style.zIndex } });
      updateElement(targetId, { style: { ...targetElement.style, zIndex: tempZIndex } });
    }

    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-l border-[var(--border-primary)] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Layers</h2>
        </div>
        <span className="px-2 py-1 text-xs bg-[var(--surface-hover)] text-[var(--text-secondary)] rounded-full font-medium">
          {elements.length} {elements.length === 1 ? 'layer' : 'layers'}
        </span>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-4">
              <Square className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">No layers yet</p>
            <p className="text-xs text-[var(--text-tertiary)] max-w-[200px]">
              Add elements to the canvas to see them here
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {sortedElements.map((element, index) => {
              const Icon = getElementIcon(element);
              const isSelected = selectedElementIds.has(element.id);
              const isDragging = draggedId === element.id;
              const isDragOver = dragOverId === element.id;

              return (
                <div
                  key={element.id}
                  draggable={!element.locked}
                  onDragStart={() => handleDragStart(element.id)}
                  onDragOver={(e) => handleDragOver(e, element.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, element.id)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => handleElementClick(element.id, e)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 shadow-sm'
                      : 'bg-[var(--surface-elevated)]/50 border border-[var(--border-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-secondary)] hover:shadow-sm'
                  } ${isDragging ? 'opacity-50 scale-95' : ''} ${
                    isDragOver ? 'border-[var(--primary)]/50 bg-[var(--primary)]/5' : ''
                  }`}
                >
                  {/* Z-index indicator */}
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--surface-hover)] border border-[var(--border-secondary)]">
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">
                      {index + 1}
                    </span>
                  </div>

                  {/* Drag Handle */}
                  {!element.locked && (
                    <div className="flex items-center justify-center w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                  )}

                  {/* Element Icon with color coding */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-md ${
                    isSelected ? 'bg-[var(--primary)]/20' : 'bg-[var(--surface-hover)]'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'
                    }`} />
                  </div>

                  {/* Element Name */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium truncate block ${
                        isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                      }`}
                      title={element.name}
                    >
                      {element.name}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] capitalize">
                      {element.type}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                      icon={element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      onClick={(e) => toggleVisibility(element.id, e)}
                      size="sm"
                      variant="ghost"
                      title={element.visible ? 'Hide layer' : 'Show layer'}
                      className={`w-7 h-7 ${
                        element.visible
                          ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--warning)]'
                      }`}
                    />
                    <IconButton
                      icon={element.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      onClick={(e) => toggleLock(element.id, e)}
                      size="sm"
                      variant="ghost"
                      title={element.locked ? 'Unlock layer' : 'Lock layer'}
                      className={`w-7 h-7 ${
                        element.locked
                          ? 'text-[var(--error)]'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                      }`}
                    />
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] rounded-l-lg"></div>
                  )}

                  {/* Drag overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 border-2 border-[var(--primary)] rounded-lg pointer-events-none bg-[var(--primary)]/5"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with tips */}
      <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--surface-elevated)]/50">
        <div className="flex items-start gap-2">
          <div className="w-1 h-1 rounded-full bg-[var(--text-tertiary)] mt-1.5"></div>
          <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            <span className="font-medium">Tips:</span> Drag layers to reorder. Cmd/Ctrl+Click to select multiple. Click the visibility icon to toggle visibility.
          </p>
        </div>
      </div>
    </div>
  );
};
