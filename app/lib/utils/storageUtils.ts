/**
 * Storage utility functions for localStorage operations
 */

/**
 * Checks if localStorage is available
 * @returns True if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Saves data to localStorage
 * @param key - The key to store the data under
 * @param value - The value to store (will be JSON stringified)
 * @returns True if save was successful
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Loads data from localStorage
 * @param key - The key to retrieve data from
 * @param defaultValue - Default value if key doesn't exist
 * @returns The retrieved data or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Deletes data from localStorage
 * @param key - The key to delete
 * @returns True if deletion was successful
 */
export function deleteFromStorage(key: string): boolean {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to delete from localStorage:', error);
    return false;
  }
}

/**
 * Clears all data from localStorage
 * @returns True if clear was successful
 */
export function clearStorage(): boolean {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Gets all keys from localStorage
 * @param prefix - Optional prefix to filter keys
 * @returns Array of keys
 */
export function getStorageKeys(prefix?: string): string[] {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return [];
  }

  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Failed to get storage keys:', error);
    return [];
  }
}

/**
 * Gets the size of localStorage in bytes
 * @returns Size in bytes
 */
export function getStorageSize(): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    return size;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
}

/**
 * Serializes a project for storage
 * @param project - The project data to serialize
 * @returns Serialized project string
 */
export function serializeProject(project: any): string {
  try {
    return JSON.stringify(project, null, 2);
  } catch (error) {
    console.error('Failed to serialize project:', error);
    throw error;
  }
}

/**
 * Deserializes a project from storage
 * @param data - The serialized project data
 * @returns Deserialized project object
 */
export function deserializeProject<T>(data: string): T {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Failed to deserialize project:', error);
    throw error;
  }
}

/**
 * Exports project data as a downloadable file
 * @param project - The project data
 * @param filename - The filename for the export
 */
export function exportProject(project: any, filename: string): void {
  try {
    const json = serializeProject(project);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export project:', error);
    throw error;
  }
}

/**
 * Imports project data from a file
 * @param file - The file to import
 * @returns Promise that resolves with the project data
 */
export function importProject<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const data = deserializeProject<T>(e.target.result as string);
          resolve(data);
        } else {
          reject(new Error('Failed to read file'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Saves project with auto-save functionality
 * @param key - Storage key
 * @param project - Project data
 * @param maxAutoSaves - Maximum number of auto-saves to keep
 */
export function autoSaveProject(
  key: string,
  project: any,
  maxAutoSaves: number = 5
): void {
  const autoSaveKey = `${key}_autosave`;
  const timestamp = Date.now();

  // Get existing auto-saves
  const autoSaves = loadFromStorage<Array<{ timestamp: number; data: any }>>(
    autoSaveKey,
    []
  );

  // Add new auto-save
  autoSaves.unshift({ timestamp, data: project });

  // Keep only the latest auto-saves
  if (autoSaves.length > maxAutoSaves) {
    autoSaves.splice(maxAutoSaves);
  }

  saveToStorage(autoSaveKey, autoSaves);
}

/**
 * Retrieves auto-saved projects
 * @param key - Storage key
 * @returns Array of auto-saved projects
 */
export function getAutoSaves<T>(
  key: string
): Array<{ timestamp: number; data: T }> {
  const autoSaveKey = `${key}_autosave`;
  return loadFromStorage<Array<{ timestamp: number; data: T }>>(autoSaveKey, []);
}
