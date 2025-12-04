import React, { useState, useRef, useEffect } from 'react';
import { Pipette } from 'lucide-react';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presetColors = DEFAULT_PRESETS,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomColor(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'
        }`}
        aria-label={label || 'Color picker'}
      >
        <div
          className="w-6 h-6 rounded border-2 border-zinc-600"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm text-white font-mono">{value.toUpperCase()}</span>
        <Pipette className="w-4 h-4 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl w-64">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Custom Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer bg-zinc-900 border border-zinc-700"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setCustomColor(val);
                      if (val.length === 7) {
                        onChange(val);
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-2">Presets</label>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleColorChange(preset)}
                    className={`w-10 h-10 rounded border-2 transition-all hover:scale-110 ${
                      preset === value ? 'border-blue-500' : 'border-zinc-600'
                    }`}
                    style={{ backgroundColor: preset }}
                    aria-label={`Select color ${preset}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
