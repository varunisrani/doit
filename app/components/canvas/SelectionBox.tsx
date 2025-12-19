'use client';

import React from 'react';

interface SelectionBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function SelectionBox({ x, y, width, height }: SelectionBoxProps) {
  const actualWidth = Math.abs(width);
  const actualHeight = Math.abs(height);
  const left = width < 0 ? x - actualWidth : x;
  const top = height < 0 ? y - actualHeight : y;

  return (
    <div
      className="selection-box pointer-events-none z-[1000] box-border"
      style={{
        position: 'absolute',
        left,
        top,
        width: actualWidth,
        height: actualHeight,
        border: '2px dashed var(--primary)',
        backgroundColor: 'rgba(37, 99, 235, 0.08)', // Using var(--primary) with opacity
        boxShadow: '0 0 0 1px rgba(37, 99, 235, 0.2), inset 0 0 0 1px rgba(37, 99, 235, 0.1)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Corner handles for visual feedback */}
      <div className="absolute w-3 h-3 bg-[var(--primary)] border-2 border-white rounded-full -top-[6px] -left-[6px] shadow-lg" />
      <div className="absolute w-3 h-3 bg-[var(--primary)] border-2 border-white rounded-full -top-[6px] -right-[6px] shadow-lg" />
      <div className="absolute w-3 h-3 bg-[var(--primary)] border-2 border-white rounded-full -bottom-[6px] -left-[6px] shadow-lg" />
      <div className="absolute w-3 h-3 bg-[var(--primary)] border-2 border-white rounded-full -bottom-[6px] -right-[6px] shadow-lg" />

      {/* Selection info */}
      {(actualWidth > 50 || actualHeight > 50) && (
        <div
          className="absolute -top-8 left-0 px-2 py-1 text-xs text-white rounded"
          style={{
            background: 'var(--primary)',
            fontSize: '11px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(actualWidth)} × {Math.round(actualHeight)}
        </div>
      )}
    </div>
  );
}
