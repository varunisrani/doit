'use client';

import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { useEditorStore } from '@/app/lib/store/editorStore';
import type { Asset, AssetType } from '@/app/lib/store/editorStore';
import {
  ChevronDown,
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
  Clock,
  Star,
  Grid3x3,
  Move,
  Square,
  Circle,
  Search,
  Trash2,
  // Effect icons
  Cloud,
  CircleDot,
  Contrast,
  RefreshCw,
  Grid,
  // Transition icons
  Waves,
  ArrowRight,
  ZoomIn,
  RotateCw,
  Sparkle,
  PanelRight,
} from 'lucide-react';
import { Input } from '../ui/Input';

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  defaultOpen = true,
  children,
  icon,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border-primary)] last:border-b-0">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
              {icon}
            </div>
          )}
          <span className="font-medium">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 text-xs bg-[var(--primary)] text-[var(--text-inverse)] rounded-full">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-[var(--surface-hover)] animate-fade-in">
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
  description?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  active = false,
  onClick,
  shortcut,
  description,
}) => {
  return (
    <button
      className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 group relative ${
        active
          ? 'bg-[var(--primary)] text-[var(--text-inverse)] shadow-lg'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[var(--text-inverse)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="font-medium truncate">{label}</div>
        {description && (
          <div className="text-xs opacity-70 truncate">{description}</div>
        )}
      </div>
      {shortcut && (
        <span className="text-xs px-1.5 py-0.5 bg-[var(--surface)] rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">
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
  size?: string;
  selected?: boolean;
  type?: 'video' | 'audio' | 'image' | 'folder';
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  icon,
  name,
  duration,
  size,
  selected = false,
  type = 'video',
  onClick,
  onDoubleClick,
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'video': return 'var(--track-video)';
      case 'audio': return 'var(--track-audio)';
      case 'image': return 'var(--track-text)';
      case 'folder': return 'var(--accent)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div
      className={`px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm cursor-pointer transition-all duration-200 group relative ${
        selected
          ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--text-primary)]'
          : 'hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={`w-5 h-5 flex-shrink-0 ${selected ? 'text-[var(--primary)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{name}</div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
          {duration && <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </span>}
          {size && <span>{size}</span>}
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
           style={{ backgroundColor: selected ? 'var(--primary)' : getTypeColor() }} />
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { assets, addAsset, removeAsset } = useEditorStore();

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format duration
  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get icon for asset type
  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'video': return <Film className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      default: return <ImageIcon className="w-5 h-5" />;
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type.split('/')[0] as AssetType;

      // Validate file type
      if (!['image', 'video', 'audio'].includes(fileType)) {
        console.warn(`Unsupported file type: ${file.type}`);
        continue;
      }

      // Create object URL for preview
      const url = URL.createObjectURL(file);

      // Get dimensions for image/video
      let width: number | undefined;
      let height: number | undefined;
      let duration: number | undefined;

      if (fileType === 'image') {
        const img = new Image();
        img.src = url;
        await new Promise((resolve) => {
          img.onload = () => {
            width = img.naturalWidth;
            height = img.naturalHeight;
            resolve(null);
          };
        });
      } else if (fileType === 'video') {
        const video = document.createElement('video');
        video.src = url;
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            width = video.videoWidth;
            height = video.videoHeight;
            duration = video.duration;
            resolve(null);
          };
        });
      } else if (fileType === 'audio') {
        const audio = document.createElement('audio');
        audio.src = url;
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => {
            duration = audio.duration;
            resolve(null);
          };
        });
      }

      const asset: Asset = {
        id: crypto.randomUUID(),
        name: file.name,
        type: fileType,
        url,
        thumbnail: fileType === 'image' ? url : undefined,
        width,
        height,
        duration,
        size: file.size,
        createdAt: Date.now(),
      };

      addAsset(asset);
    }
  };

  // Handle delete asset
  const handleDeleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      URL.revokeObjectURL(asset.url);
      removeAsset(id);
    }
  };

  const effects = [
    { name: 'Blur', icon: <Cloud className="w-5 h-5" />, category: 'basic' },
    { name: 'Glow', icon: <Sparkles className="w-5 h-5" />, category: 'basic' },
    { name: 'Shadow', icon: <CircleDot className="w-5 h-5" />, category: 'basic' },
    { name: 'Grayscale', icon: <Contrast className="w-5 h-5" />, category: 'color' },
    { name: 'Sepia', icon: <Palette className="w-5 h-5" />, category: 'color' },
    { name: 'Invert', icon: <RefreshCw className="w-5 h-5" />, category: 'color' },
    { name: 'Pixelate', icon: <Grid className="w-5 h-5" />, category: 'stylize' },
    { name: 'Glitch', icon: <Zap className="w-5 h-5" />, category: 'stylize' },
    { name: 'Film Grain', icon: <Film className="w-5 h-5" />, category: 'texture' },
  ];

  const transitions = [
    { name: 'Fade', icon: <Waves className="w-5 h-5" />, duration: '0.5s' },
    { name: 'Slide', icon: <ArrowRight className="w-5 h-5" />, duration: '0.3s' },
    { name: 'Zoom', icon: <ZoomIn className="w-5 h-5" />, duration: '0.4s' },
    { name: 'Spin', icon: <RotateCw className="w-5 h-5" />, duration: '0.6s' },
    { name: 'Dissolve', icon: <Sparkle className="w-5 h-5" />, duration: '0.5s' },
    { name: 'Wipe', icon: <PanelRight className="w-5 h-5" />, duration: '0.3s' },
  ];

  return (
    <aside className="w-80 bg-[var(--surface)] border-r border-[var(--border-primary)] flex flex-col overflow-y-auto">
      {/* Tools Section */}
      <CollapsiblePanel title="Tools" defaultOpen={true} icon={<Zap className="w-4 h-4" />} badge="PRO">
        <div className="space-y-1">
          <ToolButton
            icon={<MousePointer2 className="w-4 h-4" />}
            label="Select"
            active={activeTool === 'select'}
            onClick={() => setActiveTool('select')}
            shortcut="V"
            description="Select and move objects"
          />
          <ToolButton
            icon={<Move className="w-4 h-4" />}
            label="Pan"
            active={activeTool === 'pan'}
            onClick={() => setActiveTool('pan')}
            shortcut="H"
            description="Navigate canvas"
          />
          <ToolButton
            icon={<Scissors className="w-4 h-4" />}
            label="Cut"
            active={activeTool === 'cut'}
            onClick={() => setActiveTool('cut')}
            shortcut="C"
            description="Split clips"
          />
          <ToolButton
            icon={<Type className="w-4 h-4" />}
            label="Text"
            active={activeTool === 'text'}
            onClick={() => setActiveTool('text')}
            shortcut="T"
            description="Add text layers"
          />
          <ToolButton
            icon={<ImageIcon className="w-4 h-4" />}
            label="Media"
            active={activeTool === 'media'}
            onClick={() => setActiveTool('media')}
            shortcut="I"
            description="Insert media"
          />
          <ToolButton
            icon={<Square className="w-4 h-4" />}
            label="Rectangle"
            active={activeTool === 'rectangle'}
            onClick={() => setActiveTool('rectangle')}
            shortcut="R"
            description="Draw shapes"
          />
          <ToolButton
            icon={<Circle className="w-4 h-4" />}
            label="Circle"
            active={activeTool === 'circle'}
            onClick={() => setActiveTool('circle')}
            shortcut="O"
            description="Draw circles"
          />
          <ToolButton
            icon={<Grid3x3 className="w-4 h-4" />}
            label="Grid"
            active={activeTool === 'grid'}
            onClick={() => setActiveTool('grid')}
            shortcut="G"
            description="Layout tools"
          />
        </div>
      </CollapsiblePanel>

      {/* Media Library Section */}
      <CollapsiblePanel title="Media Library" defaultOpen={true} icon={<Folder className="w-4 h-4" />} badge={assets.length.toString()}>
        <div className="space-y-3">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          {/* Upload Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Upload Media
          </Button>

          {/* Create New */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={() => console.log('Create text')}
              className="text-xs"
            >
              Text
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={() => console.log('Create shape')}
              className="text-xs"
            >
              Shape
            </Button>
          </div>

          {/* Search */}
          <Input
            type="text"
            placeholder="Search media..."
            leftIcon={<Search className="w-4 h-4" />}
            variant="filled"
            size="sm"
            fullWidth
          />

          {/* Media Items */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {assets.length === 0 ? (
              <div className="text-center py-6 text-[var(--text-tertiary)]">
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No media files yet</p>
                <p className="text-xs">Click Upload to add files</p>
              </div>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm cursor-pointer transition-all duration-200 group relative ${
                    selectedMedia === asset.id
                      ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--text-primary)]'
                      : 'hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  onClick={() => setSelectedMedia(asset.id)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('asset-id', asset.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                >
                  {/* Thumbnail or Icon */}
                  <div className="w-10 h-10 rounded bg-[var(--surface-hover)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {asset.thumbnail ? (
                      <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`${
                        asset.type === 'video' ? 'text-purple-500' :
                        asset.type === 'audio' ? 'text-green-500' : 'text-blue-500'
                      }`}>
                        {getAssetIcon(asset.type)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-xs">{asset.name}</div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                      {asset.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(asset.duration)}
                        </span>
                      )}
                      <span>{formatFileSize(asset.size)}</span>
                    </div>
                  </div>

                  {/* Delete button on hover */}
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    onClick={(e) => handleDeleteAsset(asset.id, e)}
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </CollapsiblePanel>

      {/* Effects Panel */}
      <CollapsiblePanel title="Effects" defaultOpen={false} icon={<Sparkles className="w-4 h-4" />} badge="9">
        <div className="space-y-3">
          {/* Effect Categories */}
          <div className="flex gap-1">
            {['All', 'Basic', 'Color', 'Stylize'].map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className="text-xs flex-1"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Effects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {effects.map((effect) => (
              <button
                key={effect.name}
                className="p-3 bg-[var(--surface-hover)] hover:bg-[var(--surface)] rounded-lg border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-all duration-200 group flex flex-col items-center gap-2"
                aria-label={`Apply ${effect.name} effect`}
              >
                <div className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">
                  {effect.icon}
                </div>
                <div className="text-xs text-center font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  {effect.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </CollapsiblePanel>

      {/* Transitions Panel */}
      <CollapsiblePanel title="Transitions" defaultOpen={false} icon={<Layers className="w-4 h-4" />} badge="6">
        <div className="space-y-2">
          {transitions.map((transition) => (
            <button
              key={transition.name}
              className="w-full px-3 py-2.5 bg-[var(--surface-hover)] hover:bg-[var(--surface)] rounded-lg border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-all duration-200 group flex items-center justify-between"
              aria-label={`Apply ${transition.name} transition`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">{transition.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {transition.name}
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    {transition.duration}
                  </div>
                </div>
              </div>
              <IconButton
                icon={<Star className="w-3 h-3" />}
                variant="ghost"
                size="xs"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          ))}
        </div>
      </CollapsiblePanel>

      {/* Color Panel */}
      <CollapsiblePanel title="Color & Style" defaultOpen={false} icon={<Palette className="w-4 h-4" />}>
        <div className="space-y-4">
          {/* Color Presets */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {[
              { color: '#ef4444', name: 'Red' },
              { color: '#f97316', name: 'Orange' },
              { color: '#eab308', name: 'Yellow' },
              { color: '#22c55e', name: 'Green' },
              { color: '#3b82f6', name: 'Blue' },
              { color: '#8b5cf6', name: 'Purple' },
              { color: '#ec4899', name: 'Pink' },
              { color: '#6b7280', name: 'Gray' },
              { color: '#000000', name: 'Black' },
              { color: '#ffffff', name: 'White' },
              { color: '#fbbf24', name: 'Amber' },
              { color: '#10b981', name: 'Emerald' },
            ].map((color) => (
              <button
                key={color.name}
                className="w-8 h-8 rounded-lg border-2 border-[var(--border-primary)] hover:scale-110 transition-transform duration-200 relative group"
                style={{ backgroundColor: color.color }}
                title={color.name}
              >
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-[var(--text-primary)] transition-colors" />
              </button>
            ))}
          </div>

          {/* Opacity Slider */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
              Opacity
            </label>
            <input
              type="range"
              className="w-full h-2 bg-[var(--surface-hover)] rounded-lg appearance-none cursor-pointer slider"
              min="0"
              max="100"
              defaultValue={100}
            />
          </div>

          {/* Blend Mode */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
              Blend Mode
            </label>
            <select className="w-full px-3 py-2 text-sm bg-[var(--surface-hover)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]">
              <option>Normal</option>
              <option>Multiply</option>
              <option>Screen</option>
              <option>Overlay</option>
              <option>Darken</option>
              <option>Lighten</option>
              <option>Color Dodge</option>
              <option>Color Burn</option>
              <option>Hard Light</option>
              <option>Soft Light</option>
              <option>Difference</option>
              <option>Exclusion</option>
            </select>
          </div>
        </div>
      </CollapsiblePanel>
    </aside>
  );
};
