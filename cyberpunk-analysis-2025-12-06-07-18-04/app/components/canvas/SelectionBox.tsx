'use client';

import React from 'react';

interface SelectionBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function SelectionBox({ x, y, width, height }: SelectionBoxProps) {
  return (
    <div
      className="selection-box"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: Math.abs(width),
        height: Math.abs(height),
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointerEvents: 'none',
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    />
  );
}
