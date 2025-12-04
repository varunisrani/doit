'use client';

import React, { useState } from 'react';
import {
  Menu,
  FileText,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  ClipboardPaste,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  ChevronDown,
} from 'lucide-react';

interface DropdownMenuProps {
  title: string;
  items: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
    shortcut?: string;
  }>;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 rounded flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {title}
        <ChevronDown className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl min-w-[200px] z-50">
          {items.map((item, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center justify-between gap-3 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-zinc-500">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const fileMenuItems = [
    {
      label: 'New Project',
      icon: <FileText className="w-4 h-4" />,
      action: () => console.log('New project'),
      shortcut: 'Ctrl+N',
    },
    {
      label: 'Open Project',
      icon: <FolderOpen className="w-4 h-4" />,
      action: () => console.log('Open project'),
      shortcut: 'Ctrl+O',
    },
    {
      label: 'Save Project',
      icon: <Save className="w-4 h-4" />,
      action: () => console.log('Save project'),
      shortcut: 'Ctrl+S',
    },
  ];

  const editMenuItems = [
    {
      label: 'Undo',
      icon: <Undo2 className="w-4 h-4" />,
      action: () => console.log('Undo'),
      shortcut: 'Ctrl+Z',
    },
    {
      label: 'Redo',
      icon: <Redo2 className="w-4 h-4" />,
      action: () => console.log('Redo'),
      shortcut: 'Ctrl+Y',
    },
    {
      label: 'Cut',
      icon: <Scissors className="w-4 h-4" />,
      action: () => console.log('Cut'),
      shortcut: 'Ctrl+X',
    },
    {
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      action: () => console.log('Copy'),
      shortcut: 'Ctrl+C',
    },
    {
      label: 'Paste',
      icon: <ClipboardPaste className="w-4 h-4" />,
      action: () => console.log('Paste'),
      shortcut: 'Ctrl+V',
    },
  ];

  const viewMenuItems = [
    {
      label: 'Zoom In',
      icon: <ZoomIn className="w-4 h-4" />,
      action: () => console.log('Zoom in'),
      shortcut: 'Ctrl++',
    },
    {
      label: 'Zoom Out',
      icon: <ZoomOut className="w-4 h-4" />,
      action: () => console.log('Zoom out'),
      shortcut: 'Ctrl+-',
    },
    {
      label: 'Fit to Screen',
      icon: <Maximize2 className="w-4 h-4" />,
      action: () => console.log('Fit to screen'),
      shortcut: 'Ctrl+0',
    },
  ];

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
      {/* Left: Logo and Menu */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Video Editor</h1>
        </div>

        <nav className="flex items-center gap-1">
          <DropdownMenu title="File" items={fileMenuItems} />
          <DropdownMenu title="Edit" items={editMenuItems} />
          <DropdownMenu title="View" items={viewMenuItems} />
        </nav>
      </div>

      {/* Right: Export Button */}
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
        <Download className="w-4 h-4" />
        Export Video
      </button>
    </header>
  );
};
