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
} from 'lucide-react';

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-800">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="px-4 py-3">{children}</div>}
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      className={`w-full px-3 py-2 rounded-lg flex items-center gap-3 text-sm transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

interface MediaItemProps {
  icon: React.ReactNode;
  name: string;
  duration?: string;
}

const MediaItem: React.FC<MediaItemProps> = ({ icon, name, duration }) => {
  return (
    <div className="px-3 py-2 rounded-lg hover:bg-zinc-800 flex items-center gap-3 text-sm text-zinc-300 cursor-pointer transition-colors">
      <div className="text-zinc-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="truncate">{name}</div>
        {duration && (
          <div className="text-xs text-zinc-500">{duration}</div>
        )}
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
      {/* Tools Section */}
      <CollapsiblePanel title="Tools" defaultOpen={true}>
        <div className="space-y-1">
          <ToolButton
            icon={<MousePointer2 className="w-4 h-4" />}
            label="Select"
            active={activeTool === 'select'}
            onClick={() => setActiveTool('select')}
          />
          <ToolButton
            icon={<Scissors className="w-4 h-4" />}
            label="Cut"
            active={activeTool === 'cut'}
            onClick={() => setActiveTool('cut')}
          />
          <ToolButton
            icon={<Type className="w-4 h-4" />}
            label="Text"
            active={activeTool === 'text'}
            onClick={() => setActiveTool('text')}
          />
          <ToolButton
            icon={<ImageIcon className="w-4 h-4" />}
            label="Image"
            active={activeTool === 'image'}
            onClick={() => setActiveTool('image')}
          />
        </div>
      </CollapsiblePanel>

      {/* Media Library Section */}
      <CollapsiblePanel title="Media Library" defaultOpen={true}>
        <div className="space-y-2">
          {/* Upload Button */}
          <button className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-2 text-sm text-zinc-300 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </button>

          {/* Media Items */}
          <div className="mt-4 space-y-1">
            <MediaItem
              icon={<Film className="w-4 h-4" />}
              name="video_clip_1.mp4"
              duration="0:45"
            />
            <MediaItem
              icon={<Film className="w-4 h-4" />}
              name="intro_scene.mp4"
              duration="0:12"
            />
            <MediaItem
              icon={<ImageIcon className="w-4 h-4" />}
              name="background.jpg"
            />
            <MediaItem
              icon={<Music className="w-4 h-4" />}
              name="soundtrack.mp3"
              duration="2:30"
            />
            <MediaItem
              icon={<Folder className="w-4 h-4" />}
              name="Project Assets"
            />
          </div>
        </div>
      </CollapsiblePanel>

      {/* Placeholder for additional panels */}
      <CollapsiblePanel title="Effects" defaultOpen={false}>
        <div className="text-sm text-zinc-500">
          <p>Effects panel content will go here</p>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Transitions" defaultOpen={false}>
        <div className="text-sm text-zinc-500">
          <p>Transitions panel content will go here</p>
        </div>
      </CollapsiblePanel>
    </aside>
  );
};
