'use client';

import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/app/lib/store/editorStore';
import { Upload, Trash2, Image as ImageIcon, Video, Music } from 'lucide-react';
import { IconButton } from '@/app/components/ui/IconButton';
import { Button } from '@/app/components/ui/Button';
import type { Asset, AssetType } from '@/app/lib/store/editorStore';

export const MediaPanel: React.FC = () => {
  const { assets, addAsset, removeAsset } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteAsset = (id: string) => {
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      // Revoke object URL to free memory
      URL.revokeObjectURL(asset.url);
      removeAsset(id);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      default:
        return ImageIcon;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-l border-[var(--border-primary)] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)]"></div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Media Library</h2>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm"
          variant="primary"
          leftIcon={<Upload className="w-4 h-4" />}
          className="shadow-sm hover:shadow-md"
        >
          Upload Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          dragOver
            ? 'bg-[var(--info-bg)]/20 border-2 border-dashed border-[var(--info)]'
            : 'bg-[var(--background)]'
        }`}
      >
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className={`w-20 h-20 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mb-6 transition-transform duration-300 ${
              dragOver ? 'scale-110' : 'scale-100'
            }`}>
              <Upload className={`w-10 h-10 text-[var(--text-secondary)] transition-colors ${
                dragOver ? 'text-[var(--info)]' : ''
              }`} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
              {dragOver ? 'Drop files here' : 'No media files yet'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-[250px]">
              {dragOver
                ? 'Release to upload your media files'
                : 'Drag and drop files here or click Upload to get started'
              }
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 text-xs bg-[var(--surface-elevated)] text-[var(--text-secondary)] rounded-full font-medium">
                Images
              </span>
              <span className="px-3 py-1 text-xs bg-[var(--surface-elevated)] text-[var(--text-secondary)] rounded-full font-medium">
                Videos
              </span>
              <span className="px-3 py-1 text-xs bg-[var(--surface-elevated)] text-[var(--text-secondary)] rounded-full font-medium">
                Audio
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Asset count and filter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[var(--text-secondary)]">
                {assets.length} {assets.length === 1 ? 'file' : 'files'}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="ghost"
                  leftIcon={<Upload className="w-3 h-3" />}
                  className="text-xs"
                >
                  Add More
                </Button>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-2 gap-3">
              {assets.map((asset) => {
                const Icon = getAssetIcon(asset.type);
                const typeColors = {
                  image: 'text-blue-500',
                  video: 'text-purple-500',
                  audio: 'text-green-500',
                };

                return (
                  <div
                    key={asset.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('asset-id', asset.id);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="group relative bg-[var(--surface-elevated)] rounded-xl overflow-hidden cursor-move transition-all duration-200 hover:bg-[var(--surface-hover)] hover:shadow-lg hover:scale-[1.02] border border-[var(--border-primary)]"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[var(--surface)] flex items-center justify-center relative overflow-hidden">
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Icon className={`w-8 h-8 ${typeColors[asset.type] || 'text-[var(--text-secondary)]'} mb-1`} />
                          <span className="text-xs text-[var(--text-tertiary)] capitalize">{asset.type}</span>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-start p-2">
                        <div className="text-white">
                          <p className="text-xs font-medium truncate">{asset.name}</p>
                          <p className="text-xs opacity-75">{formatFileSize(asset.size)}</p>
                        </div>
                      </div>

                      {/* Duration badge for video/audio */}
                      {asset.duration && asset.type !== 'image' && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white font-medium">
                          {formatDuration(asset.duration)}
                        </div>
                      )}

                      {/* Type indicator */}
                      <div className={`absolute top-2 left-2 w-6 h-6 rounded-full bg-[var(--surface-elevated)]/90 backdrop-blur-sm flex items-center justify-center border border-[var(--border-primary)]`}>
                        <Icon className={`w-3 h-3 ${typeColors[asset.type] || 'text-[var(--text-secondary)]'}`} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-[var(--surface-elevated)]">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate mb-1" title={asset.name}>
                        {asset.name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                        <span>{formatFileSize(asset.size)}</span>
                        {asset.width && asset.height && (
                          <span>{asset.width}×{asset.height}</span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <IconButton
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAsset(asset.id);
                        }}
                        size="sm"
                        variant="danger"
                        title="Delete asset"
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/50"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
