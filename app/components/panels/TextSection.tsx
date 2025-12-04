'use client';

import React from 'react';
import { Input } from '@/app/components/ui/Input';
import { Dropdown } from '@/app/components/ui/Dropdown';
import { ColorPicker } from '@/app/components/ui/ColorPicker';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import type { TextElement, TextAlign, FontWeight } from '@/app/types/elements';

interface TextSectionProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
  disabled?: boolean;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Palatino',
  'Garamond',
  'Bookman',
  'Avant Garde',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Inter',
];

const FONT_WEIGHTS: { value: FontWeight; label: string }[] = [
  { value: 100, label: 'Thin (100)' },
  { value: 200, label: 'Extra Light (200)' },
  { value: 300, label: 'Light (300)' },
  { value: 400, label: 'Regular (400)' },
  { value: 500, label: 'Medium (500)' },
  { value: 600, label: 'Semi Bold (600)' },
  { value: 700, label: 'Bold (700)' },
  { value: 800, label: 'Extra Bold (800)' },
  { value: 900, label: 'Black (900)' },
];

export const TextSection: React.FC<TextSectionProps> = ({
  element,
  onUpdate,
  disabled = false,
}) => {
  const alignmentButtons: { align: TextAlign; icon: typeof AlignLeft }[] = [
    { align: 'left', icon: AlignLeft },
    { align: 'center', icon: AlignCenter },
    { align: 'right', icon: AlignRight },
    { align: 'justify', icon: AlignJustify },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white">Text</h3>

      {/* Text Content */}
      <div>
        <label className="block text-xs text-zinc-400 mb-2">Content</label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          disabled={disabled}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
          rows={3}
        />
      </div>

      {/* Font Family */}
      <Dropdown
        label="Font Family"
        value={element.fontFamily}
        onChange={(value) => onUpdate({ fontFamily: value })}
        options={FONT_FAMILIES.map((font) => ({
          value: font,
          label: font,
        }))}
        disabled={disabled}
      />

      {/* Font Size and Weight */}
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Size"
          type="number"
          value={element.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) || 16 })}
          disabled={disabled}
          className="text-xs"
          min={1}
          rightIcon={<span className="text-xs text-zinc-500">px</span>}
        />
        <Dropdown
          label="Weight"
          value={element.fontWeight.toString()}
          onChange={(value) => onUpdate({ fontWeight: parseInt(value) as FontWeight })}
          options={FONT_WEIGHTS.map((w) => ({
            value: w.value.toString(),
            label: w.label,
          }))}
          disabled={disabled}
        />
      </div>

      {/* Text Color */}
      <ColorPicker
        label="Color"
        value={element.color}
        onChange={(value) => onUpdate({ color: value })}
        disabled={disabled}
      />

      {/* Text Alignment */}
      <div className="space-y-2">
        <label className="block text-xs text-zinc-400">Alignment</label>
        <div className="grid grid-cols-4 gap-2">
          {alignmentButtons.map(({ align, icon: Icon }) => (
            <button
              key={align}
              onClick={() => onUpdate({ textAlign: align })}
              disabled={disabled}
              className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
                element.textAlign === align
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={align.charAt(0).toUpperCase() + align.slice(1)}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <Input
        label="Line Height"
        type="number"
        step="0.1"
        value={element.lineHeight}
        onChange={(e) => onUpdate({ lineHeight: parseFloat(e.target.value) || 1 })}
        disabled={disabled}
        className="text-xs"
        min={0.5}
        max={3}
      />

      {/* Letter Spacing */}
      <Input
        label="Letter Spacing"
        type="number"
        step="0.5"
        value={element.letterSpacing}
        onChange={(e) => onUpdate({ letterSpacing: parseFloat(e.target.value) || 0 })}
        disabled={disabled}
        className="text-xs"
        rightIcon={<span className="text-xs text-zinc-500">px</span>}
      />

      {/* Background Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs text-zinc-400">Background</label>
          {element.backgroundColor && (
            <button
              onClick={() => onUpdate({ backgroundColor: undefined })}
              disabled={disabled}
              className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        {element.backgroundColor ? (
          <ColorPicker
            value={element.backgroundColor}
            onChange={(value) => onUpdate({ backgroundColor: value })}
            disabled={disabled}
          />
        ) : (
          <button
            onClick={() => onUpdate({ backgroundColor: '#000000' })}
            disabled={disabled}
            className="w-full px-3 py-2 text-xs font-medium bg-zinc-800 text-zinc-400 rounded-md hover:bg-zinc-700 disabled:opacity-50"
          >
            Add Background
          </button>
        )}
      </div>

      {/* Text Style Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
          disabled={disabled}
          className={`px-3 py-2 text-xs font-medium italic rounded-md transition-colors ${
            element.fontStyle === 'italic'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Italic
        </button>
        <button
          onClick={() => onUpdate({ textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' })}
          disabled={disabled}
          className={`px-3 py-2 text-xs font-medium underline rounded-md transition-colors ${
            element.textDecoration === 'underline'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Underline
        </button>
      </div>
    </div>
  );
};
