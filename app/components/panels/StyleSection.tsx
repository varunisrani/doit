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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-[var(--accent)]"></div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Style Properties</h3>
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          Opacity
        </label>
        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <Slider
            value={style.opacity * 100}
            onChange={(value) => onUpdate({ opacity: value / 100 })}
            min={0}
            max={100}
            step={1}
            disabled={disabled}
            showValue={true}
            valueSuffix="%"
          />
        </div>
      </div>

      {/* Blend Mode */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          Blend Mode
        </label>
        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <Dropdown
            value={style.blendMode}
            onChange={(value) => onUpdate({ blendMode: value as BlendMode })}
            options={BLEND_MODES.map((mode) => ({
              value: mode,
              label: mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' '),
            }))}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Border */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Border
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)] space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Width"
              type="number"
              value={style.borderWidth || 0}
              onChange={(e) => onUpdate({ borderWidth: parseFloat(e.target.value) || 0 })}
              disabled={disabled}
              className="text-sm"
              min={0}
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
            />
            <Input
              label="Radius"
              type="number"
              value={style.borderRadius || 0}
              onChange={(e) => onUpdate({ borderRadius: parseFloat(e.target.value) || 0 })}
              disabled={disabled}
              className="text-sm"
              min={0}
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
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
      </div>

      {/* Shadow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
              Shadow
            </label>
            <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
          </div>
          {style.shadow && (
            <Button
              onClick={removeShadow}
              disabled={disabled}
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error-bg)]"
            >
              Remove
            </Button>
          )}
        </div>

        {!style.shadow ? (
          <div className="p-6 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)] border-dashed">
            <button
              onClick={() => updateShadow({
                color: '#000000',
                blur: 10,
                offsetX: 0,
                offsetY: 4,
                spread: 0,
              })}
              disabled={disabled}
              className="w-full flex flex-col items-center justify-center gap-2 py-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Add Shadow</span>
              <span className="text-xs text-[var(--text-tertiary)]">Click to add a shadow effect</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)] space-y-4">
            <ColorPicker
              label="Color"
              value={style.shadow.color}
              onChange={(value) => updateShadow({ color: value })}
              disabled={disabled}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Offset X"
                type="number"
                value={style.shadow.offsetX}
                onChange={(e) => updateShadow({ offsetX: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-sm"
                rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
              />
              <Input
                label="Offset Y"
                type="number"
                value={style.shadow.offsetY}
                onChange={(e) => updateShadow({ offsetY: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-sm"
                rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Blur"
                type="number"
                value={style.shadow.blur}
                onChange={(e) => updateShadow({ blur: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-sm"
                min={0}
                rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
              />
              <Input
                label="Spread"
                type="number"
                value={style.shadow.spread || 0}
                onChange={(e) => updateShadow({ spread: parseFloat(e.target.value) || 0 })}
                disabled={disabled}
                className="text-sm"
                rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
