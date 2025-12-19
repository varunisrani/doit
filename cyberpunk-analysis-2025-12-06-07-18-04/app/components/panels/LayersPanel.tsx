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
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white">Layers</h2>
        <span className="text-xs text-zinc-500">{elements.length} layers</span>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Square className="w-12 h-12 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-500 mb-2">No layers yet</p>
            <p className="text-xs text-zinc-600">
              Add elements to the canvas to see them here
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedElements.map((element) => {
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
                  className={`group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  } ${isDragging ? 'opacity-50' : ''} ${
                    isDragOver ? 'border-2 border-blue-500' : ''
                  }`}
                >
                  {/* Drag Handle */}
                  {!element.locked && (
                    <GripVertical className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
                  )}

                  {/* Element Icon */}
                  <Icon className="w-4 h-4 flex-shrink-0" />

                  {/* Element Name */}
                  <span className="text-sm font-medium flex-1 truncate" title={element.name}>
                    {element.name}
                  </span>

                  {/* Visibility Toggle */}
                  <IconButton
                    icon={element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    onClick={(e) => toggleVisibility(element.id, e)}
                    size="sm"
                    variant="ghost"
                    title={element.visible ? 'Hide layer' : 'Show layer'}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />

                  {/* Lock Toggle */}
                  <IconButton
                    icon={element.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    onClick={(e) => toggleLock(element.id, e)}
                    size="sm"
                    variant="ghost"
                    title={element.locked ? 'Unlock layer' : 'Lock layer'}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with tips */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
        <p className="text-xs text-zinc-600">
          Drag layers to reorder. Cmd/Ctrl+Click to select multiple.
        </p>
      </div>
    </div>
  );
};
