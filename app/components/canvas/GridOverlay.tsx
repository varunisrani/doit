'use client';

import React, { useMemo } from 'react';

interface GridOverlayProps {
  zoom: number;
  panX: number;
  panY: number;
  gridSize?: number;
  showRulers?: boolean;
  showSnapGuides?: boolean;
}

export default function GridOverlay({
  zoom,
  panX,
  panY,
  gridSize = 50,
  showRulers = true,
  showSnapGuides = false,
}: GridOverlayProps) {
  /**
   * Calculates grid lines based on viewport
   */
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const cellSize = gridSize * zoom;

    // Only render grid if it's not too dense or too sparse
    if (cellSize < 5 || cellSize > 500) {
      return lines;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate starting positions
    const startX = Math.floor(-panX / cellSize) * cellSize;
    const startY = Math.floor(-panY / cellSize) * cellSize;

    // Vertical lines
    for (let x = startX; x < viewportWidth; x += cellSize) {
      lines.push({
        x1: x,
        y1: 0,
        x2: x,
        y2: viewportHeight,
      });
    }

    // Horizontal lines
    for (let y = startY; y < viewportHeight; y += cellSize) {
      lines.push({
        x1: 0,
        y1: y,
        x2: viewportWidth,
        y2: y,
      });
    }

    return lines;
  }, [zoom, panX, panY, gridSize]);

  /**
   * Calculates ruler marks
   */
  const rulerMarks = useMemo(() => {
    if (!showRulers) return { horizontal: [], vertical: [] };

    const cellSize = gridSize * zoom;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const horizontal = [];
    const vertical = [];

    // Horizontal ruler marks (top)
    const startX = Math.floor(-panX / cellSize) * cellSize;
    for (let x = startX; x < viewportWidth; x += cellSize) {
      const canvasX = Math.round((x - panX) / zoom);
      horizontal.push({
        x,
        label: canvasX.toString(),
        isMajor: canvasX % (gridSize * 5) === 0,
      });
    }

    // Vertical ruler marks (left)
    const startY = Math.floor(-panY / cellSize) * cellSize;
    for (let y = startY; y < viewportHeight; y += cellSize) {
      const canvasY = Math.round((y - panY) / zoom);
      vertical.push({
        y,
        label: canvasY.toString(),
        isMajor: canvasY % (gridSize * 5) === 0,
      });
    }

    return { horizontal, vertical };
  }, [zoom, panX, panY, gridSize, showRulers]);

  return (
    <div
      className="grid-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Grid lines */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={1}
          />
        ))}

        {/* Origin lines (0, 0) */}
        {panX >= 0 && panX <= window.innerWidth && (
          <line
            x1={panX}
            y1={0}
            x2={panX}
            y2={window.innerHeight}
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth={2}
          />
        )}
        {panY >= 0 && panY <= window.innerHeight && (
          <line
            x1={0}
            y1={panY}
            x2={window.innerWidth}
            y2={panY}
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Horizontal ruler */}
      {showRulers && (
        <div
          className="ruler-horizontal"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {rulerMarks.horizontal.map((mark, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: mark.x,
                top: 0,
                height: mark.isMajor ? 30 : 20,
                width: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {mark.isMajor && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 4,
                    fontSize: 10,
                    color: 'white',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {mark.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vertical ruler */}
      {showRulers && (
        <div
          className="ruler-vertical"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 30,
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {rulerMarks.vertical.map((mark, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: mark.y,
                left: 0,
                width: mark.isMajor ? 30 : 20,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {mark.isMajor && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 2,
                    fontSize: 10,
                    color: 'white',
                    whiteSpace: 'nowrap',
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'left top',
                  }}
                >
                  {mark.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Snap guides */}
      {showSnapGuides && (
        <svg
          className="snap-guides"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/* Snap guides would be rendered here based on element alignment */}
          {/* This would be populated dynamically when elements are being moved */}
        </svg>
      )}

      {/* Corner ruler intersection */}
      {showRulers && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 30,
            height: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M 2 2 L 2 14 L 14 14"
              fill="none"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1.5"
            />
            <circle cx="2" cy="2" r="2" fill="rgba(59, 130, 246, 0.5)" />
          </svg>
        </div>
      )}

      {/* Grid info */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'monospace',
        }}
      >
        Grid: {gridSize}px
      </div>
    </div>
  );
}
