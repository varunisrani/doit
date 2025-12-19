'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Keyframe,
  AnimatableProperty,
  createKeyframe,
  propertyConfig,
} from '@/app/lib/effects/animations';
import { EasingType } from '@/app/lib/effects/easing';
import { KeyframeDiamond } from './KeyframeDiamond';

interface KeyframeTimelineProps {
  elementId: string;
  keyframes: Keyframe[];
  currentTime: number;
  duration: number;
  selectedProperty: AnimatableProperty | null;
  onKeyframesChange: (keyframes: Keyframe[]) => void;
  onSelectedKeyframeChange: (keyframeId: string | null) => void;
  selectedKeyframeId: string | null;
  zoom: number;
}

export const KeyframeTimeline: React.FC<KeyframeTimelineProps> = ({
  elementId,
  keyframes,
  currentTime,
  duration,
  selectedProperty,
  onKeyframesChange,
  onSelectedKeyframeChange,
  selectedKeyframeId,
  zoom = 1,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackWidth = Math.max(1000, duration * zoom * 0.1); // 0.1px per ms at zoom=1
  const pixelsPerMs = trackWidth / duration;

  const animatableProperties: AnimatableProperty[] = [
    'x',
    'y',
    'width',
    'height',
    'rotation',
    'scaleX',
    'scaleY',
    'opacity',
  ];

  // Group keyframes by property
  const keyframesByProperty = animatableProperties.reduce((acc, prop) => {
    acc[prop] = keyframes.filter((kf) => kf.property === prop);
    return acc;
  }, {} as Record<AnimatableProperty, Keyframe[]>);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent, property: AnimatableProperty) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickTime = Math.round(clickX / pixelsPerMs);

      // Check if clicking near an existing keyframe (within 5px)
      const nearbyKeyframe = keyframesByProperty[property].find((kf) => {
        const kfPosition = kf.time * pixelsPerMs;
        return Math.abs(kfPosition - clickX) < 5;
      });

      if (nearbyKeyframe) {
        onSelectedKeyframeChange(nearbyKeyframe.id);
        return;
      }

      // Create new keyframe
      const existingKeyframes = keyframesByProperty[property];
      let value = propertyConfig[property].defaultValue;

      // Interpolate value if between existing keyframes
      if (existingKeyframes.length > 0) {
        const before = existingKeyframes
          .filter((kf) => kf.time < clickTime)
          .sort((a, b) => b.time - a.time)[0];
        const after = existingKeyframes
          .filter((kf) => kf.time > clickTime)
          .sort((a, b) => a.time - b.time)[0];

        if (before && after) {
          // Interpolate between keyframes
          const progress = (clickTime - before.time) / (after.time - before.time);
          value = before.value + (after.value - before.value) * progress;
        } else if (before) {
          value = before.value;
        } else if (after) {
          value = after.value;
        }
      }

      const newKeyframe = createKeyframe(property, clickTime, value);
      onKeyframesChange([...keyframes, newKeyframe]);
      onSelectedKeyframeChange(newKeyframe.id);
    },
    [keyframes, keyframesByProperty, onKeyframesChange, onSelectedKeyframeChange, pixelsPerMs]
  );

  const handleKeyframeMove = useCallback(
    (keyframeId: string, newTime: number) => {
      const updatedKeyframes = keyframes.map((kf) =>
        kf.id === keyframeId ? { ...kf, time: newTime } : kf
      );
      onKeyframesChange(updatedKeyframes);
    },
    [keyframes, onKeyframesChange]
  );

  const handleKeyframeDelete = useCallback(
    (keyframeId: string) => {
      const updatedKeyframes = keyframes.filter((kf) => kf.id !== keyframeId);
      onKeyframesChange(updatedKeyframes);
      if (selectedKeyframeId === keyframeId) {
        onSelectedKeyframeChange(null);
      }
    },
    [keyframes, selectedKeyframeId, onKeyframesChange, onSelectedKeyframeChange]
  );

  const handleKeyframeSelect = useCallback(
    (keyframeId: string) => {
      onSelectedKeyframeChange(keyframeId);
    },
    [onSelectedKeyframeChange]
  );

  const currentTimePosition = currentTime * pixelsPerMs;

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="text-sm font-semibold text-white">Keyframe Timeline</div>
        <div className="text-xs text-gray-400">
          Click on a track to add keyframe | Right-click to delete
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-96" ref={timelineRef}>
        <div style={{ width: trackWidth }}>
          {animatableProperties.map((property) => {
            const propertyKeyframes = keyframesByProperty[property];
            const isSelected = selectedProperty === property;
            const hasKeyframes = propertyKeyframes.length > 0;

            return (
              <div
                key={property}
                className={`
                  relative h-12 border-b border-gray-800
                  transition-colors cursor-crosshair
                  ${isSelected ? 'bg-gray-800/50' : 'bg-gray-900'}
                  ${hasKeyframes ? 'bg-opacity-100' : 'bg-opacity-50'}
                  hover:bg-gray-800/30
                `}
                onClick={(e) => handleTrackClick(e, property)}
              >
                {/* Property Label */}
                <div
                  className="absolute left-0 top-0 h-full flex items-center
                             px-3 bg-gray-800 border-r border-gray-700 z-10
                             pointer-events-none"
                  style={{ width: '120px' }}
                >
                  <span
                    className={`
                      text-xs font-medium
                      ${hasKeyframes ? 'text-white' : 'text-gray-500'}
                    `}
                  >
                    {propertyConfig[property].label}
                  </span>
                </div>

                {/* Timeline Grid */}
                <div className="absolute inset-0" style={{ marginLeft: '120px' }}>
                  {/* Current Time Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                    style={{ left: `${currentTimePosition}px` }}
                  />

                  {/* Keyframes */}
                  {propertyKeyframes.map((keyframe) => (
                    <KeyframeDiamond
                      key={keyframe.id}
                      keyframe={keyframe}
                      selected={selectedKeyframeId === keyframe.id}
                      pixelsPerMs={pixelsPerMs}
                      onSelect={handleKeyframeSelect}
                      onMove={handleKeyframeMove}
                      onDelete={handleKeyframeDelete}
                      trackWidth={trackWidth}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Ruler */}
      <div
        className="relative h-8 bg-gray-800 border-t border-gray-700 overflow-hidden"
        style={{ marginLeft: '120px' }}
      >
        <div className="absolute inset-0 flex items-center" style={{ width: trackWidth }}>
          {/* Time Markers */}
          {Array.from({ length: Math.ceil(duration / 1000) + 1 }).map((_, i) => {
            const time = i * 1000;
            const position = time * pixelsPerMs;
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-gray-600"
                style={{ left: `${position}px` }}
              >
                <span className="absolute top-1 left-1 text-[10px] text-gray-400">
                  {i}s
                </span>
              </div>
            );
          })}

          {/* Current Time Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
            style={{ left: `${currentTimePosition}px` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rotate-45 bg-purple-500" />
          <span>Keyframe</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rotate-45 bg-blue-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-3 bg-red-500" />
          <span>Current Time</span>
        </div>
      </div>
    </div>
  );
};
