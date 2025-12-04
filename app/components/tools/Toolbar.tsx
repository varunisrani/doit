'use client';

import React from 'react';
import { MousePointer2, Type, Shapes, Hand, Crop, ZoomIn } from 'lucide-react';

export type ToolType = 'select' | 'text' | 'shape' | 'hand' | 'crop' | 'zoom';

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

interface Tool {
  id: ToolType;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  description: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolChange }) => {
  const tools: Tool[] = [
    {
      id: 'select',
      icon: <MousePointer2 className="w-5 h-5" />,
      label: 'Select',
      shortcut: 'V',
      description: 'Select and move objects',
    },
    {
      id: 'text',
      icon: <Type className="w-5 h-5" />,
      label: 'Text',
      shortcut: 'T',
      description: 'Add and edit text',
    },
    {
      id: 'shape',
      icon: <Shapes className="w-5 h-5" />,
      label: 'Shape',
      shortcut: 'S',
      description: 'Draw shapes',
    },
    {
      id: 'hand',
      icon: <Hand className="w-5 h-5" />,
      label: 'Hand',
      shortcut: 'H',
      description: 'Pan around canvas',
    },
    {
      id: 'crop',
      icon: <Crop className="w-5 h-5" />,
      label: 'Crop',
      shortcut: 'C',
      description: 'Crop video or images',
    },
    {
      id: 'zoom',
      icon: <ZoomIn className="w-5 h-5" />,
      label: 'Zoom',
      shortcut: 'Z',
      description: 'Zoom controls',
    },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <div key={tool.id} className="relative group">
            <button
              onClick={() => onToolChange(tool.id)}
              className={`p-3 rounded-lg transition-all ${
                activeTool === tool.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              {tool.icon}
            </button>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              <div className="font-semibold">{tool.label}</div>
              <div className="text-xs text-gray-400">{tool.description}</div>
              <div className="text-xs text-blue-400 mt-1">
                Shortcut: <kbd className="px-1 py-0.5 bg-gray-800 rounded">{tool.shortcut}</kbd>
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        ))}

        {/* Active Tool Indicator */}
        <div className="ml-4 flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">
            {tools.find((t) => t.id === activeTool)?.label}
          </span>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-2 text-xs text-gray-400 flex items-center gap-4">
        <span>Keyboard Shortcuts:</span>
        {tools.map((tool) => (
          <span key={tool.id} className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">
              {tool.shortcut}
            </kbd>
            <span className="text-gray-500">{tool.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
