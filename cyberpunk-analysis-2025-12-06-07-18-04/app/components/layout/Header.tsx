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
  Settings,
  HelpCircle,
} from 'lucide-react';

interface DropdownMenuProps {
  title: string;
  items: Array<{
    label: string;
    icon: React.ReactNode;
    action: () => void;
    shortcut?: string;
    divider?: boolean;
  }>;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg flex items-center gap-2 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {title}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 glass-morphism rounded-xl shadow-2xl min-w-[220px] z-50 overflow-hidden animate-fade-in">
          {items.map((item, index) => (
            <div key={index}>
              {item.divider && (
                <div className="h-px bg-slate-700/50 my-1" />
              )}
              <button
                className="w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white flex items-center justify-between gap-3 transition-all duration-200"
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-400">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">{item.shortcut}</span>
                )}
              </button>
            </div>
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
    { divider: true },
    {
      label: 'Import Media',
      icon: <FolderOpen className="w-4 h-4" />,
      action: () => console.log('Import media'),
      shortcut: 'Ctrl+I',
    },
    {
      label: 'Export Video',
      icon: <Download className="w-4 h-4" />,
      action: () => console.log('Export video'),
      shortcut: 'Ctrl+E',
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
    { divider: true },
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

  const helpMenuItems = [
    {
      label: 'Documentation',
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => console.log('Documentation'),
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => console.log('Settings'),
      shortcut: 'Ctrl+,',
    },
  ];

  return (
    <header className="h-16 glass-morphism border-b border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-xl">
      {/* Left: Logo and Menu */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Video Editor Pro</h1>
            <p className="text-xs text-slate-500">Professional Editing Suite</p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          <DropdownMenu title="File" items={fileMenuItems} />
          <DropdownMenu title="Edit" items={editMenuItems} />
          <DropdownMenu title="View" items={viewMenuItems} />
          <DropdownMenu title="Help" items={helpMenuItems} />
        </nav>
      </div>

      {/* Right: Export Button and Actions */}
      <div className="flex items-center gap-3">
        <button className="btn-secondary">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="btn-primary">
          <Download className="w-4 h-4" />
          Export Video
        </button>
      </div>
    </header>
  );
};
