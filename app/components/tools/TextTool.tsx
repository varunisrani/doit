'use client';

import React, { useState } from 'react';
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  textShadow?: string;
  textStroke?: {
    width: number;
    color: string;
  };
}

interface TextToolProps {
  onAddText: (element: TextElement) => void;
  selectedElement?: TextElement;
  onUpdateText?: (element: TextElement) => void;
}

export const TextTool: React.FC<TextToolProps> = ({
  onAddText,
  selectedElement,
  onUpdateText,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [color, setColor] = useState('#ffffff');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(4);
  const [strokeEnabled, setStrokeEnabled] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState('#000000');

  const handleAddText = () => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: editingText || 'New Text',
      x: 100,
      y: 100,
      fontSize,
      fontFamily,
      color,
      fontWeight,
      fontStyle,
      textDecoration,
      textAlign,
      textShadow: shadowEnabled
        ? `${shadowBlur}px ${shadowBlur}px ${shadowBlur}px ${shadowColor}`
        : undefined,
      textStroke: strokeEnabled
        ? { width: strokeWidth, color: strokeColor }
        : undefined,
    };

    onAddText(newText);
    setEditingText('');
    setIsEditing(false);
  };

  const handleUpdateText = () => {
    if (selectedElement && onUpdateText) {
      const updatedText: TextElement = {
        ...selectedElement,
        text: editingText,
        fontSize,
        fontFamily,
        color,
        fontWeight,
        fontStyle,
        textDecoration,
        textAlign,
        textShadow: shadowEnabled
          ? `${shadowBlur}px ${shadowBlur}px ${shadowBlur}px ${shadowColor}`
          : undefined,
        textStroke: strokeEnabled
          ? { width: strokeWidth, color: strokeColor }
          : undefined,
      };

      onUpdateText(updatedText);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (selectedElement) {
      setEditingText(selectedElement.text);
      setFontSize(selectedElement.fontSize);
      setFontFamily(selectedElement.fontFamily);
      setColor(selectedElement.color);
      setFontWeight(selectedElement.fontWeight);
      setFontStyle(selectedElement.fontStyle);
      setTextDecoration(selectedElement.textDecoration);
      setTextAlign(selectedElement.textAlign);
      if (selectedElement.textShadow) {
        setShadowEnabled(true);
      }
      if (selectedElement.textStroke) {
        setStrokeEnabled(true);
        setStrokeWidth(selectedElement.textStroke.width);
        setStrokeColor(selectedElement.textStroke.color);
      }
    }
  }, [selectedElement]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Type className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">Text Tool</h3>
      </div>

      {/* Text Input */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Text Content</label>
        <input
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          placeholder="Enter text..."
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Font Settings */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-300 block mb-2">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-2">Font Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="8"
            max="200"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Text Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 bg-gray-700 rounded border border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Text Style Buttons */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Text Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
            className={`p-2 rounded ${
              fontWeight === 'bold' ? 'bg-blue-600' : 'bg-gray-700'
            } text-white hover:bg-blue-500 transition-colors`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
            className={`p-2 rounded ${
              fontStyle === 'italic' ? 'bg-blue-600' : 'bg-gray-700'
            } text-white hover:bg-blue-500 transition-colors`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
            className={`p-2 rounded ${
              textDecoration === 'underline' ? 'bg-blue-600' : 'bg-gray-700'
            } text-white hover:bg-blue-500 transition-colors`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">Text Alignment</label>
        <div className="flex gap-2">
          <button
            onClick={() => setTextAlign('left')}
            className={`p-2 rounded ${
              textAlign === 'left' ? 'bg-blue-600' : 'bg-gray-700'
            } text-white hover:bg-blue-500 transition-colors`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('center')}
            className={`p-2 rounded ${
              textAlign === 'center' ? 'bg-blue-600' : 'bg-gray-700'
            } text-white hover:bg-blue-500 transition-colors`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('right')}
            className={`p-2 rounded ${
              textAlign === 'right' ? 'bg-blue-600' : 'bg-gray-700'
            } text-white hover:bg-blue-500 transition-colors`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Text Shadow */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">Text Shadow</label>
          <input
            type="checkbox"
            checked={shadowEnabled}
            onChange={(e) => setShadowEnabled(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
        </div>
        {shadowEnabled && (
          <div className="space-y-3 pl-4">
            <div className="flex gap-2">
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="w-12 h-10 bg-gray-700 rounded border border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Blur: {shadowBlur}px
              </label>
              <input
                type="range"
                value={shadowBlur}
                onChange={(e) => setShadowBlur(Number(e.target.value))}
                min="0"
                max="20"
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Text Stroke */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">Text Outline</label>
          <input
            type="checkbox"
            checked={strokeEnabled}
            onChange={(e) => setStrokeEnabled(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
        </div>
        {strokeEnabled && (
          <div className="space-y-3 pl-4">
            <div className="flex gap-2">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-12 h-10 bg-gray-700 rounded border border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Width: {strokeWidth}px
              </label>
              <input
                type="range"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                min="1"
                max="10"
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-700">
        {selectedElement ? (
          <button
            onClick={handleUpdateText}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Update Text
          </button>
        ) : (
          <button
            onClick={handleAddText}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Add Text
          </button>
        )}
      </div>
    </div>
  );
};

export default TextTool;
