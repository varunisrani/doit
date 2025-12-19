'use client';

import React, { useState, useMemo } from 'react';
import {
  Keyframe,
  AnimatableProperty,
  createKeyframe,
  propertyConfig,
  getAnimatedValue,
  calculateIntermediateValues,
} from '@/app/lib/effects/animations';
import { EasingType, easingLabels, easingGroups } from '@/app/lib/effects/easing';
import { Button, Input, Dropdown } from '@/app/components/ui';

interface KeyframeEditorProps {
  elementId: string;
  keyframes: Keyframe[];
  currentTime: number;
  selectedProperty: AnimatableProperty | null;
  selectedKeyframeId: string | null;
  onKeyframesChange: (keyframes: Keyframe[]) => void;
  onPropertySelect: (property: AnimatableProperty | null) => void;
}

export const KeyframeEditor: React.FC<KeyframeEditorProps> = ({
  elementId,
  keyframes,
  currentTime,
  selectedProperty,
  selectedKeyframeId,
  onKeyframesChange,
  onPropertySelect,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    position: true,
    size: true,
    transform: true,
  });

  const selectedKeyframe = useMemo(
    () => keyframes.find((kf) => kf.id === selectedKeyframeId),
    [keyframes, selectedKeyframeId]
  );

  const propertyGroups = {
    position: ['x', 'y'] as AnimatableProperty[],
    size: ['width', 'height'] as AnimatableProperty[],
    transform: ['rotation', 'scaleX', 'scaleY', 'opacity'] as AnimatableProperty[],
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const hasKeyframeAt = (property: AnimatableProperty, time: number): boolean => {
    return keyframes.some((kf) => kf.property === property && kf.time === time);
  };

  const handleAddKeyframe = (property: AnimatableProperty) => {
    const currentValue = getAnimatedValue(
      keyframes,
      property,
      currentTime,
      propertyConfig[property].defaultValue
    );

    const newKeyframe = createKeyframe(
      property,
      currentTime,
      currentValue ?? propertyConfig[property].defaultValue
    );

    onKeyframesChange([...keyframes, newKeyframe]);
  };

  const handleRemoveKeyframe = (property: AnimatableProperty) => {
    const updatedKeyframes = keyframes.filter(
      (kf) => !(kf.property === property && kf.time === currentTime)
    );
    onKeyframesChange(updatedKeyframes);
  };

  const handleValueChange = (value: number) => {
    if (!selectedKeyframe) return;

    const updatedKeyframes = keyframes.map((kf) =>
      kf.id === selectedKeyframe.id ? { ...kf, value } : kf
    );
    onKeyframesChange(updatedKeyframes);
  };

  const handleEasingChange = (easing: EasingType) => {
    if (!selectedKeyframe) return;

    const updatedKeyframes = keyframes.map((kf) =>
      kf.id === selectedKeyframe.id ? { ...kf, easing } : kf
    );
    onKeyframesChange(updatedKeyframes);
  };

  const handleTimeChange = (time: number) => {
    if (!selectedKeyframe) return;

    const updatedKeyframes = keyframes.map((kf) =>
      kf.id === selectedKeyframe.id ? { ...kf, time } : kf
    );
    onKeyframesChange(updatedKeyframes);
  };

  const getCurrentValue = (property: AnimatableProperty): number => {
    return (
      getAnimatedValue(
        keyframes,
        property,
        currentTime,
        propertyConfig[property].defaultValue
      ) ?? propertyConfig[property].defaultValue
    );
  };

  const formatValue = (value: number, property: AnimatableProperty): string => {
    const config = propertyConfig[property];
    if (property === 'opacity') {
      return `${(value * 100).toFixed(0)}%`;
    }
    return `${value.toFixed(property.includes('scale') ? 2 : 0)}${config.unit}`;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
      {/* Header */}
      <div className="px-6 py-4 bg-zinc-800 border-b border-zinc-700">
        <h3 className="text-sm font-semibold text-white">Keyframe Editor</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Property Groups */}
        {Object.entries(propertyGroups).map(([groupName, properties]) => (
          <div key={groupName} className="border-b border-zinc-700">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(groupName)}
              className="w-full flex items-center justify-between px-6 py-3
                       bg-zinc-800 hover:bg-zinc-750 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={expandedGroups[groupName]}
              aria-controls={`${groupName}-properties`}
            >
              <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                {groupName}
              </span>
              <svg
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  expandedGroups[groupName] ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Group Properties */}
            {expandedGroups[groupName] && (
              <div className="bg-zinc-900" id={`${groupName}-properties`}>
                {properties.map((property) => {
                  const hasKeyframe = hasKeyframeAt(property, currentTime);
                  const currentValue = getCurrentValue(property);
                  const config = propertyConfig[property];
                  const isSelected = selectedProperty === property;

                  return (
                    <div
                      key={property}
                      className={`
                        px-6 py-4 border-b border-zinc-800/50 transition-colors duration-200 cursor-pointer
                        ${isSelected ? 'bg-zinc-800/50 border-l-4 border-l-blue-500' : 'hover:bg-zinc-800/30'}
                        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                      `}
                      onClick={() => onPropertySelect(property)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onPropertySelect(property);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={`Property: ${config.label}${hasKeyframe ? ' - has keyframe' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-white">{config.label}</span>
                          {hasKeyframe && (
                            <div
                              className="w-2 h-2 rotate-45 bg-purple-500 rounded-sm"
                              title="Has keyframe"
                              aria-label="Keyframe exists"
                              role="img"
                            />
                          )}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            hasKeyframe
                              ? handleRemoveKeyframe(property)
                              : handleAddKeyframe(property);
                          }}
                          variant={hasKeyframe ? "danger" : "primary"}
                          size="sm"
                        >
                          {hasKeyframe ? 'Remove' : 'Add Keyframe'}
                        </Button>
                      </div>

                      <div className="text-xs text-zinc-400 font-medium">
                        Current: <span className="text-zinc-300">{formatValue(currentValue, property)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Selected Keyframe Editor */}
        {selectedKeyframe && (
          <div className="p-6 bg-zinc-800/30 border-t border-zinc-700">
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">
              Selected Keyframe
            </h4>

            <div className="space-y-4">
              {/* Property */}
              <div>
                <Input
                  label="Property"
                  value={propertyConfig[selectedKeyframe.property].label}
                  disabled
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Time */}
              <div>
                <Input
                  label="Time (ms)"
                  type="number"
                  value={selectedKeyframe.time}
                  onChange={(e) => handleTimeChange(Number(e.target.value))}
                  min={0}
                  step={100}
                  helperText="Timeline position in milliseconds"
                />
              </div>

              {/* Value */}
              <div>
                <Input
                  label={`Value ${propertyConfig[selectedKeyframe.property].unit}`}
                  type="number"
                  value={selectedKeyframe.value}
                  onChange={(e) => handleValueChange(Number(e.target.value))}
                  min={propertyConfig[selectedKeyframe.property].min}
                  max={propertyConfig[selectedKeyframe.property].max}
                  step={propertyConfig[selectedKeyframe.property].step}
                  helperText={`Range: ${propertyConfig[selectedKeyframe.property].min} - ${propertyConfig[selectedKeyframe.property].max}`}
                />
              </div>

              {/* Easing Function */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Easing Function
                </label>
                <select
                  value={selectedKeyframe.easing}
                  onChange={(e) => handleEasingChange(e.target.value as EasingType)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700
                           rounded-md text-sm text-white focus:outline-none
                           focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {Object.entries(easingGroups).map(([groupName, easings]) => (
                    <optgroup key={groupName} label={groupName.toUpperCase()}>
                      {easings.map((easing) => (
                        <option key={easing} value={easing}>
                          {easingLabels[easing]}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Easing Preview */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">
                  Easing Curve Preview
                </label>
                <EasingCurvePreview easing={selectedKeyframe.easing} />
              </div>
            </div>
          </div>
        )}

        {!selectedKeyframe && (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Select a keyframe to edit its properties
          </div>
        )}
      </div>
    </div>
  );
};

// Easing Curve Preview Component
const EasingCurvePreview: React.FC<{ easing: EasingType }> = ({ easing }) => {
  const points = useMemo(() => {
    const { getEasingFunction } = require('@/app/lib/effects/easing');
    const easingFn = getEasingFunction(easing);
    const numPoints = 50;
    const pts: Array<{ x: number; y: number }> = [];

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const value = easingFn(t);
      pts.push({ x: t, y: value });
    }

    return pts;
  }, [easing]);

  const pathD = points
    .map((p, i) => {
      const x = p.x * 100;
      const y = 100 - p.y * 100;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
      <svg viewBox="0 0 100 100" className="w-full h-32">
        {/* Grid */}
        <line x1="0" y1="100" x2="100" y2="100" stroke="#52525b" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#52525b" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="100" y2="0" stroke="#52525b" strokeWidth="0.5" />
        <line x1="100" y1="0" x2="100" y2="100" stroke="#52525b" strokeWidth="0.5" />

        {/* Diagonal reference line */}
        <line x1="0" y1="100" x2="100" y2="0" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2,2" />

        {/* Easing curve */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" className="transition-all duration-200" />

        {/* Start and end points */}
        <circle cx="0" cy="100" r="2.5" fill="#3b82f6" />
        <circle cx="100" cy="0" r="2.5" fill="#3b82f6" />
      </svg>
    </div>
  );
};
