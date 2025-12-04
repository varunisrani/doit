'use client';

import React, { useState, useCallback } from 'react';
import { CanvasElement, getElementsBounds } from '../../lib/canvas/elements';
import {
  getResizeHandlePositions,
  getHandleCursor,
  HandleType,
  getRotationHandlePosition,
} from '../../lib/canvas/transforms';
import { useCanvas } from '../../hooks/useCanvas';
import { useSelectionStore } from '../../lib/store/selectionStore';
import { Point } from '../../lib/utils/mathUtils';

interface TransformControlsProps {
  elements: CanvasElement[];
  zoom: number;
}

export default function TransformControls({ elements, zoom }: TransformControlsProps) {
  const [activeHandle, setActiveHandle] = useState<HandleType | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const { resizeElement, rotateElement } = useCanvas();
  const { setActiveTransformHandle } = useSelectionStore();

  // If multiple elements, use their combined bounds
  const bounds = elements.length === 1 ? elements[0] : getElementsBounds(elements);

  // For simplicity, we'll use a virtual element for multi-selection
  const virtualElement: CanvasElement = {
    id: 'multi-select',
    type: 'shape',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    rotation: elements.length === 1 ? elements[0].rotation : 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,
  } as CanvasElement;

  const handles = getResizeHandlePositions(virtualElement);
  const rotationHandle = getRotationHandlePosition(virtualElement);

  const handleSize = 8 / zoom; // Size of handles in canvas units
  const handleScreenSize = 8; // Size in screen pixels

  /**
   * Handles mouse down on a resize handle
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handleType: HandleType) => {
      e.stopPropagation();
      e.preventDefault();

      setActiveHandle(handleType);
      setActiveTransformHandle(handleType);
      setDragStart({ x: e.clientX, y: e.clientY });

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragStart) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const delta: Point = {
          x: deltaX / zoom,
          y: deltaY / zoom,
        };

        // For single element, apply transform
        if (elements.length === 1) {
          const element = elements[0];
          const maintainAspectRatio = e.shiftKey;

          if (handleType === 'rotation') {
            const center = {
              x: element.x + element.width / 2,
              y: element.y + element.height / 2,
            };
            const angle = Math.atan2(e.clientY / zoom - center.y, e.clientX / zoom - center.x);
            const rotation = angle + Math.PI / 2;
            rotateElement(element, rotation);
          } else {
            resizeElement(element, handleType, delta, maintainAspectRatio);
          }
        }
        // For multiple elements, transform each relative to their bounds
        else {
          // TODO: Implement multi-element transformation
          // This would require calculating the relative position of each element
          // and applying the transform proportionally
        }

        setDragStart({ x: e.clientX, y: e.clientY });
      };

      const handleMouseUp = () => {
        setActiveHandle(null);
        setActiveTransformHandle(null);
        setDragStart(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dragStart, elements, zoom, resizeElement, rotateElement, setActiveTransformHandle]
  );

  /**
   * Renders a resize handle
   */
  const renderHandle = (handleType: HandleType, position: Point, isRotation: boolean = false) => {
    const cursor = getHandleCursor(handleType, virtualElement.rotation);

    return (
      <div
        key={handleType}
        className={`transform-handle ${handleType} ${activeHandle === handleType ? 'active' : ''}`}
        style={{
          position: 'absolute',
          left: position.x - handleSize / 2,
          top: position.y - handleSize / 2,
          width: handleSize,
          height: handleSize,
          backgroundColor: isRotation ? '#10b981' : '#3b82f6',
          border: '2px solid white',
          borderRadius: isRotation ? '50%' : '2px',
          cursor,
          boxSizing: 'border-box',
          zIndex: 1001,
          transform: 'scale(1)',
          transition: activeHandle ? 'none' : 'transform 0.1s',
        }}
        onMouseDown={(e) => handleMouseDown(e, handleType)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.3)';
        }}
        onMouseLeave={(e) => {
          if (activeHandle !== handleType) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      />
    );
  };

  /**
   * Renders the bounding box
   */
  const renderBoundingBox = () => {
    const { x, y, width, height, rotation } = virtualElement;
    const center = { x: x + width / 2, y: y + height / 2 };

    return (
      <div
        className="bounding-box"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          border: '2px solid #3b82f6',
          borderRadius: 2,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          transformOrigin: 'center',
          transform: `rotate(${rotation}rad)`,
        }}
      />
    );
  };

  /**
   * Renders a corner handle with label
   */
  const renderCornerHandle = (handleType: HandleType, position: Point) => {
    return (
      <g key={handleType}>
        {renderHandle(handleType, position)}
      </g>
    );
  };

  // Don't render if no elements or all locked
  if (elements.length === 0 || elements.every((el) => el.locked)) {
    return null;
  }

  return (
    <div
      className="transform-controls"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Bounding box */}
      {renderBoundingBox()}

      {/* Resize handles */}
      <div style={{ pointerEvents: 'auto' }}>
        {renderHandle('topLeft', handles.topLeft)}
        {renderHandle('topCenter', handles.topCenter)}
        {renderHandle('topRight', handles.topRight)}
        {renderHandle('middleLeft', handles.middleLeft)}
        {renderHandle('middleRight', handles.middleRight)}
        {renderHandle('bottomLeft', handles.bottomLeft)}
        {renderHandle('bottomCenter', handles.bottomCenter)}
        {renderHandle('bottomRight', handles.bottomRight)}

        {/* Rotation handle */}
        {elements.length === 1 && (
          <>
            {/* Line from top center to rotation handle */}
            <svg
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              <line
                x1={handles.topCenter.x}
                y1={handles.topCenter.y}
                x2={rotationHandle.x}
                y2={rotationHandle.y}
                stroke="#10b981"
                strokeWidth={2 / zoom}
                strokeDasharray={`${4 / zoom} ${4 / zoom}`}
              />
            </svg>
            {renderHandle('rotation', rotationHandle, true)}
          </>
        )}
      </div>

      {/* Size display */}
      <div
        style={{
          position: 'absolute',
          left: virtualElement.x + virtualElement.width / 2,
          top: virtualElement.y - 25 / zoom,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: `${4 / zoom}px ${8 / zoom}px`,
          borderRadius: 4 / zoom,
          fontSize: 12 / zoom,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {Math.round(virtualElement.width)} × {Math.round(virtualElement.height)}
        {virtualElement.rotation !== 0 &&
          ` • ${Math.round((virtualElement.rotation * 180) / Math.PI)}°`}
      </div>
    </div>
  );
}
