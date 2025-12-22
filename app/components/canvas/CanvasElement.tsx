'use client';

import React from 'react';
import {
  CanvasElement as CanvasElementType,
  ImageElement,
  TextElement,
  ShapeElement,
  VideoElement,
} from '../../lib/canvas/elements';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  zoom: number;
}

export default function CanvasElement({ element, isSelected, zoom }: CanvasElementProps) {
  const renderElement = () => {
    if (!element.visible) return null;

    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}rad)`,
      opacity: element.opacity,
      pointerEvents: element.locked ? 'none' : 'auto',
      boxSizing: 'border-box',
    };

    switch (element.type) {
      case 'image':
        return renderImageElement(element as ImageElement, commonStyle);
      case 'text':
        return renderTextElement(element as TextElement, commonStyle);
      case 'shape':
        return renderShapeElement(element as ShapeElement, commonStyle);
      case 'video':
        return renderVideoElement(element as VideoElement, commonStyle);
      default:
        return null;
    }
  };

  const renderImageElement = (element: ImageElement, style: React.CSSProperties) => {
    const filterStyle = element.filters
      ? {
          filter: [
            element.filters.brightness !== undefined
              ? `brightness(${element.filters.brightness})`
              : '',
            element.filters.contrast !== undefined ? `contrast(${element.filters.contrast})` : '',
            element.filters.saturation !== undefined
              ? `saturate(${element.filters.saturation})`
              : '',
            element.filters.blur !== undefined ? `blur(${element.filters.blur}px)` : '',
            element.filters.grayscale ? 'grayscale(100%)' : '',
            element.filters.sepia ? 'sepia(100%)' : '',
          ]
            .filter(Boolean)
            .join(' '),
        }
      : {};

    return (
      <div style={style}>
        <img
          src={element.src}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...filterStyle,
          }}
          draggable={false}
        />
      </div>
    );
  };

  const renderTextElement = (element: TextElement, style: React.CSSProperties) => {
    return (
      <div
        style={{
          ...style,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          color: element.color,
          textAlign: element.textAlign,
          lineHeight: element.lineHeight,
          letterSpacing: element.letterSpacing,
          backgroundColor: element.backgroundColor,
          padding: element.padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            element.textAlign === 'center'
              ? 'center'
              : element.textAlign === 'right'
              ? 'flex-end'
              : 'flex-start',
          wordWrap: 'break-word',
          overflow: 'hidden',
        }}
      >
        {element.text}
      </div>
    );
  };

  const renderShapeElement = (element: ShapeElement, style: React.CSSProperties) => {
    const shapeStyle: React.CSSProperties = {
      ...style,
      backgroundColor: element.fillColor,
      border: element.strokeColor ? `${element.strokeWidth}px solid ${element.strokeColor}` : 'none',
    };

    switch (element.shape) {
      case 'rectangle':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: element.cornerRadius,
            }}
          />
        );

      case 'circle':
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: '50%',
            }}
          />
        );

      case 'triangle':
        return (
          <div style={style}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon
                points="50,10 90,90 10,90"
                fill={element.fillColor}
                stroke={element.strokeColor}
                strokeWidth={element.strokeWidth}
              />
            </svg>
          </div>
        );

      case 'line':
        return (
          <div style={style}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke={element.strokeColor || element.fillColor}
                strokeWidth={element.strokeWidth}
              />
            </svg>
          </div>
        );

      default:
        return <div style={shapeStyle} />;
    }
  };

  const renderVideoElement = (element: VideoElement, style: React.CSSProperties) => {
    return (
      <div style={style}>
        <video
          src={element.src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          muted={element.muted}
          controls={false}
          draggable={false}
        />
      </div>
    );
  };

  return (
    <div
      data-element-id={element.id}
      className={`canvas-element transition-all duration-200 ease-out ${isSelected ? 'selected' : ''} ${
        element.locked ? 'locked' : ''
      } ${element.locked ? 'opacity-75' : ''}`}
      style={{
        position: 'absolute',
        outline: isSelected ? '2px solid var(--primary)' : 'none',
        outlineOffset: '2px',
        boxShadow: isSelected
          ? '0 0 0 4px rgba(220, 38, 38, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)'
          : element.locked
          ? '0 2px 8px rgba(0, 0, 0, 0.1)'
          : 'none',
        borderRadius: '2px',
        transform: `scale(${isSelected ? 1.01 : 1})`,
        cursor: element.locked ? 'not-allowed' : 'pointer',
      }}
    >
      {renderElement()}

      {/* Modern locked indicator */}
      {element.locked && (
        <div
          className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded backdrop-blur-sm"
          style={{
            background: 'var(--backdrop-overlay)',
            color: 'var(--warning)',
            border: '1px solid var(--warning)',
            fontSize: '10px',
            lineHeight: '1',
            minWidth: '48px',
            textAlign: 'center',
          }}
        >
          LOCKED
        </div>
      )}

      {/* Hover effect for unlocked elements */}
      {!element.locked && (
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150 pointer-events-none"
          style={{
            border: '1px solid var(--primary)',
            borderRadius: '2px',
            backgroundColor: 'rgba(220, 38, 38, 0.02)',
          }}
        />
      )}
    </div>
  );
}
