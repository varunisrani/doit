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
      {/* Enhanced grid lines */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Main grid lines */}
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth={0.5}
            strokeDasharray="2,4"
          />
        ))}

        {/* Origin lines (0, 0) with enhanced visibility */}
        {panX >= 0 && panX <= window.innerWidth && (
          <>
            <line
              x1={panX}
              y1={0}
              x2={panX}
              y2={window.innerHeight}
              stroke="var(--primary)"
              strokeWidth={1.5}
              strokeDasharray="8,4"
              opacity={0.4}
            />
            {/* Glow effect for origin line */}
            <line
              x1={panX}
              y1={0}
              x2={panX}
              y2={window.innerHeight}
              stroke="var(--primary)"
              strokeWidth={3}
              opacity={0.1}
            />
          </>
        )}
        {panY >= 0 && panY <= window.innerHeight && (
          <>
            <line
              x1={0}
              y1={panY}
              x2={window.innerWidth}
              y2={panY}
              stroke="var(--primary)"
              strokeWidth={1.5}
              strokeDasharray="8,4"
              opacity={0.4}
            />
            {/* Glow effect for origin line */}
            <line
              x1={0}
              y1={panY}
              x2={window.innerWidth}
              y2={panY}
              stroke="var(--primary)"
              strokeWidth={3}
              opacity={0.1}
            />
          </>
        )}
      </svg>

      {/* Modern horizontal ruler */}
      {showRulers && (
        <div
          className="backdrop-blur-sm border-b border-[var(--border-primary)]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 32,
            background: 'var(--surface-elevated)',
          }}
        >
          {rulerMarks.horizontal.map((mark, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: mark.x,
                top: 0,
                height: mark.isMajor ? 32 : 20,
                width: 1,
                background: mark.isMajor
                  ? 'var(--text-secondary)'
                  : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {mark.isMajor && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    fontSize: 10,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    fontWeight: '500',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {mark.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modern vertical ruler */}
      {showRulers && (
        <div
          className="backdrop-blur-sm border-r border-[var(--border-primary)]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 32,
            height: '100%',
            background: 'var(--surface-elevated)',
          }}
        >
          {rulerMarks.vertical.map((mark, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: mark.y,
                left: 0,
                width: mark.isMajor ? 32 : 20,
                height: 1,
                background: mark.isMajor
                  ? 'var(--text-secondary)'
                  : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {mark.isMajor && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    fontSize: 10,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'left top',
                    fontWeight: '500',
                    fontFamily: 'var(--font-mono)',
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

      {/* Modern corner ruler intersection */}
      {showRulers && (
        <div
          className="backdrop-blur-sm border-r border-b border-[var(--border-primary)] flex items-center justify-center"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 32,
            height: 32,
            background: 'var(--surface-elevated)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16">
            <path
              d="M 2 2 L 2 14 L 14 14"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <circle cx="2" cy="2" r="2" fill="var(--primary)" opacity="0.7" />
            <circle cx="2" cy="2" r="1" fill="white" />
          </svg>
        </div>
      )}

      {/* Modern grid info */}
      <div
        className="panel backdrop-blur-sm border border-[var(--border-primary)] rounded-md px-3 py-2 font-mono text-xs"
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'var(--surface-elevated)',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <span className="text-[var(--text-tertiary)]">Grid:</span>{' '}
        <span className="text-[var(--primary)] font-semibold">{gridSize}px</span>
      </div>
    </div>
  );
}
