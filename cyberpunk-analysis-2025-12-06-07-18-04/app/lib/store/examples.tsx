/**
 * Example components demonstrating how to use the video editor stores
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  useEditorStore,
  useTimelineStore,
  useSelectionStore,
  type Asset,
  type Clip,
} from './index';
import { useHistoryIntegration } from './useHistoryIntegration';

/**
 * Example 1: Project Settings Panel
 */
export function ProjectSettingsPanel() {
  const { project, setProjectSettings, metadata } = useEditorStore();
  const { recordState } = useHistoryIntegration();

  const handleResolutionChange = (width: number, height: number) => {
    setProjectSettings({ width, height });
    recordState(`Change resolution to ${width}x${height}`);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Project Settings</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-sm">Project Name</label>
          <p className="font-medium">{metadata.name}</p>
        </div>
        <div>
          <label className="block text-sm">Resolution</label>
          <select
            value={`${project.width}x${project.height}`}
            onChange={(e) => {
              const [w, h] = e.target.value.split('x').map(Number);
              handleResolutionChange(w, h);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="1920x1080">1920x1080 (Full HD)</option>
            <option value="1280x720">1280x720 (HD)</option>
            <option value="3840x2160">3840x2160 (4K)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">FPS: {project.fps}</label>
          <input
            type="range"
            min={24}
            max={60}
            value={project.fps}
            onChange={(e) => {
              setProjectSettings({ fps: Number(e.target.value) });
              recordState(`Change FPS to ${e.target.value}`);
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Example 2: Asset Library
 */
export function AssetLibrary() {
  const { assets, addAsset, removeAsset } = useEditorStore();
  const { recordState } = useHistoryIntegration();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const asset: Asset = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.startsWith('video') ? 'video' :
              file.type.startsWith('audio') ? 'audio' : 'image',
        url: URL.createObjectURL(file),
        size: file.size,
        createdAt: Date.now(),
      };

      addAsset(asset);
    }

    recordState(`Import ${files.length} asset(s)`);
  };

  const handleRemoveAsset = (id: string, name: string) => {
    removeAsset(id);
    recordState(`Remove asset: ${name}`);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Asset Library</h3>
      <input
        type="file"
        multiple
        accept="video/*,audio/*,image/*"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <div className="grid grid-cols-2 gap-2">
        {assets.map((asset) => (
          <div key={asset.id} className="border rounded p-2">
            <div className="text-sm font-medium truncate">{asset.name}</div>
            <div className="text-xs text-gray-500">{asset.type}</div>
            <button
              onClick={() => handleRemoveAsset(asset.id, asset.name)}
              className="text-red-500 text-xs mt-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 3: Timeline Controls
 */
export function TimelineControls() {
  const {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    setCurrentTime,
    loop,
    setLoop,
  } = useTimelineStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Timeline Controls</h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? pause : play}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={stop}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Stop
          </button>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />
            Loop
          </label>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Example 4: Track Manager
 */
export function TrackManager() {
  const { tracks, addTrack, removeTrack, toggleTrackMute, toggleTrackLock } = useTimelineStore();
  const { recordState } = useHistoryIntegration();

  const handleAddTrack = (type: 'video' | 'audio' | 'text') => {
    const trackName = `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${tracks.length + 1}`;
    addTrack({ name: trackName, type });
    recordState(`Add ${type} track`);
  };

  const handleRemoveTrack = (id: string, name: string) => {
    removeTrack(id);
    recordState(`Remove track: ${name}`);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Tracks</h3>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleAddTrack('video')}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          + Video Track
        </button>
        <button
          onClick={() => handleAddTrack('audio')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          + Audio Track
        </button>
        <button
          onClick={() => handleAddTrack('text')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          + Text Track
        </button>
      </div>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div key={track.id} className="border rounded p-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{track.name}</div>
              <div className="text-xs text-gray-500">
                {track.clips.length} clip(s)
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTrackMute(track.id)}
                className={`px-2 py-1 rounded text-xs ${
                  track.muted ? 'bg-red-500 text-white' : 'bg-gray-200'
                }`}
              >
                {track.muted ? 'Muted' : 'Mute'}
              </button>
              <button
                onClick={() => toggleTrackLock(track.id)}
                className={`px-2 py-1 rounded text-xs ${
                  track.locked ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                }`}
              >
                {track.locked ? 'Locked' : 'Lock'}
              </button>
              <button
                onClick={() => handleRemoveTrack(track.id, track.name)}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 5: Selection Info
 */
export function SelectionInfo() {
  const {
    selectedElementIds,
    selectedClipIds,
    clearAll,
  } = useSelectionStore();

  const totalSelected = selectedElementIds.size + selectedClipIds.size;

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Selection</h3>
      <div className="space-y-2">
        <div>
          <span className="text-sm">Canvas Elements: </span>
          <span className="font-medium">{selectedElementIds.size}</span>
        </div>
        <div>
          <span className="text-sm">Timeline Clips: </span>
          <span className="font-medium">{selectedClipIds.size}</span>
        </div>
        {totalSelected > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Example 6: History Controls
 */
export function HistoryControls() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
    clearHistory,
  } = useHistoryIntegration();

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">History</h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Redo
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {undoDescription && <div>Undo: {undoDescription}</div>}
          {redoDescription && <div>Redo: {redoDescription}</div>}
        </div>
        <button
          onClick={clearHistory}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Clear History
        </button>
      </div>
    </div>
  );
}

/**
 * Example 7: Canvas Tool Selector
 */
export function ToolSelector() {
  const { currentTool, setCurrentTool } = useEditorStore();

  const tools = [
    { id: 'select', label: 'Select', icon: '→' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'shape', label: 'Shape', icon: '□' },
    { id: 'crop', label: 'Crop', icon: '✂' },
    { id: 'draw', label: 'Draw', icon: '✎' },
    { id: 'hand', label: 'Hand', icon: '✋' },
  ] as const;

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Tools</h3>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id as any)}
            className={`px-3 py-2 rounded ${
              currentTool === tool.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            <div className="text-lg">{tool.icon}</div>
            <div className="text-xs">{tool.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 8: Complete Demo App
 */
export function VideoEditorDemo() {
  const { setMultiSelectMode } = useSelectionStore();

  // Handle multi-select key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setMultiSelectMode(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setMultiSelectMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setMultiSelectMode]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Video Editor Store Demo</h1>
      <div className="grid grid-cols-2 gap-4">
        <ProjectSettingsPanel />
        <AssetLibrary />
        <TimelineControls />
        <TrackManager />
        <SelectionInfo />
        <HistoryControls />
        <ToolSelector />
      </div>
    </div>
  );
}
