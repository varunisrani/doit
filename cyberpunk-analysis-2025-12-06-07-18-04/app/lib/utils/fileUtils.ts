/**
 * File utility functions for handling file operations
 */

/**
 * Reads a file as a data URL
 * @param file - The file to read
 * @returns Promise that resolves with the data URL
 */
export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a file as an array buffer
 * @param file - The file to read
 * @returns Promise that resolves with the array buffer
 */
export function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Validates if a file is of the expected type
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types or extensions
 * @returns True if file type is valid
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  const fileExtension = getFileExtension(file.name);
  return allowedTypes.some(
    (type) =>
      file.type === type ||
      type === fileExtension ||
      type === `.${fileExtension}`
  );
}

/**
 * Gets the file extension from a filename
 * @param filename - The filename to parse
 * @returns The file extension (without dot)
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Creates a Blob from data
 * @param data - The data to convert to blob
 * @param type - The MIME type of the blob
 * @returns The created blob
 */
export function createBlob(data: BlobPart, type: string): Blob {
  return new Blob([data], { type });
}

/**
 * Downloads a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename for the download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats file size in bytes to human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Checks if file type is video
 * @param file - The file to check
 * @returns True if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Checks if file type is audio
 * @param file - The file to check
 * @returns True if file is audio
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Checks if file type is image
 * @param file - The file to check
 * @returns True if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
