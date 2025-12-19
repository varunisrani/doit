/**
 * Serialization utilities for Video Editor
 * Handles converting store data to/from storage format
 */

import type { ProjectSettings, ProjectMetadata, Asset } from '../store/editorStore';
import type { Track, Clip } from '../store/timelineStore';
import type { CanvasElement } from '@/app/types/elements';
import type { ProjectData } from './localStorage';

/**
 * Serialize the current editor state to a ProjectData object
 */
export function serializeProjectData(
  settings: ProjectSettings,
  metadata: ProjectMetadata,
  tracks: Track[],
  elements: CanvasElement[],
  assets: Asset[]
): ProjectData {
  return {
    id: metadata.id || crypto.randomUUID(),
    settings: {
      width: settings.width,
      height: settings.height,
      fps: settings.fps,
      duration: settings.duration,
      backgroundColor: settings.backgroundColor,
    },
    metadata: {
      name: metadata.name,
      author: metadata.author,
      createdAt: metadata.createdAt,
      updatedAt: Date.now(),
    },
    tracks: serializeTracks(tracks),
    elements: serializeElements(elements),
    assets: serializeAssets(assets),
  };
}

/**
 * Deserialize ProjectData back to store-compatible format
 */
export function deserializeProjectData(projectData: ProjectData): {
  settings: ProjectSettings;
  metadata: ProjectMetadata;
  tracks: Track[];
  elements: CanvasElement[];
  assets: Asset[];
} {
  return {
    settings: {
      width: projectData.settings.width,
      height: projectData.settings.height,
      fps: projectData.settings.fps,
      duration: projectData.settings.duration,
      backgroundColor: projectData.settings.backgroundColor,
    },
    metadata: {
      id: projectData.id,
      name: projectData.metadata.name,
      author: projectData.metadata.author,
      createdAt: projectData.metadata.createdAt,
      updatedAt: projectData.metadata.updatedAt,
    },
    tracks: deserializeTracks(projectData.tracks),
    elements: deserializeElements(projectData.elements),
    assets: deserializeAssets(projectData.assets),
  };
}

/**
 * Serialize tracks for storage
 */
function serializeTracks(tracks: Track[]): any[] {
  return tracks.map(track => ({
    id: track.id,
    name: track.name,
    type: track.type,
    clips: track.clips.map(clip => serializeClip(clip)),
    locked: track.locked,
    muted: track.muted,
    solo: track.solo,
    visible: track.visible,
    height: track.height,
    order: track.order,
  }));
}

/**
 * Deserialize tracks from storage
 */
function deserializeTracks(data: any[]): Track[] {
  if (!Array.isArray(data)) return [];

  return data.map(track => ({
    id: track.id || crypto.randomUUID(),
    name: track.name || 'Untitled Track',
    type: track.type || 'video',
    clips: Array.isArray(track.clips) ? track.clips.map(deserializeClip) : [],
    locked: track.locked ?? false,
    muted: track.muted ?? false,
    solo: track.solo ?? false,
    visible: track.visible ?? true,
    height: track.height ?? 60,
    order: track.order ?? 0,
  }));
}

/**
 * Serialize a single clip
 */
function serializeClip(clip: Clip): any {
  return {
    id: clip.id,
    trackId: clip.trackId,
    assetId: clip.assetId,
    type: clip.type,
    name: clip.name,
    startTime: clip.startTime,
    duration: clip.duration,
    trimStart: clip.trimStart,
    trimEnd: clip.trimEnd,
    volume: clip.volume,
    opacity: clip.opacity,
    position: clip.position,
    scale: clip.scale,
    rotation: clip.rotation,
    text: clip.text,
    textStyle: clip.textStyle,
    effects: clip.effects,
    locked: clip.locked,
    muted: clip.muted,
  };
}

/**
 * Deserialize a single clip
 */
function deserializeClip(data: any): Clip {
  return {
    id: data.id || crypto.randomUUID(),
    trackId: data.trackId || '',
    assetId: data.assetId,
    type: data.type || 'video',
    name: data.name || 'Untitled Clip',
    startTime: data.startTime ?? 0,
    duration: data.duration ?? 5,
    trimStart: data.trimStart,
    trimEnd: data.trimEnd,
    volume: data.volume,
    opacity: data.opacity,
    position: data.position,
    scale: data.scale,
    rotation: data.rotation,
    text: data.text,
    textStyle: data.textStyle,
    effects: data.effects,
    locked: data.locked ?? false,
    muted: data.muted ?? false,
  };
}

/**
 * Serialize canvas elements for storage
 */
function serializeElements(elements: CanvasElement[]): any[] {
  return elements.map(element => ({
    id: element.id,
    type: element.type,
    name: element.name,
    transform: { ...element.transform },
    style: { ...element.style },
    filters: element.filters ? [...element.filters] : [],
    locked: element.locked,
    visible: element.visible,
    clipPath: element.clipPath,
    // Type-specific properties
    ...getTypeSpecificProps(element),
  }));
}

/**
 * Get type-specific properties for serialization
 */
function getTypeSpecificProps(element: any): any {
  switch (element.type) {
    case 'image':
      return {
        src: element.src,
        assetId: element.assetId,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        crop: element.crop,
      };
    case 'text':
      return {
        content: element.content,
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textDecoration: element.textDecoration,
        color: element.color,
        textAlign: element.textAlign,
        verticalAlign: element.verticalAlign,
        lineHeight: element.lineHeight,
        letterSpacing: element.letterSpacing,
        wordSpacing: element.wordSpacing,
        textTransform: element.textTransform,
        textShadow: element.textShadow,
        textStroke: element.textStroke,
        backgroundColor: element.backgroundColor,
        padding: element.padding,
        maxWidth: element.maxWidth,
        maxHeight: element.maxHeight,
        autoSize: element.autoSize,
      };
    case 'shape':
      return {
        shapeType: element.shapeType,
        fillColor: element.fillColor,
        strokeColor: element.strokeColor,
        strokeWidth: element.strokeWidth,
        strokeDashArray: element.strokeDashArray,
        points: element.points,
        radius: element.radius,
        radiusX: element.radiusX,
        radiusY: element.radiusY,
        sides: element.sides,
        innerRadius: element.innerRadius,
        cornerRadius: element.cornerRadius,
      };
    case 'video':
      return {
        src: element.src,
        assetId: element.assetId,
        currentTime: element.currentTime,
        duration: element.duration,
        playbackRate: element.playbackRate,
        volume: element.volume,
        muted: element.muted,
      };
    default:
      return {};
  }
}

/**
 * Deserialize canvas elements from storage
 */
function deserializeElements(data: any[]): CanvasElement[] {
  if (!Array.isArray(data)) return [];

  return data.map(element => {
    const baseElement = {
      id: element.id || crypto.randomUUID(),
      type: element.type || 'shape',
      name: element.name || 'Untitled Element',
      transform: deserializeTransform(element.transform),
      style: deserializeStyle(element.style),
      filters: element.filters || [],
      locked: element.locked ?? false,
      visible: element.visible ?? true,
      clipPath: element.clipPath,
    };

    // Add type-specific properties
    switch (element.type) {
      case 'image':
        return {
          ...baseElement,
          src: element.src || '',
          assetId: element.assetId,
          naturalWidth: element.naturalWidth || 100,
          naturalHeight: element.naturalHeight || 100,
          crop: element.crop,
        };
      case 'text':
        return {
          ...baseElement,
          content: element.content || 'Text',
          fontFamily: element.fontFamily || 'Arial',
          fontSize: element.fontSize ?? 24,
          fontWeight: element.fontWeight ?? 400,
          fontStyle: element.fontStyle || 'normal',
          textDecoration: element.textDecoration || 'none',
          color: element.color || '#ffffff',
          textAlign: element.textAlign || 'left',
          verticalAlign: element.verticalAlign || 'top',
          lineHeight: element.lineHeight ?? 1.2,
          letterSpacing: element.letterSpacing ?? 0,
          wordSpacing: element.wordSpacing ?? 0,
          textTransform: element.textTransform,
          textShadow: element.textShadow,
          textStroke: element.textStroke,
          backgroundColor: element.backgroundColor,
          padding: element.padding,
          maxWidth: element.maxWidth,
          maxHeight: element.maxHeight,
          autoSize: element.autoSize ?? true,
        };
      case 'shape':
        return {
          ...baseElement,
          shapeType: element.shapeType || 'rectangle',
          fillColor: element.fillColor || '#3b82f6',
          strokeColor: element.strokeColor,
          strokeWidth: element.strokeWidth,
          strokeDashArray: element.strokeDashArray,
          points: element.points,
          radius: element.radius,
          radiusX: element.radiusX,
          radiusY: element.radiusY,
          sides: element.sides,
          innerRadius: element.innerRadius,
          cornerRadius: element.cornerRadius,
        };
      case 'video':
        return {
          ...baseElement,
          src: element.src || '',
          assetId: element.assetId,
          currentTime: element.currentTime ?? 0,
          duration: element.duration ?? 0,
          playbackRate: element.playbackRate ?? 1,
          volume: element.volume ?? 1,
          muted: element.muted ?? false,
        };
      default:
        return baseElement as CanvasElement;
    }
  });
}

/**
 * Deserialize transform data
 */
function deserializeTransform(data: any) {
  return {
    x: data?.x ?? 0,
    y: data?.y ?? 0,
    width: data?.width ?? 100,
    height: data?.height ?? 100,
    rotation: data?.rotation ?? 0,
    scaleX: data?.scaleX ?? 1,
    scaleY: data?.scaleY ?? 1,
    anchorX: data?.anchorX ?? 0.5,
    anchorY: data?.anchorY ?? 0.5,
    flipX: data?.flipX ?? false,
    flipY: data?.flipY ?? false,
    skewX: data?.skewX,
    skewY: data?.skewY,
  };
}

/**
 * Deserialize style data
 */
function deserializeStyle(data: any) {
  return {
    opacity: data?.opacity ?? 1,
    blendMode: data?.blendMode || 'normal',
    zIndex: data?.zIndex ?? 0,
    borderRadius: data?.borderRadius,
    borderWidth: data?.borderWidth,
    borderColor: data?.borderColor,
    borderStyle: data?.borderStyle,
    shadow: data?.shadow,
    mask: data?.mask,
  };
}

/**
 * Serialize assets for storage
 */
function serializeAssets(assets: Asset[]): any[] {
  return assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    url: asset.url,
    thumbnail: asset.thumbnail,
    duration: asset.duration,
    width: asset.width,
    height: asset.height,
    size: asset.size,
    createdAt: asset.createdAt,
  }));
}

/**
 * Deserialize assets from storage
 */
function deserializeAssets(data: any[]): Asset[] {
  if (!Array.isArray(data)) return [];

  return data.map(asset => ({
    id: asset.id || crypto.randomUUID(),
    name: asset.name || 'Untitled Asset',
    type: asset.type || 'image',
    url: asset.url || '',
    thumbnail: asset.thumbnail,
    duration: asset.duration,
    width: asset.width,
    height: asset.height,
    size: asset.size ?? 0,
    createdAt: asset.createdAt ?? Date.now(),
  }));
}

/**
 * Create a new empty project
 */
export function createNewProject(name: string = 'Untitled Project'): ProjectData {
  const id = crypto.randomUUID();
  const now = Date.now();

  return {
    id,
    settings: {
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 60,
      backgroundColor: '#000000',
    },
    metadata: {
      name,
      createdAt: now,
      updatedAt: now,
    },
    tracks: [],
    elements: [],
    assets: [],
  };
}

/**
 * Deep clone a project for duplication
 */
export function duplicateProject(project: ProjectData, newName?: string): ProjectData {
  const now = Date.now();
  const newId = crypto.randomUUID();

  // Deep clone
  const cloned = JSON.parse(JSON.stringify(project));

  // Generate new IDs for all items
  cloned.id = newId;
  cloned.metadata.name = newName || `${project.metadata.name} (Copy)`;
  cloned.metadata.createdAt = now;
  cloned.metadata.updatedAt = now;

  // Generate new IDs for tracks and clips
  const trackIdMap = new Map<string, string>();
  cloned.tracks = cloned.tracks.map((track: any) => {
    const newTrackId = crypto.randomUUID();
    trackIdMap.set(track.id, newTrackId);
    return {
      ...track,
      id: newTrackId,
      clips: track.clips.map((clip: any) => ({
        ...clip,
        id: crypto.randomUUID(),
        trackId: newTrackId,
      })),
    };
  });

  // Generate new IDs for elements
  cloned.elements = cloned.elements.map((element: any) => ({
    ...element,
    id: crypto.randomUUID(),
  }));

  // Generate new IDs for assets
  const assetIdMap = new Map<string, string>();
  cloned.assets = cloned.assets.map((asset: any) => {
    const newAssetId = crypto.randomUUID();
    assetIdMap.set(asset.id, newAssetId);
    return {
      ...asset,
      id: newAssetId,
    };
  });

  // Update asset references in elements
  cloned.elements = cloned.elements.map((element: any) => {
    if (element.assetId && assetIdMap.has(element.assetId)) {
      return { ...element, assetId: assetIdMap.get(element.assetId) };
    }
    return element;
  });

  // Update asset references in clips
  cloned.tracks = cloned.tracks.map((track: any) => ({
    ...track,
    clips: track.clips.map((clip: any) => {
      if (clip.assetId && assetIdMap.has(clip.assetId)) {
        return { ...clip, assetId: assetIdMap.get(clip.assetId) };
      }
      return clip;
    }),
  }));

  return cloned;
}
