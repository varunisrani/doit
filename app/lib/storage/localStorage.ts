/**
 * localStorage Utilities for Video Editor
 * Handles project persistence, user preferences, and auto-save functionality
 */

// Storage keys
export const STORAGE_KEYS = {
  PROJECTS_INDEX: 'video-editor-projects',
  PROJECT_PREFIX: 'video-editor-project-',
  PREFERENCES: 'video-editor-preferences',
} as const;

// Types
export interface ProjectIndex {
  [projectId: string]: {
    name: string;
    createdAt: number;
    updatedAt: number;
    thumbnail?: string;
  };
}

export interface ProjectData {
  id: string;
  settings: {
    width: number;
    height: number;
    fps: number;
    duration: number;
    backgroundColor: string;
  };
  metadata: {
    name: string;
    author?: string;
    createdAt: number;
    updatedAt: number;
  };
  tracks: any[];
  elements: any[];
  assets: any[];
}

export interface UserPreferences {
  sidebarVisible: boolean;
  propertiesVisible: boolean;
  lastProjectId: string | null;
  recentProjects: string[];
  theme: 'light' | 'dark' | 'system';
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in seconds
  snapToGrid: boolean;
  showGrid: boolean;
  gridSize: number;
}

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  sidebarVisible: true,
  propertiesVisible: true,
  lastProjectId: null,
  recentProjects: [],
  theme: 'dark',
  autoSaveEnabled: true,
  autoSaveInterval: 30,
  snapToGrid: true,
  showGrid: true,
  gridSize: 50,
};

// Helper to check if localStorage is available
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Safe localStorage operations
function safeGetItem(key: string): string | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item from localStorage: ${key}`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set item in localStorage: ${key}`, error);
    // Handle quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old projects.');
    }
    return false;
  }
}

function safeRemoveItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from localStorage: ${key}`, error);
    return false;
  }
}

// Project Index Management
export function getProjectsIndex(): ProjectIndex {
  const data = safeGetItem(STORAGE_KEYS.PROJECTS_INDEX);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveProjectsIndex(index: ProjectIndex): boolean {
  return safeSetItem(STORAGE_KEYS.PROJECTS_INDEX, JSON.stringify(index));
}

// Project Operations
export function saveProject(project: ProjectData): boolean {
  const projectKey = STORAGE_KEYS.PROJECT_PREFIX + project.id;

  // Filter out large base64 assets (over 500KB)
  const filteredAssets = project.assets.filter((asset: any) => {
    if (asset.url && asset.url.startsWith('data:')) {
      const sizeInBytes = (asset.url.length * 3) / 4; // Approximate base64 size
      if (sizeInBytes > 500 * 1024) {
        console.warn(`Skipping large asset "${asset.name}" (${Math.round(sizeInBytes / 1024)}KB)`);
        return false;
      }
    }
    return true;
  });

  const projectToSave = {
    ...project,
    assets: filteredAssets,
    metadata: {
      ...project.metadata,
      updatedAt: Date.now(),
    },
  };

  // Save project data
  const success = safeSetItem(projectKey, JSON.stringify(projectToSave));

  if (success) {
    // Update projects index
    const index = getProjectsIndex();
    index[project.id] = {
      name: project.metadata.name,
      createdAt: project.metadata.createdAt,
      updatedAt: Date.now(),
    };
    saveProjectsIndex(index);

    // Update recent projects in preferences
    addToRecentProjects(project.id);
  }

  return success;
}

export function loadProject(projectId: string): ProjectData | null {
  const projectKey = STORAGE_KEYS.PROJECT_PREFIX + projectId;
  const data = safeGetItem(projectKey);

  if (!data) return null;

  try {
    const project = JSON.parse(data) as ProjectData;

    // Update last opened project
    const preferences = getUserPreferences();
    preferences.lastProjectId = projectId;
    saveUserPreferences(preferences);

    return project;
  } catch (error) {
    console.error(`Failed to parse project: ${projectId}`, error);
    return null;
  }
}

export function deleteProject(projectId: string): boolean {
  const projectKey = STORAGE_KEYS.PROJECT_PREFIX + projectId;

  // Remove project data
  const success = safeRemoveItem(projectKey);

  if (success) {
    // Update projects index
    const index = getProjectsIndex();
    delete index[projectId];
    saveProjectsIndex(index);

    // Remove from recent projects
    const preferences = getUserPreferences();
    preferences.recentProjects = preferences.recentProjects.filter(id => id !== projectId);
    if (preferences.lastProjectId === projectId) {
      preferences.lastProjectId = null;
    }
    saveUserPreferences(preferences);
  }

  return success;
}

export function listProjects(): Array<{
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
}> {
  const index = getProjectsIndex();
  return Object.entries(index)
    .map(([id, data]) => ({
      id,
      ...data,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function projectExists(projectId: string): boolean {
  const index = getProjectsIndex();
  return projectId in index;
}

// User Preferences
export function getUserPreferences(): UserPreferences {
  const data = safeGetItem(STORAGE_KEYS.PREFERENCES);
  if (!data) return { ...DEFAULT_PREFERENCES };

  try {
    const preferences = JSON.parse(data);
    // Merge with defaults to handle new preference fields
    return { ...DEFAULT_PREFERENCES, ...preferences };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): boolean {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = { ...currentPreferences, ...preferences };
  return safeSetItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPreferences));
}

// Recent Projects Management
function addToRecentProjects(projectId: string): void {
  const preferences = getUserPreferences();
  const recentProjects = preferences.recentProjects.filter(id => id !== projectId);
  recentProjects.unshift(projectId);

  // Keep only the 10 most recent projects
  preferences.recentProjects = recentProjects.slice(0, 10);
  saveUserPreferences(preferences);
}

export function getRecentProjects(): Array<{
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}> {
  const preferences = getUserPreferences();
  const index = getProjectsIndex();

  return preferences.recentProjects
    .filter(id => id in index)
    .map(id => ({
      id,
      ...index[id],
    }));
}

// Auto-save with debounce
let autoSaveTimeout: NodeJS.Timeout | null = null;

export function scheduleAutoSave(
  getProjectData: () => ProjectData,
  delayMs: number = 2000
): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    const projectData = getProjectData();
    if (projectData.id) {
      const success = saveProject(projectData);
      if (success) {
        console.log('Auto-saved project:', projectData.metadata.name);
      }
    }
    autoSaveTimeout = null;
  }, delayMs);
}

export function cancelAutoSave(): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
}

// Export/Import for backup
export function exportProjectToFile(projectId: string): string | null {
  const project = loadProject(projectId);
  if (!project) return null;

  return JSON.stringify(project, null, 2);
}

export function importProjectFromJSON(jsonString: string): ProjectData | null {
  try {
    const project = JSON.parse(jsonString) as ProjectData;

    // Generate new ID to avoid conflicts
    project.id = crypto.randomUUID();
    project.metadata.createdAt = Date.now();
    project.metadata.updatedAt = Date.now();
    project.metadata.name = `${project.metadata.name} (Imported)`;

    return project;
  } catch (error) {
    console.error('Failed to parse project JSON:', error);
    return null;
  }
}

// Storage stats
export function getStorageStats(): {
  used: number;
  available: number;
  projectCount: number;
} {
  if (!isLocalStorageAvailable()) {
    return { used: 0, available: 0, projectCount: 0 };
  }

  let used = 0;
  const projectCount = Object.keys(getProjectsIndex()).length;

  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        const value = window.localStorage.getItem(key);
        if (value) {
          used += (key.length + value.length) * 2; // UTF-16 characters = 2 bytes
        }
      }
    }
  } catch (error) {
    console.error('Failed to calculate storage stats:', error);
  }

  // Typical localStorage limit is 5-10MB
  const estimatedLimit = 5 * 1024 * 1024;

  return {
    used,
    available: Math.max(0, estimatedLimit - used),
    projectCount,
  };
}

// Clear all video editor data
export function clearAllData(): boolean {
  if (!isLocalStorageAvailable()) return false;

  const keysToRemove: string[] = [];

  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (
        key === STORAGE_KEYS.PROJECTS_INDEX ||
        key === STORAGE_KEYS.PREFERENCES ||
        key.startsWith(STORAGE_KEYS.PROJECT_PREFIX)
      )) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => window.localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Failed to clear all data:', error);
    return false;
  }
}
