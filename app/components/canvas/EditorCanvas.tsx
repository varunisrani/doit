'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useSelection } from '../../hooks/useSelection';
import { useEditorStore } from '../../lib/store/editorStore';
import { CanvasElement as CanvasElementType } from '../../lib/canvas/elements';
import { Point } from '../../lib/utils/mathUtils';
import CanvasElement from './CanvasElement';
import SelectionBox from './SelectionBox';
import TransformControls from './TransformControls';
import GridOverlay from './GridOverlay';

interface EditorCanvasProps {
  width?: number;
  height?: number;
  showGrid?: boolean;
  gridSize?: number;
  className?: string;
}

export default function EditorCanvas({
  width = 1920,
  height = 1080,
  showGrid = true,
  gridSize = 50,
  className = '',
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

  const { currentTool, project } = useEditorStore();
  const {
    zoom,
    panX,
    panY,
    screenToCanvas,
    handleWheel,
    startPanning,
    updatePanning,
    stopPanning,
    isPanning,
    startDragging,
    updateDragging,
    stopDragging,
    isDragging,
  } = useCanvas();

  const {
    getSelectedElementsData,
    selectElementAtPoint,
    startBoxSelection,
    updateBoxSelection,
    endBoxSelection,
    isSelecting,
    selectionBox,
    multiSelectMode,
    setHoveredElement,
    getAllElements,
  } = useSelection();

  const [dragState, setDragState] = useState<{
    mode: 'none' | 'pan' | 'select' | 'move';
    startPoint: Point | null;
  }>({
    mode: 'none',
    startPoint: null,
  });

  /**
   * Render loop using requestAnimationFrame
   */
  useEffect(() => {
    const render = () => {
      // Rendering is handled by React components
      // This is just for smooth updates
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /**
   * Mouse wheel handler for zoom
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      handleWheel(e, rect);
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [handleWheel]);

  /**
   * Mouse down handler
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const canvasPoint = screenToCanvas(screenX, screenY);

      setMousePos({ x: screenX, y: screenY });

      // Middle mouse or space + left mouse for panning
      if (e.button === 1 || (e.button === 0 && e.shiftKey && currentTool === 'hand')) {
        e.preventDefault();
        startPanning(screenX, screenY);
        setDragState({ mode: 'pan', startPoint: { x: screenX, y: screenY } });
        return;
      }

      // Left mouse button
      if (e.button === 0) {
        const selectedElement = selectElementAtPoint(canvasPoint, multiSelectMode);

        if (selectedElement) {
          // Start moving selected elements
          const selectedElements = getSelectedElementsData();
          startDragging(screenX, screenY, selectedElements);
          setDragState({ mode: 'move', startPoint: { x: screenX, y: screenY } });
        } else {
          // Start box selection
          startBoxSelection(canvasPoint);
          setDragState({ mode: 'select', startPoint: canvasPoint });
        }
      }
    },
    [
      screenToCanvas,
      startPanning,
      selectElementAtPoint,
      multiSelectMode,
      getSelectedElementsData,
      startDragging,
      startBoxSelection,
      currentTool,
    ]
  );

  /**
   * Mouse move handler
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const canvasPoint = screenToCanvas(screenX, screenY);

      setMousePos({ x: screenX, y: screenY });

      // Update cursor based on hovered element
      const allElements = getAllElements();
      const hoveredElement = allElements
        .reverse()
        .find((el) => {
          const elScreenX = el.x * zoom + panX;
          const elScreenY = el.y * zoom + panY;
          const elWidth = el.width * zoom;
          const elHeight = el.height * zoom;

          return (
            screenX >= elScreenX &&
            screenX <= elScreenX + elWidth &&
            screenY >= elScreenY &&
            screenY <= elScreenY + elHeight &&
            !el.locked
          );
        });

      setHoveredElement(hoveredElement?.id || null);

      // Handle different drag modes
      if (dragState.mode === 'pan') {
        updatePanning(screenX, screenY);
      } else if (dragState.mode === 'move') {
        const selectedElements = getSelectedElementsData();
        updateDragging(screenX, screenY, selectedElements);
      } else if (dragState.mode === 'select' && dragState.startPoint) {
        updateBoxSelection(dragState.startPoint, canvasPoint);
      }
    },
    [
      screenToCanvas,
      zoom,
      panX,
      panY,
      getAllElements,
      setHoveredElement,
      dragState,
      updatePanning,
      getSelectedElementsData,
      updateDragging,
      updateBoxSelection,
    ]
  );

  /**
   * Mouse up handler
   */
  const handleMouseUp = useCallback(() => {
    if (dragState.mode === 'pan') {
      stopPanning();
    } else if (dragState.mode === 'move') {
      stopDragging();
    } else if (dragState.mode === 'select') {
      endBoxSelection();
    }

    setDragState({ mode: 'none', startPoint: null });
  }, [dragState.mode, stopPanning, stopDragging, endBoxSelection]);

  /**
   * Mouse leave handler
   */
  const handleMouseLeave = useCallback(() => {
    handleMouseUp();
    setHoveredElement(null);
  }, [handleMouseUp, setHoveredElement]);

  /**
   * Context menu handler
   */
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Show context menu
  }, []);

  // Get all elements and selected elements
  const allElements = getAllElements();
  const selectedElements = getSelectedElementsData();

  return (
    <div
      ref={canvasRef}
      className={`canvas-container relative overflow-hidden bg-[var(--background)] ${className}`}
      style={{
        width: '100%',
        height: '100%',
        cursor: dragState.mode === 'pan' ? 'grabbing' : currentTool === 'hand' ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      {/* Grid Overlay */}
      {showGrid && <GridOverlay zoom={zoom} panX={panX} panY={panY} gridSize={gridSize} />}

      {/* Canvas content */}
      <div
        className="canvas transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: project.width,
          height: project.height,
        }}
      >
        {/* Canvas background with subtle border */}
        <div
          className="absolute inset-0 border border-[var(--canvas-border)]"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: project.backgroundColor,
            top: 0,
            left: 0,
            boxShadow: zoom > 1 ? '0 0 20px rgba(0, 0, 0, 0.3)' : 'none',
          }}
        />

        {/* Render all elements */}
        {allElements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElements.some((el) => el.id === element.id)}
            zoom={zoom}
          />
        ))}

        {/* Transform controls for selected elements */}
        {selectedElements.length > 0 && (
          <TransformControls elements={selectedElements} zoom={zoom} />
        )}
      </div>

      {/* Selection box (in screen space) */}
      {isSelecting && selectionBox && (
        <SelectionBox
          x={selectionBox.x * zoom + panX}
          y={selectionBox.y * zoom + panY}
          width={selectionBox.width * zoom}
          height={selectionBox.height * zoom}
        />
      )}

      {/* Info overlay with modern design */}
      <div
        className="panel absolute top-4 right-4 text-[var(--text-primary)] px-4 py-3 text-sm font-mono backdrop-blur-sm"
        style={{
          background: 'var(--backdrop-overlay)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--text-secondary)]">Zoom:</span>
          <span className="text-[var(--text-primary)] font-semibold">{(zoom * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--text-secondary)]">Pan:</span>
          <span className="text-[var(--text-primary)] font-semibold">({panX.toFixed(0)}, {panY.toFixed(0)})</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--text-secondary)]">Elements:</span>
          <span className="text-[var(--text-primary)] font-semibold">{allElements.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-secondary)]">Selected:</span>
          <span className="text-[var(--primary)] font-semibold">{selectedElements.length}</span>
        </div>
      </div>

      {/* Instructions with modern tooltip design */}
      <div
        className="panel absolute bottom-4 left-4 text-[var(--text-primary)] px-4 py-3 text-xs backdrop-blur-sm"
        style={{
          background: 'var(--backdrop-overlay)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--text-secondary)]">Mouse Wheel:</span>
          <span className="text-[var(--text-primary)]">Zoom</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--text-secondary)]">Middle Mouse / Space+Drag:</span>
          <span className="text-[var(--text-primary)]">Pan</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--text-secondary)]">Shift+Click:</span>
          <span className="text-[var(--text-primary)]">Multi-select</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-secondary)]">Drag:</span>
          <span className="text-[var(--text-primary)]">Box select</span>
        </div>
      </div>
    </div>
  );
}
