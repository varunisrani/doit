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
    <div className="panel-elevated border-b border-[var(--border-primary)] px-6 py-4">
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <div key={tool.id} className="relative group">
            <button
              onClick={() => onToolChange(tool.id)}
              className={`btn p-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                activeTool === tool.id
                  ? 'btn-primary shadow-lg scale-105'
                  : 'btn-secondary hover:scale-105'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
              aria-label={`${tool.label} tool (shortcut: ${tool.shortcut})`}
            >
              {tool.icon}
            </button>

            {/* Modern tooltip */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-3 text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-xl)',
                transform: 'translateX(-50%) translateY(-4px)',
              }}
            >
              <div className="font-semibold text-[var(--text-primary)]">{tool.label}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">{tool.description}</div>
              <div className="text-xs mt-2 flex items-center gap-2">
                <span className="text-[var(--text-tertiary)]">Shortcut:</span>
                <kbd
                  className="px-2 py-1 rounded font-mono text-xs"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {tool.shortcut}
                </kbd>
              </div>
              {/* Tooltip Arrow */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: `6px solid var(--border-primary)`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Modern Active Tool Indicator */}
        <div
          className="ml-6 flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-sm border border-[var(--border-primary)]"
          style={{
            background: 'var(--surface-hover)',
          }}
        >
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)' }}></div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {tools.find((t) => t.id === activeTool)?.label}
          </span>
        </div>
      </div>

      {/* Enhanced Keyboard Shortcuts Help */}
      <div
        className="mt-4 text-xs flex items-center gap-6 px-4 py-2 rounded-lg backdrop-blur-sm"
        style={{
          color: 'var(--text-secondary)',
          background: 'var(--surface-hover)',
        }}
      >
        <span className="font-semibold text-[var(--text-primary)]">Keyboard Shortcuts:</span>
        {tools.map((tool) => (
          <span key={tool.id} className="flex items-center gap-2">
            <kbd
              className="px-2 py-1 rounded font-mono"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: '500',
              }}
            >
              {tool.shortcut}
            </kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>{tool.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
