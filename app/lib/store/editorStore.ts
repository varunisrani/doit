import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export type AssetType = 'video' | 'audio' | 'image';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  thumbnail?: string;
  duration?: number; // in seconds, for video/audio
  width?: number; // for video/image
  height?: number; // for video/image
  size: number; // file size in bytes
  createdAt: number; // timestamp
}

export interface ProjectSettings {
  width: number;
  height: number;
  fps: number;
  duration: number;
  backgroundColor: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  author?: string;
}

export type Tool = 'select' | 'text' | 'shape' | 'crop' | 'draw' | 'hand';

export interface CanvasTransform {
  zoom: number;
  panX: number;
  panY: number;
}

interface EditorState {
  // Project settings
  project: ProjectSettings;
  metadata: ProjectMetadata;

  // Canvas state
  currentTool: Tool;
  canvasTransform: CanvasTransform;

  // Assets
  assets: Asset[];

  // UI State
  sidebarVisible: boolean;
  propertiesVisible: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setProjectSettings: (settings: Partial<ProjectSettings>) => void;
  setMetadata: (metadata: Partial<ProjectMetadata>) => void;

  setCurrentTool: (tool: Tool) => void;

  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetCanvasTransform: () => void;

  addAsset: (asset: Asset) => void;
  addAssets: (assets: Asset[]) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  clearAssets: () => void;

  // UI actions
  setSidebarVisible: (visible: boolean) => void;
  setPropertiesVisible: (visible: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Project actions
  resetProject: () => void;
  updateProjectMetadata: () => void;
  loadProjectData: (
    settings: ProjectSettings,
    metadata: ProjectMetadata,
    assets: Asset[]
  ) => void;
}

const defaultProjectSettings: ProjectSettings = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 60, // 60 seconds default
  backgroundColor: '#000000',
};

const defaultMetadata: ProjectMetadata = {
  id: '',
  name: 'Untitled Project',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const defaultCanvasTransform: CanvasTransform = {
  zoom: 1,
  panX: 0,
  panY: 0,
};

export const useEditorStore = create<EditorState>()(
  persist(
    immer((set) => ({
      // Initial state
      project: defaultProjectSettings,
      metadata: defaultMetadata,
      currentTool: 'select',
      canvasTransform: defaultCanvasTransform,
      assets: [],
      sidebarVisible: true,
      propertiesVisible: true,
      hasUnsavedChanges: false,

      // Project settings actions
      setProjectSettings: (settings) =>
        set((state) => {
          state.project = { ...state.project, ...settings };
          state.metadata.updatedAt = Date.now();
          state.hasUnsavedChanges = true;
        }),

      setMetadata: (metadata) =>
        set((state) => {
          state.metadata = { ...state.metadata, ...metadata };
        }),

      // Tool actions
      setCurrentTool: (tool) =>
        set((state) => {
          state.currentTool = tool;
        }),

      // Canvas transform actions
      setZoom: (zoom) =>
        set((state) => {
          state.canvasTransform.zoom = Math.max(0.1, Math.min(5, zoom));
        }),

      setPan: (panX, panY) =>
        set((state) => {
          state.canvasTransform.panX = panX;
          state.canvasTransform.panY = panY;
        }),

      resetCanvasTransform: () =>
        set((state) => {
          state.canvasTransform = { ...defaultCanvasTransform };
        }),

      // Asset actions
      addAsset: (asset) =>
        set((state) => {
          state.assets.push(asset);
          state.metadata.updatedAt = Date.now();
          state.hasUnsavedChanges = true;
        }),

      addAssets: (assets) =>
        set((state) => {
          state.assets.push(...assets);
          state.metadata.updatedAt = Date.now();
          state.hasUnsavedChanges = true;
        }),

      removeAsset: (id) =>
        set((state) => {
          state.assets = state.assets.filter((asset) => asset.id !== id);
          state.metadata.updatedAt = Date.now();
          state.hasUnsavedChanges = true;
        }),

      updateAsset: (id, updates) =>
        set((state) => {
          const assetIndex = state.assets.findIndex((asset) => asset.id === id);
          if (assetIndex !== -1) {
            state.assets[assetIndex] = { ...state.assets[assetIndex], ...updates };
            state.metadata.updatedAt = Date.now();
            state.hasUnsavedChanges = true;
          }
        }),

      clearAssets: () =>
        set((state) => {
          state.assets = [];
          state.metadata.updatedAt = Date.now();
          state.hasUnsavedChanges = true;
        }),

      // UI actions
      setSidebarVisible: (visible) =>
        set((state) => {
          state.sidebarVisible = visible;
        }),

      setPropertiesVisible: (visible) =>
        set((state) => {
          state.propertiesVisible = visible;
        }),

      setHasUnsavedChanges: (hasChanges) =>
        set((state) => {
          state.hasUnsavedChanges = hasChanges;
        }),

      // Project actions
      resetProject: () =>
        set((state) => {
          state.project = { ...defaultProjectSettings };
          state.metadata = {
            ...defaultMetadata,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          state.currentTool = 'select';
          state.canvasTransform = { ...defaultCanvasTransform };
          state.assets = [];
          state.hasUnsavedChanges = false;
        }),

      updateProjectMetadata: () =>
        set((state) => {
          state.metadata.updatedAt = Date.now();
        }),

      loadProjectData: (settings, metadata, assets) =>
        set((state) => {
          state.project = { ...settings };
          state.metadata = { ...metadata };
          state.assets = [...assets];
          state.currentTool = 'select';
          state.canvasTransform = { ...defaultCanvasTransform };
          state.hasUnsavedChanges = false;
        }),
    })),
    {
      name: 'video-editor-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these parts of the state
        project: state.project,
        metadata: state.metadata,
        assets: state.assets,
        sidebarVisible: state.sidebarVisible,
        propertiesVisible: state.propertiesVisible,
      }),
    }
  )
);
