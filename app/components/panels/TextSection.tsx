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
  const alignmentButtons: { align: TextAlign; icon: typeof AlignLeft; label: string }[] = [
    { align: 'left', icon: AlignLeft, label: 'Left' },
    { align: 'center', icon: AlignCenter, label: 'Center' },
    { align: 'right', icon: AlignRight, label: 'Right' },
    { align: 'justify', icon: AlignJustify, label: 'Justify' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-[var(--accent)]"></div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Text Properties</h3>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          Content
        </label>
        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <textarea
            value={element.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] text-sm placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] resize-none disabled:opacity-50 min-h-[80px]"
            rows={3}
            placeholder="Enter your text here..."
          />
          <div className="mt-2 text-xs text-[var(--text-tertiary)]">
            {element.content.length} characters
          </div>
        </div>
      </div>

      {/* Typography Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Typography
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)] space-y-4">
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
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Size"
              type="number"
              value={element.fontSize}
              onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) || 16 })}
              disabled={disabled}
              className="text-sm"
              min={1}
              rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
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
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Alignment
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <div className="grid grid-cols-4 gap-2">
            {alignmentButtons.map(({ align, icon: Icon, label }) => (
              <button
                key={align}
                onClick={() => onUpdate({ textAlign: align })}
                disabled={disabled}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                  element.textAlign === align
                    ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)]'
                    : 'bg-[var(--surface)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={label}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Spacing
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)] space-y-4">
          <Input
            label="Line Height"
            type="number"
            step="0.1"
            value={element.lineHeight}
            onChange={(e) => onUpdate({ lineHeight: parseFloat(e.target.value) || 1 })}
            disabled={disabled}
            className="text-sm"
            min={0.5}
            max={3}
          />

          <Input
            label="Letter Spacing"
            type="number"
            step="0.5"
            value={element.letterSpacing}
            onChange={(e) => onUpdate({ letterSpacing: parseFloat(e.target.value) || 0 })}
            disabled={disabled}
            className="text-sm"
            rightIcon={<span className="text-xs text-[var(--text-tertiary)]">px</span>}
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
              Background
            </label>
            <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
          </div>
          {element.backgroundColor && (
            <Button
              onClick={() => onUpdate({ backgroundColor: undefined })}
              disabled={disabled}
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error-bg)]"
            >
              Remove
            </Button>
          )}
        </div>

        {element.backgroundColor ? (
          <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
            <ColorPicker
              value={element.backgroundColor}
              onChange={(value) => onUpdate({ backgroundColor: value })}
              disabled={disabled}
            />
          </div>
        ) : (
          <div className="p-4 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)] border-dashed">
            <button
              onClick={() => onUpdate({ backgroundColor: 'rgba(0,0,0,0.8)' })}
              disabled={disabled}
              className="w-full flex flex-col items-center justify-center gap-2 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span className="text-sm font-medium">Add Background</span>
              <span className="text-xs text-[var(--text-tertiary)]">Add a background color</span>
            </button>
          </div>
        )}
      </div>

      {/* Text Style Toggles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            Text Style
          </label>
          <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
        </div>

        <div className="p-3 bg-[var(--surface-elevated)]/50 rounded-lg border border-[var(--border-primary)]">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
              disabled={disabled}
              variant={element.fontStyle === 'italic' ? 'primary' : 'secondary'}
              size="sm"
              className="font-medium"
            >
              <span className="italic">Italic</span>
            </Button>
            <Button
              onClick={() => onUpdate({ textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' })}
              disabled={disabled}
              variant={element.textDecoration === 'underline' ? 'primary' : 'secondary'}
              size="sm"
              className="font-medium underline"
            >
              Underline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
