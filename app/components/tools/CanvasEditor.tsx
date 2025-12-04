'use client';

import React, { useState, useRef } from 'react';
import { Toolbar, ToolType } from './Toolbar';
import { TextTool } from './TextTool';
import { ShapeTool, ShapeType, ShapeElement } from './ShapeTool';
import { SelectTool, SelectableElement } from './SelectTool';
import { CropTool } from './CropTool';
import { ZoomTool } from './ZoomTool';
import { useKeyboard } from '../../hooks/useKeyboard';

interface TextElement {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  textShadow?: string;
  textStroke?: {
    width: number;
    color: string;
  };
}

type CanvasElement = TextElement | (ShapeElement & { type: 'shape' });

export const CanvasEditor: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Keyboard shortcuts
  useKeyboard({
    onToolChange: (tool) => setActiveTool(tool),
    onDelete: () => {
      if (selectedElementId) {
        setElements(elements.filter((el) => el.id !== selectedElementId));
        setSelectedElementId(null);
      }
    },
    onCopy: () => {
      if (selectedElement) {
        const newElement = {
          ...selectedElement,
          id: `${selectedElement.type}-${Date.now()}`,
          x: selectedElement.x + 20,
          y: selectedElement.y + 20,
        };
        setElements([...elements, newElement]);
      }
    },
    onZoomIn: () => setZoom(Math.min(5, zoom + 0.1)),
    onZoomOut: () => setZoom(Math.max(0.1, zoom - 0.1)),
    onZoomActual: () => setZoom(1),
    onZoomFit: () => setZoom(0.8),
    onDeselect: () => setSelectedElementId(null),
  });

  const handleAddText = (textElement: any) => {
    const newElement: TextElement = {
      ...textElement,
      type: 'text',
      width: 200,
      height: 50,
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleAddShape = (shapeElement: ShapeElement) => {
    const newElement = {
      ...shapeElement,
      type: 'shape' as const,
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (updatedElement: any) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? { ...el, ...updatedElement } : el))
    );
  };

  const handleMoveElement = (id: string, x: number, y: number) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, x, y } : el)));
  };

  const handleResizeElement = (id: string, width: number, height: number) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, width, height } : el)));
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };
      setElements([...elements, newElement]);
      setSelectedElementId(newElement.id);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'shape') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setIsDrawing(true);
        setDrawStart({
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
        });
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && activeTool === 'shape') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const currentX = (e.clientX - rect.left) / zoom;
        const currentY = (e.clientY - rect.top) / zoom;

        // Update temporary drawing shape (you would implement this)
      }
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (isDrawing && activeTool === 'shape') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const endX = (e.clientX - rect.left) / zoom;
        const endY = (e.clientY - rect.top) / zoom;

        const width = Math.abs(endX - drawStart.x);
        const height = Math.abs(endY - drawStart.y);

        if (width > 10 && height > 10) {
          // Add the drawn shape
          // You would implement this with the ShapeTool state
        }
      }
      setIsDrawing(false);
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = element.id === selectedElementId;

    if (element.type === 'text') {
      return (
        <div
          key={element.id}
          onClick={() => setSelectedElementId(element.id)}
          onDoubleClick={() => setActiveTool('text')}
          style={{
            position: 'absolute',
            left: element.x,
            top: element.y,
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            color: element.color,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            textDecoration: element.textDecoration,
            textAlign: element.textAlign,
            textShadow: element.textShadow,
            cursor: 'pointer',
            outline: isSelected ? '2px solid #3b82f6' : 'none',
            padding: '4px',
          }}
        >
          {element.text}
        </div>
      );
    } else if (element.type === 'shape') {
      const shapeStyle: React.CSSProperties = {
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        backgroundColor: element.fillColor,
        border: `${element.strokeWidth}px solid ${element.strokeColor}`,
        borderRadius: element.borderRadius,
        opacity: element.opacity,
        cursor: 'pointer',
        outline: isSelected ? '2px solid #3b82f6' : 'none',
      };

      if (element.shape === 'circle') {
        shapeStyle.borderRadius = '50%';
      }

      return (
        <div
          key={element.id}
          onClick={() => setSelectedElementId(element.id)}
          style={shapeStyle}
        />
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Toolbar */}
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />

      <div className="flex flex-1 overflow-hidden">
        {/* Tool Panel */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto p-4">
          {activeTool === 'text' && (
            <TextTool
              onAddText={handleAddText}
              selectedElement={selectedElement?.type === 'text' ? selectedElement : undefined}
              onUpdateText={handleUpdateElement}
            />
          )}
          {activeTool === 'shape' && (
            <ShapeTool
              onAddShape={handleAddShape}
              selectedShape={selectedElement?.type === 'shape' ? selectedElement : undefined}
              onUpdateShape={handleUpdateElement}
            />
          )}
          {activeTool === 'select' && (
            <SelectTool
              selectedElement={selectedElement}
              onMove={handleMoveElement}
              onResize={handleResizeElement}
              onDelete={handleDeleteElement}
              onDuplicate={handleDuplicateElement}
            />
          )}
          {activeTool === 'crop' && (
            <CropTool
              targetElement={selectedElement}
              onApplyCrop={(id, cropArea) => {
                console.log('Apply crop:', id, cropArea);
              }}
              onCancelCrop={() => setActiveTool('select')}
            />
          )}
          {activeTool === 'zoom' && (
            <ZoomTool
              zoom={zoom}
              onZoomChange={setZoom}
              onFitToScreen={() => setZoom(0.8)}
              onActualSize={() => setZoom(1)}
            />
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-800 p-8">
          <div
            ref={canvasRef}
            className="relative bg-white mx-auto"
            style={{
              width: 1920 * zoom,
              height: 1080 * zoom,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              cursor:
                activeTool === 'hand'
                  ? 'grab'
                  : activeTool === 'shape'
                  ? 'crosshair'
                  : 'default',
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            {elements.map(renderElement)}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 bg-gray-900 border-l border-gray-700 overflow-y-auto p-4">
          <h3 className="text-white font-semibold mb-4">Properties</h3>
          {selectedElement ? (
            <div className="space-y-2 text-sm text-gray-300">
              <div>
                <span className="text-gray-400">Type:</span> {selectedElement.type}
              </div>
              <div>
                <span className="text-gray-400">Position:</span> ({Math.round(selectedElement.x)},{' '}
                {Math.round(selectedElement.y)})
              </div>
              <div>
                <span className="text-gray-400">Size:</span> {Math.round(selectedElement.width)} ×{' '}
                {Math.round(selectedElement.height)}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No element selected</p>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-white font-semibold mb-2">Canvas</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>
                <span className="text-gray-400">Zoom:</span> {Math.round(zoom * 100)}%
              </div>
              <div>
                <span className="text-gray-400">Elements:</span> {elements.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
