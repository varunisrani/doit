import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Eye, EyeOff, Copy, Check } from 'lucide-react';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
  disabled?: boolean;
  className?: string;
  showAlpha?: boolean;
  allowEyedropper?: boolean;
  showHexInput?: boolean;
}

const DEFAULT_PRESETS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', // Grays
  '#000000', '#171717', '#262626', '#404040', '#525252', // Dark grays
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', // Warm colors
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', // Cool colors
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', // Purples
  '#ec4899', '#f43f5e', // Pinks & reds
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presetColors = DEFAULT_PRESETS,
  disabled = false,
  className = '',
  showAlpha = false,
  allowEyedropper = true,
  showHexInput = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const [copied, setCopied] = useState(false);
  const [showAlphaInput, setShowAlphaInput] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const pickerId = React.useId();

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

  const handleHexInputChange = (input: string) => {
    const val = input.trim();
    let formattedVal = val;

    // Auto-add # if missing
    if (!val.startsWith('#') && val.length > 0) {
      formattedVal = `#${val}`;
    }

    // Validate hex format
    if (/^#[0-9A-Fa-f]{0,6}$/.test(formattedVal)) {
      setCustomColor(formattedVal);
      if (formattedVal.length === 7) {
        onChange(formattedVal);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const handleEyedropper = () => {
    if (colorInputRef.current && 'showPicker' in colorInputRef.current) {
      colorInputRef.current.showPicker();
    }
  };

  // Get contrast color for text
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

  const contrastColor = getContrastColor(value);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          {label}
        </label>
      )}

      {/* Color Picker Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-3 px-4 py-2.5
          bg-[var(--surface)]
          border border-[var(--border-primary)]
          rounded-lg
          transition-all duration-200 ease-in-out
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--focus-ring)]
          focus:ring-offset-2
          focus:ring-offset-[var(--background)]
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:pointer-events-none
          ${!disabled && 'hover:bg-[var(--surface-hover)] hover:border-[var(--border-secondary)]'}
          min-h-[44px] // WCAG touch target
        `}
        aria-label={label || 'Color picker'}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? `${pickerId}-popover` : undefined}
      >
        {/* Color Preview */}
        <div className="relative group">
          <div
            className="w-8 h-8 rounded-lg border-2 border-[var(--border-secondary)] shadow-sm"
            style={{ backgroundColor: value }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: contrastColor,
            }}
          >
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* Color Value */}
        <div className="flex-1 text-left">
          <span className="text-sm font-mono text-[var(--text-primary)]">
            {value.toUpperCase()}
          </span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
            aria-label="Copy color value"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <Pipette className="w-4 h-4 text-[var(--text-tertiary)]" />
        </div>
      </button>

      {/* Color Picker Popover */}
      {isOpen && (
        <div
          id={`${pickerId}-popover`}
          className={`
            absolute z-[var(--dropdown)] mt-2 p-4
            bg-[var(--surface-elevated)]
            border border-[var(--border-primary)]
            rounded-xl
            shadow-[var(--shadow-xl)]
            w-80
            animate-in fade-in zoom-in-95
            duration-200 ease-out
          `}
        >
          <div className="space-y-4">
            {/* Color Input Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Custom Color
                </label>
                {allowEyedropper && (
                  <button
                    type="button"
                    onClick={handleEyedropper}
                    className="text-xs px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Eyedropper
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {/* Native Color Picker */}
                <div className="relative">
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer bg-[var(--surface)] border border-[var(--border-primary)]"
                    aria-label="Color picker"
                  />
                </div>

                {/* Hex Input */}
                {showHexInput && (
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => handleHexInputChange(e.target.value)}
                      className="
                        w-full px-3 py-2.5
                        bg-[var(--surface)]
                        border border-[var(--border-primary)]
                        rounded-lg
                        text-[var(--text-primary)]
                        text-sm font-mono
                        placeholder-[var(--text-tertiary)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                        transition-colors
                      "
                      placeholder="#000000"
                      aria-label="Hex color value"
                    />
                    {copied && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--success)]">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Preset Colors */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Preset Colors
                </label>
                <button
                  type="button"
                  onClick={() => setShowAlphaInput(!showAlphaInput)}
                  className="text-xs px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
                >
                  {showAlpha ? <EyeOff className="w-3 h-3 inline mr-1" /> : <Eye className="w-3 h-3 inline mr-1" />}
                  {showAlpha ? 'Hide' : 'Show'} Alpha
                </button>
              </div>

              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleColorChange(preset)}
                    className={`
                      w-8 h-8 rounded-lg border-2
                      transition-all duration-200
                      hover:scale-110 hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                      ${preset === value
                        ? 'border-[var(--primary)] shadow-md ring-2 ring-[var(--primary)]/30'
                        : 'border-[var(--border-secondary)]'
                      }
                    `}
                    style={{ backgroundColor: preset }}
                    aria-label={`Select color ${preset}`}
                  >
                    {preset === value && (
                      <div
                        className="w-full h-full rounded-lg flex items-center justify-center"
                        style={{ color: getContrastColor(preset) }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Colors (could be implemented) */}
            <div className="pt-2 border-t border-[var(--border-primary)]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">
                  Current: {value.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
