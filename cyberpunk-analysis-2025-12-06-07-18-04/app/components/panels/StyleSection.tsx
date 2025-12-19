'use client';

import React from 'react';
import { Slider } from '@/app/components/ui/Slider';
import { Dropdown } from '@/app/components/ui/Dropdown';
import { Input } from '@/app/components/ui/Input';
import { ColorPicker } from '@/app/components/ui/ColorPicker';
import type { ElementStyle, BlendMode, Shadow } from '@/app/types/elements';

interface StyleSectionProps {
  style: ElementStyle;
  onUpdate: (updates: Partial<ElementStyle>) => void;
  disabled?: boolean;
}

const BLEND_MODES: BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

const BORDER_STYLES = ['solid', 'dashed', 'dotted'] as const;

export const StyleSection: React.FC<StyleSectionProps> = ({
  style,
  onUpdate,
  disabled = false,
}) => {
  const updateShadow = (updates: Partial<Shadow>) => {
    onUpdate({
      shadow: {
        color: style.shadow?.color || '#000000',
        blur: style.shadow?.blur || 0,
        offsetX: style.shadow?.offsetX || 0,
        offsetY: style.shadow?.offsetY || 0,
        spread: style.shadow?.spread || 0,
        ...updates,
      },
    });
  };

  const removeShadow = () => {
    onUpdate({ shadow: undefined });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white">Style</h3>

      {/* Opacity */}
      <Slider
        label="Opacity"
        value={style.opacity * 100}
        onChange={(value) => onUpdate({ opacity: value / 100 })}
        min={0}
        max={100}
        step={1}
        disabled={disabled}
      />

      {/* Blend Mode */}
      <Dropdown
        label="Blend Mode"
        value={style.blendMode}
        onChange={(value) => onUpdate({ blendMode: value as BlendMode })}
        options={BLEND_MODES.map((mode) => ({
          value: mode,
          label: mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' '),
        }))}
        disabled={disabled}
      />

      {/* Border */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-zinc-400">Border</h4>

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Width"
            type="number"
            value={style.borderWidth || 0}
            onChange={(e) => onUpdate({ borderWidth: parseFloat(e.target.value) || 0 })}
            disabled={disabled}
            className="text-xs"
            min={0}
          />
          <Input
            label="Radius"
            type="number"
            value={style.borderRadius || 0}
            onChange={(e) => onUpdate({ borderRadius: parseFloat(e.target.value) || 0 })}
            disabled={disabled}
            className="text-xs"
            min={0}
          />
        </div>

        <Dropdown
          label="Style"
          value={style.borderStyle || 'solid'}
          onChange={(value) => onUpdate({ borderStyle: value as typeof BORDER_STYLES[number] })}
          options={BORDER_STYLES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          disabled={disabled}
        />

        <ColorPicker
          label="Color"
          value={style.borderColor || '#000000'}
          onChange={(value) => onUpdate({ borderColor: value })}
          disabled={disabled}
        />
      </div>

      {/* Shadow */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-zinc-400">Shadow</h4>
          {style.shadow && (
            <button
              onClick={removeShadow}
              disabled={disabled}
              className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>

        {!style.shadow && (
          <button
            onClick={() => updateShadow({
              color: '#000000',
              blur: 10,
              offsetX: 0,
              offsetY: 4,
              spread: 0,
            })}
            disabled={disabled}
            className="w-full px-3 py-2 text-xs font-medium bg-zinc-800 text-zinc-400 rounded-md hover:bg-zinc-700 disabled:opacity-50"
          >
            Add Shadow
          </button>
        )}

        {style.shadow && (
          <>
            <ColorPicker
              label="Color"
              value={style.shadow.color}
              onChange={(value) => updateShadow({ color: value })}
              disabled={disabled}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Offset X"
                type="number"
                value={style.shadow.offsetX}
                onChange={(e) => updateShadow({ offsetX: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-xs"
              />
              <Input
                label="Offset Y"
                type="number"
                value={style.shadow.offsetY}
                onChange={(e) => updateShadow({ offsetY: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Blur"
                type="number"
                value={style.shadow.blur}
                onChange={(e) => updateShadow({ blur: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-xs"
                min={0}
              />
              <Input
                label="Spread"
                type="number"
                value={style.shadow.spread || 0}
                onChange={(e) => updateShadow({ spread: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-xs"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
