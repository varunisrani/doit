'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MousePointer2,
  Scissors,
  Type,
  Image as ImageIcon,
  Film,
  Music,
  Upload,
  Folder,
  Plus,
  Sparkles,
  Layers,
  Palette,
  Zap,
} from 'lucide-react';

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  defaultOpen = true,
  children,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-800/50 last:border-b-0">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-300 hover:bg-slate-800/30 transition-all duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-slate-400 group-hover:text-slate-300 transition-colors">{icon}</div>}
          <span className="font-medium">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-slate-900/30 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  shortcut?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  active = false,
  onClick,
  shortcut,
}) => {
  return (
    <button
      className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-200 group ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
        {icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
      {shortcut && (
        <span className="text-xs bg-slate-800/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {shortcut}
        </span>
      )}
    </button>
  );
};

interface MediaItemProps {
  icon: React.ReactNode;
  name: string;
  duration?: string;
  selected?: boolean;
  onClick?: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  icon,
  name,
  duration,
  selected = false,
  onClick
}) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl flex items-center gap-3 text-sm cursor-pointer transition-all duration-200 group ${
        selected
          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white'
          : 'hover:bg-slate-800/50 text-slate-300 hover:text-white hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className={`text-lg ${selected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{name}</div>
        {duration && (
          <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
            {duration}
          </div>
        )}
      </div>
      <div className="w-2 h-2 rounded-full bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const mediaItems = [
    {
      id: 'video1',
      name: 'video_clip_1.mp4',
      duration: '0:45',
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: 'video2',
      name: 'intro_scene.mp4',
      duration: '0:12',
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: 'image1',
      name: 'background.jpg',
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      id: 'audio1',
      name: 'soundtrack.mp3',
      duration: '2:30',
      icon: <Music className="w-5 h-5" />,
    },
    {
      id: 'folder1',
      name: 'Project Assets',
      icon: <Folder className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-72 bg-slate-900/50 border-r border-slate-800/50 flex flex-col overflow-y-auto backdrop-blur-sm">
      {/* Tools Section */}
      <CollapsiblePanel title="Tools" defaultOpen={true} icon={<Zap className="w-4 h-4" />}>
        <div className="space-y-2">
          <ToolButton
            icon={<MousePointer2 className="w-4 h-4" />}
            label="Select Tool"
            active={activeTool === 'select'}
            onClick={() => setActiveTool('select')}
            shortcut="V"
          />
          <ToolButton
            icon={<Scissors className="w-4 h-4" />}
            label="Cut Tool"
            active={activeTool === 'cut'}
            onClick={() => setActiveTool('cut')}
            shortcut="C"
          />
          <ToolButton
            icon={<Type className="w-4 h-4" />}
            label="Text Tool"
            active={activeTool === 'text'}
            onClick={() => setActiveTool('text')}
            shortcut="T"
          />
          <ToolButton
            icon={<ImageIcon className="w-4 h-4" />}
            label="Image Tool"
            active={activeTool === 'image'}
            onClick={() => setActiveTool('image')}
            shortcut="I"
          />
        </div>
      </CollapsiblePanel>

      {/* Media Library Section */}
      <CollapsiblePanel title="Media Library" defaultOpen={true} icon={<Folder className="w-4 h-4" />}>
        <div className="space-y-3">
          {/* Upload Button */}
          <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:from-blue-600/30 hover:to-purple-600/30 rounded-xl flex items-center justify-center gap-2 text-sm text-blue-300 font-medium transition-all duration-200 hover:shadow-lg group">
            <Upload className="w-4 h-4 group-hover:animate-bounce" />
            <span>Upload Media</span>
          </button>

          {/* Create New Button */}
          <button className="w-full px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-all duration-200 border border-slate-700/50">
            <Plus className="w-3 h-3" />
            <span>Create New</span>
          </button>

          {/* Media Items */}
          <div className="space-y-2 mt-4">
            {mediaItems.map((item) => (
              <MediaItem
                key={item.id}
                icon={item.icon}
                name={item.name}
                duration={item.duration}
                selected={selectedMedia === item.id}
                onClick={() => setSelectedMedia(item.id)}
              />
            ))}
          </div>
        </div>
      </CollapsiblePanel>

      {/* Effects Panel */}
      <CollapsiblePanel title="Effects" defaultOpen={false} icon={<Sparkles className="w-4 h-4" />}>
        <div className="grid grid-cols-3 gap-2">
          {['Blur', 'Glow', 'Shadow', 'Grayscale', 'Sepia', 'Invert'].map((effect) => (
            <button
              key={effect}
              className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all duration-200 hover:shadow-md border border-slate-700/50"
            >
              {effect}
            </button>
          ))}
        </div>
      </CollapsiblePanel>

      {/* Transitions Panel */}
      <CollapsiblePanel title="Transitions" defaultOpen={false} icon={<Layers className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-2">
          {['Fade', 'Slide', 'Zoom', 'Spin', 'Dissolve', 'Wipe'].map((transition) => (
            <button
              key={transition}
              className="px-3 py-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all duration-200 hover:shadow-md border border-slate-700/50"
            >
              {transition}
            </button>
          ))}
        </div>
      </CollapsiblePanel>

      {/* Color Panel */}
      <CollapsiblePanel title="Color & Style" defaultOpen={false} icon={<Palette className="w-4 h-4" />}>
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-2">
            {['red', 'blue', 'green', 'yellow', 'purple', 'pink'].map((color) => (
              <div
                key={color}
                className={`w-8 h-8 bg-${color}-500 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200 border border-slate-700`}
              />
            ))}
          </div>
          <div className="px-2 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <input
              type="range"
              className="w-full"
              min="0"
              max="100"
              defaultValue={50}
            />
          </div>
        </div>
      </CollapsiblePanel>
    </aside>
  );
};
