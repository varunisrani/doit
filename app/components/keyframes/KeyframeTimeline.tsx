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
    <div className="flex flex-col bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3 bg-zinc-800 border-b border-zinc-700">
        <div className="text-sm font-semibold text-white">Keyframe Timeline</div>
        <div className="text-xs text-zinc-400">
          Click to add • Drag to move • Right-click to delete
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-96 bg-zinc-900/50" ref={timelineRef}>
        <div style={{ width: trackWidth }}>
          {animatableProperties.map((property) => {
            const propertyKeyframes = keyframesByProperty[property];
            const isSelected = selectedProperty === property;
            const hasKeyframes = propertyKeyframes.length > 0;

            return (
              <div
                key={property}
                className={`
                  relative h-14 border-b border-zinc-800
                  transition-colors duration-200 cursor-crosshair
                  ${isSelected ? 'bg-zinc-800/50' : 'bg-zinc-900/30'}
                  ${hasKeyframes ? 'bg-opacity-100' : 'bg-opacity-50'}
                  hover:bg-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                `}
                onClick={(e) => handleTrackClick(e, property)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTrackClick(e as any, property);
                  }
                }}
                role="button"
                aria-label={`Add keyframe to ${propertyConfig[property].label}`}
              >
                {/* Property Label */}
                <div
                  className="absolute left-0 top-0 h-full flex items-center
                             px-4 bg-zinc-800 border-r border-zinc-700 z-10
                             pointer-events-none transition-colors duration-200"
                  style={{ width: '140px' }}
                >
                  <span
                    className={`
                      text-xs font-medium uppercase tracking-wide transition-colors
                      ${hasKeyframes ? 'text-white' : 'text-zinc-500'}
                    `}
                  >
                    {propertyConfig[property].label}
                  </span>
                </div>

                {/* Timeline Grid */}
                <div className="absolute inset-0" style={{ marginLeft: '140px' }}>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: Math.ceil(duration / 1000) + 1 }).map((_, i) => {
                      const time = i * 1000;
                      const position = time * pixelsPerMs;
                      return (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 w-px bg-zinc-600"
                          style={{ left: `${position}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Current Time Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none transition-all duration-150"
                    style={{ left: `${currentTimePosition}px` }}
                  >
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
                  </div>

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
        className="relative h-10 bg-zinc-800 border-t border-zinc-700 overflow-hidden"
        style={{ marginLeft: '140px' }}
      >
        <div className="absolute inset-0 flex items-center" style={{ width: trackWidth }}>
          {/* Time Markers */}
          {Array.from({ length: Math.ceil(duration / 1000) + 1 }).map((_, i) => {
            const time = i * 1000;
            const position = time * pixelsPerMs;
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-zinc-600"
                style={{ left: `${position}px` }}
              >
                <span className="absolute top-1 left-2 text-[10px] text-zinc-400 font-medium">
                  {i}s
                </span>
              </div>
            );
          })}

          {/* Current Time Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 transition-all duration-150"
            style={{ left: `${currentTimePosition}px` }}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-3 bg-zinc-800 border-t border-zinc-700 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-purple-500 rounded-sm" />
          <span className="font-medium">Keyframe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-blue-500 rounded-sm" />
          <span className="font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3 bg-red-500" />
          <span className="font-medium">Current Time</span>
        </div>
      </div>
    </div>
  );
};
