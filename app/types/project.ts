// Project and Asset Types

import type { ProjectSettings } from './editor';
import type { Timeline } from './timeline';
import type { CanvasElement } from './elements';

export type AssetType =
  | 'image'
  | 'video'
  | 'audio'
  | 'font'
  | 'lut'
  | 'other';

export interface Project {
  id: string;
  name: string;
  description?: string;
  settings: ProjectSettings;
  timeline: Timeline;
  assets: Asset[];
  canvasElements: CanvasElement[];
  createdAt: number;       // Unix timestamp
  updatedAt: number;       // Unix timestamp
  version: string;         // Project version for compatibility
  thumbnail?: string;      // Project thumbnail data URL
  tags?: string[];
  metadata?: ProjectMetadata;
}

export interface ProjectMetadata {
  author?: string;
  company?: string;
  copyright?: string;
  notes?: string;
  customFields?: Record<string, any>;
}

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  url: string;             // Data URL or Blob URL
  file?: File;             // Original file object
  fileSize: number;        // Size in bytes
  mimeType: string;
  thumbnail?: string;      // Thumbnail data URL
  duration?: number;       // For video/audio assets in ms
  width?: number;          // For image/video assets
  height?: number;         // For image/video assets
  fps?: number;            // For video assets
  sampleRate?: number;     // For audio assets
  channels?: number;       // For audio assets (1 = mono, 2 = stereo)
  bitrate?: number;        // For video/audio assets
  createdAt: number;
  metadata?: AssetMetadata;
  tags?: string[];
  usageCount?: number;     // Number of times used in project
}

export interface AssetMetadata {
  originalName: string;
  lastModified: number;
  exif?: Record<string, any>; // EXIF data for images
  codec?: string;          // Video/audio codec
  colorSpace?: string;     // Color space info
  aspectRatio?: string;
  customFields?: Record<string, any>;
}

export interface AssetLibrary {
  assets: Asset[];
  folders: AssetFolder[];
  selectedAssetIds: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'type' | 'size';
  sortOrder: 'asc' | 'desc';
  filterType: AssetType | 'all';
  searchQuery: string;
}

export interface AssetFolder {
  id: string;
  name: string;
  parentId: string | null;
  assetIds: string[];
  color?: string;
  collapsed: boolean;
  createdAt: number;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'social' | 'youtube' | 'presentation' | 'custom';
  settings: ProjectSettings;
  presetElements?: CanvasElement[];
  presetTracks?: number;   // Number of default tracks
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  format: 'mp4' | 'webm' | 'gif';
  settings: {
    resolution: string;
    fps: number;
    quality: 'low' | 'medium' | 'high' | 'ultra';
    codec?: string;
    bitrate?: number;
    audioEnabled: boolean;
    audioBitrate?: number;
    audioSampleRate?: number;
  };
  category: 'web' | 'social' | 'broadcast' | 'custom';
}

// Project Serialization
export interface ProjectJSON {
  version: string;
  project: Project;
  exportDate: number;
  metadata: {
    appVersion: string;
    platform: string;
  };
}

// Auto-save
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number;        // Auto-save interval in ms
  maxVersions: number;     // Number of auto-save versions to keep
}

export interface SavedVersion {
  id: string;
  projectId: string;
  timestamp: number;
  data: ProjectJSON;
  isAutoSave: boolean;
  label?: string;
}

// Collaboration (for future enhancement)
export interface CollaborationState {
  enabled: boolean;
  sessionId?: string;
  users: CollaborationUser[];
  permissions: CollaborationPermissions;
}

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  selection?: string[];
  isActive: boolean;
}

export interface CollaborationPermissions {
  canEdit: boolean;
  canComment: boolean;
  canExport: boolean;
  canInvite: boolean;
}

// Import/Export Formats
export type ImportFormat =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/gif'
  | 'video/mp4'
  | 'video/webm'
  | 'audio/mp3'
  | 'audio/wav'
  | 'audio/ogg'
  | 'application/json'; // Project file

export type ExportFormat =
  | 'video/mp4'
  | 'video/webm'
  | 'image/gif'
  | 'application/json'; // Project file

// Cloud Storage (for future enhancement)
export interface CloudStorageConfig {
  provider: 'local' | 'cloud';
  autoSync: boolean;
  syncInterval: number;
  lastSyncTime?: number;
}

export interface CloudProject {
  id: string;
  localId: string;
  cloudId: string;
  lastSynced: number;
  isDirty: boolean;       // Has local changes
  conflictState?: 'none' | 'local-newer' | 'cloud-newer' | 'conflict';
}
