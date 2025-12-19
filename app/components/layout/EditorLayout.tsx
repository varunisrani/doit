'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import EditorCanvas from '../canvas/EditorCanvas';
import { Timeline } from '../timeline/Timeline';
import { PropertiesPanel } from '../panels/PropertiesPanel';
import { useEditorStore } from '@/app/lib/store/editorStore';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import { useAutoSave } from '@/app/hooks/useAutoSave';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  MousePointer,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Type,
  Square,
  Hand,
  Grid,
  Ruler,
} from 'lucide-react';

interface EditorLayoutProps {
  children?: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  // Store state
  const {
    sidebarVisible,
    propertiesVisible,
    setSidebarVisible,
    setPropertiesVisible,
    currentTool,
    setCurrentTool,
    project,
    canvasTransform,
    setZoom,
  } = useEditorStore();

  const { elements, createTextElement, createShapeElement } = useCanvasStore();
  const { tracks } = useTimelineStore();
  const { clearAll } = useSelectionStore();

  // Local state
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(100);

  // Auto-save hook
  const { hasUnsavedChanges, saveNow } = useAutoSave();

  // Sync zoom between local state and store
  useEffect(() => {
    setCanvasZoom(Math.round(canvasTransform.zoom * 100));
  }, [canvasTransform.zoom]);

  const handleZoomChange = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(25, Math.min(400, newZoom));
    setCanvasZoom(clampedZoom);
    setZoom(clampedZoom / 100);
  }, [setZoom]);

  // Tool change handler
  const handleToolChange = useCallback((tool: typeof currentTool) => {
    setCurrentTool(tool);
    if (tool !== 'select') {
      clearAll();
    }
  }, [setCurrentTool, clearAll]);

  // Handle canvas click for tool actions
  const handleCanvasToolAction = useCallback((x: number, y: number) => {
    switch (currentTool) {
      case 'text':
        createTextElement('New Text', x, y);
        setCurrentTool('select');
        break;
      case 'shape':
        createShapeElement('rectangle', x, y);
        setCurrentTool('select');
        break;
      default:
        break;
    }
  }, [currentTool, createTextElement, createShapeElement, setCurrentTool]);

  return (
    <div className="h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="h-16 bg-[var(--surface-elevated)] border-b border-[var(--border-primary)] z-50 backdrop-blur-xl">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Toggle Button */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
          <IconButton
            icon={sidebarVisible ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            variant="secondary"
            size="sm"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            tooltip={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            className="rounded-r-lg rounded-l-none border-l-0 shadow-lg"
          />
        </div>

        {/* Left Sidebar */}
        {sidebarVisible && (
          <div className="w-72 md:w-80 bg-[var(--surface)] border-r border-[var(--border-primary)] flex-shrink-0 transition-all duration-300 ease-in-out">
            <Sidebar />
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Canvas Toolbar */}
            <div className="h-12 bg-[var(--surface)] border-b border-[var(--border-primary)] flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                {/* Tool Selection */}
                <div className="flex items-center gap-1 bg-[var(--surface-elevated)] rounded-lg p-1">
                  <IconButton
                    icon={<MousePointer className="w-4 h-4" />}
                    variant={currentTool === 'select' ? 'primary' : 'ghost'}
                    size="sm"
                    tooltip="Select Tool (V)"
                    onClick={() => handleToolChange('select')}
                  />
                  <IconButton
                    icon={<Type className="w-4 h-4" />}
                    variant={currentTool === 'text' ? 'primary' : 'ghost'}
                    size="sm"
                    tooltip="Text Tool (T)"
                    onClick={() => handleToolChange('text')}
                  />
                  <IconButton
                    icon={<Square className="w-4 h-4" />}
                    variant={currentTool === 'shape' ? 'primary' : 'ghost'}
                    size="sm"
                    tooltip="Shape Tool (R)"
                    onClick={() => handleToolChange('shape')}
                  />
                  <IconButton
                    icon={<Hand className="w-4 h-4" />}
                    variant={currentTool === 'hand' ? 'primary' : 'ghost'}
                    size="sm"
                    tooltip="Hand Tool (H)"
                    onClick={() => handleToolChange('hand')}
                  />
                </div>

                <div className="w-px h-4 bg-[var(--border-secondary)]"></div>

                {/* Canvas Info */}
                <span className="text-sm font-mono text-[var(--text-secondary)]">
                  {project.width}x{project.height}
                </span>

                <div className="w-px h-4 bg-[var(--border-secondary)]"></div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <IconButton
                    icon={<ZoomOut className="w-4 h-4" />}
                    variant="ghost"
                    size="sm"
                    tooltip="Zoom Out (Ctrl+-)"
                    onClick={() => handleZoomChange(canvasZoom - 25)}
                  />
                  <span className="text-sm font-mono text-[var(--text-secondary)] min-w-[60px] text-center">
                    {canvasZoom}%
                  </span>
                  <IconButton
                    icon={<ZoomIn className="w-4 h-4" />}
                    variant="ghost"
                    size="sm"
                    tooltip="Zoom In (Ctrl++)"
                    onClick={() => handleZoomChange(canvasZoom + 25)}
                  />
                  <IconButton
                    icon={<Maximize2 className="w-4 h-4" />}
                    variant="ghost"
                    size="sm"
                    tooltip="Fit to Screen (Ctrl+0)"
                    onClick={() => handleZoomChange(100)}
                  />
                </div>
              </div>

              {/* Right side toolbar options */}
              <div className="flex items-center gap-2">
                <Button
                  variant={showGrid ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                  leftIcon={<Grid className="w-4 h-4" />}
                >
                  Grid
                </Button>
                <Button
                  variant={showGuides ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setShowGuides(!showGuides)}
                  leftIcon={<Ruler className="w-4 h-4" />}
                >
                  Guides
                </Button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 bg-[var(--background)] overflow-hidden">
              <EditorCanvas
                width={project.width}
                height={project.height}
                showGrid={showGrid}
                gridSize={50}
              />
            </div>
          </div>

          {/* Timeline Area */}
          <div className="h-72 bg-[var(--timeline-bg)] border-t border-[var(--border-primary)]">
            <Timeline />
          </div>
        </div>

        {/* Properties Panel Toggle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
          <IconButton
            icon={propertiesVisible ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            variant="secondary"
            size="sm"
            onClick={() => setPropertiesVisible(!propertiesVisible)}
            tooltip={propertiesVisible ? "Hide Properties" : "Show Properties"}
            className="rounded-l-lg rounded-r-none border-r-0 shadow-lg"
          />
        </div>

        {/* Properties Panel */}
        {propertiesVisible && (
          <div className="z-30 transition-all duration-300 ease-in-out">
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* Render children for additional content */}
      {children}
    </div>
  );
};
