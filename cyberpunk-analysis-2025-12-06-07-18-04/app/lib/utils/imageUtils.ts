/**
 * Image utility functions for handling image operations
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Loads an image from a URL
 * @param url - The URL of the image
 * @returns Promise that resolves with the loaded image
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
    img.src = url;
  });
}

/**
 * Gets the dimensions of an image
 * @param image - The image element or URL
 * @returns Promise that resolves with the image dimensions
 */
export async function getImageDimensions(
  image: HTMLImageElement | string
): Promise<ImageDimensions> {
  let img: HTMLImageElement;

  if (typeof image === 'string') {
    img = await loadImage(image);
  } else {
    img = image;
  }

  return {
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
  };
}

/**
 * Creates a thumbnail from an image
 * @param image - The source image
 * @param maxWidth - Maximum width of the thumbnail
 * @param maxHeight - Maximum height of the thumbnail
 * @returns Data URL of the thumbnail
 */
export async function createThumbnail(
  image: HTMLImageElement | string,
  maxWidth: number = 150,
  maxHeight: number = 150
): Promise<string> {
  let img: HTMLImageElement;

  if (typeof image === 'string') {
    img = await loadImage(image);
  } else {
    img = image;
  }

  const dimensions = await getImageDimensions(img);
  const scale = Math.min(
    maxWidth / dimensions.width,
    maxHeight / dimensions.height,
    1
  );

  const width = dimensions.width * scale;
  const height = dimensions.height * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Resizes an image to the specified dimensions
 * @param image - The source image
 * @param width - Target width
 * @param height - Target height
 * @param maintainAspectRatio - Whether to maintain aspect ratio
 * @returns Data URL of the resized image
 */
export async function resizeImage(
  image: HTMLImageElement | string,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<string> {
  let img: HTMLImageElement;

  if (typeof image === 'string') {
    img = await loadImage(image);
  } else {
    img = image;
  }

  const dimensions = await getImageDimensions(img);
  let targetWidth = width;
  let targetHeight = height;

  if (maintainAspectRatio) {
    const scale = Math.min(width / dimensions.width, height / dimensions.height);
    targetWidth = dimensions.width * scale;
    targetHeight = dimensions.height * scale;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/png');
}

/**
 * Crops an image to the specified area
 * @param image - The source image
 * @param x - X coordinate of crop area
 * @param y - Y coordinate of crop area
 * @param width - Width of crop area
 * @param height - Height of crop area
 * @returns Data URL of the cropped image
 */
export async function cropImage(
  image: HTMLImageElement | string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<string> {
  let img: HTMLImageElement;

  if (typeof image === 'string') {
    img = await loadImage(image);
  } else {
    img = image;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

/**
 * Converts an image to a specific format
 * @param image - The source image
 * @param format - Target format (image/png, image/jpeg, image/webp)
 * @param quality - Quality for lossy formats (0-1)
 * @returns Data URL in the specified format
 */
export async function convertImageFormat(
  image: HTMLImageElement | string,
  format: string = 'image/png',
  quality: number = 0.92
): Promise<string> {
  let img: HTMLImageElement;

  if (typeof image === 'string') {
    img = await loadImage(image);
  } else {
    img = image;
  }

  const dimensions = await getImageDimensions(img);
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL(format, quality);
}

/**
 * Gets the average color of an image
 * @param image - The source image
 * @returns RGB color object
 */
export async function getAverageColor(
  image: HTMLImageElement | string
): Promise<{ r: number; g: number; b: number }> {
  let img: HTMLImageElement;

  if (typeof image === 'string') {
    img = await loadImage(image);
  } else {
    img = image;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(img, 0, 0, 1, 1);

  const imageData = ctx.getImageData(0, 0, 1, 1);
  return {
    r: imageData.data[0],
    g: imageData.data[1],
    b: imageData.data[2],
  };
}
