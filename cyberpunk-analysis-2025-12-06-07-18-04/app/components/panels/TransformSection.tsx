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
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">Transform</h3>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="X"
          type="number"
          value={transform.x.toFixed(0)}
          onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })}
          disabled={disabled}
          className="text-xs"
        />
        <Input
          label="Y"
          type="number"
          value={transform.y.toFixed(0)}
          onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })}
          disabled={disabled}
          className="text-xs"
        />
      </div>

      {/* Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Size</span>
          <IconButton
            icon={lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            onClick={toggleLockAspectRatio}
            size="sm"
            variant="ghost"
            title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="W"
            type="number"
            value={transform.width.toFixed(0)}
            onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
            disabled={disabled}
            className="text-xs"
          />
          <Input
            label="H"
            type="number"
            value={transform.height.toFixed(0)}
            onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
            disabled={disabled}
            className="text-xs"
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Rotation</span>
          <IconButton
            icon={<RotateCw className="w-3 h-3" />}
            onClick={() => onUpdate({ rotation: 0 })}
            size="sm"
            variant="ghost"
            title="Reset rotation"
          />
        </div>
        <Input
          type="number"
          value={transform.rotation.toFixed(0)}
          onChange={(e) => onUpdate({ rotation: parseFloat(e.target.value) || 0 })}
          disabled={disabled}
          className="text-xs"
          min={0}
          max={360}
          rightIcon={<span className="text-xs text-zinc-500">°</span>}
        />
      </div>

      {/* Scale */}
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Scale X"
          type="number"
          step="0.1"
          value={transform.scaleX.toFixed(2)}
          onChange={(e) => onUpdate({ scaleX: parseFloat(e.target.value) || 1 })}
          disabled={disabled}
          className="text-xs"
        />
        <Input
          label="Scale Y"
          type="number"
          step="0.1"
          value={transform.scaleY.toFixed(2)}
          onChange={(e) => onUpdate({ scaleY: parseFloat(e.target.value) || 1 })}
          disabled={disabled}
          className="text-xs"
        />
      </div>

      {/* Flip */}
      <div className="flex gap-2">
        <button
          onClick={() => onUpdate({ flipX: !transform.flipX })}
          disabled={disabled}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
            transform.flipX
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Flip X
        </button>
        <button
          onClick={() => onUpdate({ flipY: !transform.flipY })}
          disabled={disabled}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
            transform.flipY
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Flip Y
        </button>
      </div>
    </div>
  );
};
