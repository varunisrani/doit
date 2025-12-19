'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Lock, Unlock, RotateCw } from 'lucide-react';
import { IconButton } from '@/app/components/ui/IconButton';
import type { Transform } from '@/app/types/elements';

interface TransformSectionProps {
  transform: Transform;
  onUpdate: (updates: Partial<Transform>) => void;
  disabled?: boolean;
}

export const TransformSection: React.FC<TransformSectionProps> = ({
  transform,
  onUpdate,
  disabled = false,
}) => {
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (transform.width && transform.height) {
      setAspectRatio(transform.width / transform.height);
    }
  }, []);

  const handleWidthChange = (value: number) => {
    if (lockAspectRatio && transform.height) {
      const newHeight = value / aspectRatio;
      onUpdate({ width: value, height: newHeight });
    } else {
      onUpdate({ width: value });
    }
  };

  const handleHeightChange = (value: number) => {
    if (lockAspectRatio && transform.width) {
      const newWidth = value * aspectRatio;
      onUpdate({ width: newWidth, height: value });
    } else {
      onUpdate({ height: value });
    }
  };

  const toggleLockAspectRatio = () => {
    if (!lockAspectRatio && transform.width && transform.height) {
      setAspectRatio(transform.width / transform.height);
    }
    setLockAspectRatio(!lockAspectRatio);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-[var(--accent)]"></div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Transform Properties</h3>
      </div>

      {/* Position */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Position
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="X Position"
              type="number"
              value={transform.x.toFixed(0)}
              onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })}
              disabled={disabled}
              className="text-sm"
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
            />
            <Input
              label="Y Position"
              type="number"
              value={transform.y.toFixed(0)}
              onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })}
              disabled={disabled}
              className="text-sm"
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
              Size
            </label>
            <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
          </div>
          <IconButton
            icon={lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            onClick={toggleLockAspectRatio}
            size="sm"
            variant="ghost"
            title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            className={`${
              lockAspectRatio ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'
            } hover:text-[var(--text-primary)]`}
          />
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Width"
              type="number"
              value={transform.width.toFixed(0)}
              onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
              disabled={disabled}
              className="text-sm"
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
            />
            <Input
              label="Height"
              type="number"
              value={transform.height.toFixed(0)}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
              disabled={disabled}
              className="text-sm"
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
            />
          </div>

          {/* Aspect Ratio Indicator */}
          {lockAspectRatio && (
            <div className="mt-3 p-2 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/30">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-xs text-[var(--primary)] font-medium">
                  Aspect ratio locked: {(aspectRatio).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
              Rotation
            </label>
            <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
          </div>
          <IconButton
            icon={<RotateCw className="w-4 h-4" />}
            onClick={() => onUpdate({ rotation: 0 })}
            size="sm"
            variant="ghost"
            title="Reset rotation"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          />
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <Input
            label="Angle"
            type="number"
            value={transform.rotation.toFixed(0)}
            onChange={(e) => onUpdate({ rotation: parseFloat(e.target.value) || 0 })}
            disabled={disabled}
            className="text-sm"
            min={0}
            max={360}
            rightIcon={<span className="text-xs text-[var(--text-tertiary)]">°</span>}
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button
              onClick={() => onUpdate({ rotation: 0 })}
              disabled={disabled}
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              0°
            </Button>
            <Button
              onClick={() => onUpdate({ rotation: 90 })}
              disabled={disabled}
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              90°
            </Button>
            <Button
              onClick={() => onUpdate({ rotation: 180 })}
              disabled={disabled}
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              180°
            </Button>
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Scale
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Scale X"
              type="number"
              step="0.1"
              value={transform.scaleX.toFixed(2)}
              onChange={(e) => onUpdate({ scaleX: parseFloat(e.target.value) || 1 })}
              disabled={disabled}
              className="text-sm"
              min={0.1}
              max={10}
            />
            <Input
              label="Scale Y"
              type="number"
              step="0.1"
              value={transform.scaleY.toFixed(2)}
              onChange={(e) => onUpdate({ scaleY: parseFloat(e.target.value) || 1 })}
              disabled={disabled}
              className="text-sm"
              min={0.1}
              max={10}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button
              onClick={() => onUpdate({ scaleX: 0.5, scaleY: 0.5 })}
              disabled={disabled}
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              50%
            </Button>
            <Button
              onClick={() => onUpdate({ scaleX: 1, scaleY: 1 })}
              disabled={disabled}
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              100%
            </Button>
            <Button
              onClick={() => onUpdate({ scaleX: 2, scaleY: 2 })}
              disabled={disabled}
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              200%
            </Button>
          </div>
        </div>
      </div>

      {/* Flip Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Flip
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onUpdate({ flipX: !transform.flipX })}
              disabled={disabled}
              variant={transform.flipX ? 'primary' : 'secondary'}
              size="sm"
              className="flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m0 0v8m0-8l-8 8m0-8h8" />
              </svg>
              Flip X
            </Button>
            <Button
              onClick={() => onUpdate({ flipY: !transform.flipY })}
              disabled={disabled}
              variant={transform.flipY ? 'primary' : 'secondary'}
              size="sm"
              className="flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m0 0h8m-8 0l8 8" />
              </svg>
              Flip Y
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
