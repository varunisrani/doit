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
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white">Media Library</h2>
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm"
          variant="primary"
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Upload
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
        className={`flex-1 overflow-y-auto p-4 ${
          dragOver ? 'bg-blue-900/20 border-2 border-dashed border-blue-500' : ''
        }`}
      >
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Upload className="w-12 h-12 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-500 mb-2">No media files yet</p>
            <p className="text-xs text-zinc-600">
              Drag and drop files here or click Upload
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {assets.map((asset) => {
              const Icon = getAssetIcon(asset.type);
              return (
                <div
                  key={asset.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('asset-id', asset.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="group relative bg-zinc-800 rounded-lg overflow-hidden cursor-move hover:bg-zinc-750 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                    {asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-white font-medium truncate" title={asset.name}>
                      {asset.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-zinc-500">{formatFileSize(asset.size)}</span>
                      {asset.duration && (
                        <span className="text-xs text-zinc-500">{formatDuration(asset.duration)}</span>
                      )}
                    </div>
                    {asset.width && asset.height && (
                      <span className="text-xs text-zinc-500">
                        {asset.width} x {asset.height}
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset.id);
                      }}
                      size="sm"
                      variant="danger"
                      title="Delete asset"
                    />
                  </div>

                  {/* Duration badge for video/audio */}
                  {asset.duration && asset.type !== 'image' && (
                    <div className="absolute bottom-12 right-2 px-2 py-1 bg-black/75 rounded text-xs text-white">
                      {formatDuration(asset.duration)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
