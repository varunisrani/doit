/**
 * Canvas rendering engine utilities
 */

import {
  CanvasElement,
  ImageElement,
  TextElement,
  ShapeElement,
  VideoElement,
} from './elements';
import { getResizeHandlePositions, getElementCenter } from './transforms';
import { HANDLE_SIZE } from './hitTest';

/**
 * Renders an element on the canvas
 * @param ctx - Canvas rendering context
 * @param element - Element to render
 * @param images - Map of loaded images
 * @param videos - Map of loaded videos
 */
export function renderElement(
  ctx: CanvasRenderingContext2D,
  element: CanvasElement,
  images: Map<string, HTMLImageElement> = new Map(),
  videos: Map<string, HTMLVideoElement> = new Map()
): void {
  if (!element.visible) return;

  ctx.save();

  // Apply global opacity
  ctx.globalAlpha = element.opacity;

  // Apply rotation
  if (element.rotation !== 0) {
    const center = getElementCenter(element);
    ctx.translate(center.x, center.y);
    ctx.rotate(element.rotation);
    ctx.translate(-center.x, -center.y);
  }

  // Render based on element type
  switch (element.type) {
    case 'image':
      renderImage(ctx, element, images);
      break;
    case 'text':
      renderText(ctx, element);
      break;
    case 'shape':
      renderShape(ctx, element);
      break;
    case 'video':
      renderVideo(ctx, element, videos);
      break;
  }

  ctx.restore();
}

/**
 * Renders an image element
 * @param ctx - Canvas context
 * @param element - Image element
 * @param images - Map of loaded images
 */
function renderImage(
  ctx: CanvasRenderingContext2D,
  element: ImageElement,
  images: Map<string, HTMLImageElement>
): void {
  const img = images.get(element.src);
  if (!img || !img.complete) return;

  // Apply filters if any
  if (element.filters) {
    applyFilters(ctx, element.filters);
  }

  ctx.drawImage(img, element.x, element.y, element.width, element.height);
}

/**
 * Renders a text element
 * @param ctx - Canvas context
 * @param element - Text element
 */
function renderText(ctx: CanvasRenderingContext2D, element: TextElement): void {
  // Set text properties
  ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
  ctx.fillStyle = element.color;
  ctx.textAlign = element.textAlign;
  ctx.textBaseline = 'top';

  // Apply background if specified
  if (element.backgroundColor) {
    const padding = element.padding || 0;
    ctx.fillStyle = element.backgroundColor;
    ctx.fillRect(
      element.x - padding,
      element.y - padding,
      element.width + padding * 2,
      element.height + padding * 2
    );
    ctx.fillStyle = element.color;
  }

  // Calculate text position based on alignment
  let textX = element.x;
  if (element.textAlign === 'center') {
    textX = element.x + element.width / 2;
  } else if (element.textAlign === 'right') {
    textX = element.x + element.width;
  }

  // Split text into lines and render
  const lines = element.text.split('\n');
  const lineHeight = element.fontSize * element.lineHeight;

  lines.forEach((line, index) => {
    const y = element.y + index * lineHeight;

    // Apply letter spacing if needed
    if (element.letterSpacing !== 0) {
      renderTextWithLetterSpacing(ctx, line, textX, y, element.letterSpacing);
    } else {
      ctx.fillText(line, textX, y);
    }
  });
}

/**
 * Renders text with custom letter spacing
 * @param ctx - Canvas context
 * @param text - Text to render
 * @param x - X position
 * @param y - Y position
 * @param letterSpacing - Letter spacing in pixels
 */
function renderTextWithLetterSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number
): void {
  let currentX = x;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + letterSpacing;
  }
}

/**
 * Renders a shape element
 * @param ctx - Canvas context
 * @param element - Shape element
 */
function renderShape(
  ctx: CanvasRenderingContext2D,
  element: ShapeElement
): void {
  ctx.fillStyle = element.fillColor;
  if (element.strokeColor) {
    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth || 1;
  }

  ctx.beginPath();

  switch (element.shape) {
    case 'rectangle':
      if (element.cornerRadius && element.cornerRadius > 0) {
        renderRoundedRect(
          ctx,
          element.x,
          element.y,
          element.width,
          element.height,
          element.cornerRadius
        );
      } else {
        ctx.rect(element.x, element.y, element.width, element.height);
      }
      break;

    case 'circle': {
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const radius = Math.min(element.width, element.height) / 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      break;
    }

    case 'triangle': {
      const centerX = element.x + element.width / 2;
      ctx.moveTo(centerX, element.y);
      ctx.lineTo(element.x + element.width, element.y + element.height);
      ctx.lineTo(element.x, element.y + element.height);
      ctx.closePath();
      break;
    }

    case 'line': {
      ctx.moveTo(element.x, element.y);
      ctx.lineTo(element.x + element.width, element.y + element.height);
      break;
    }
  }

  ctx.fill();
  if (element.strokeColor) {
    ctx.stroke();
  }
}

/**
 * Renders a rounded rectangle path
 * @param ctx - Canvas context
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @param radius - Corner radius
 */
function renderRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders a video element
 * @param ctx - Canvas context
 * @param element - Video element
 * @param videos - Map of loaded videos
 */
function renderVideo(
  ctx: CanvasRenderingContext2D,
  element: VideoElement,
  videos: Map<string, HTMLVideoElement>
): void {
  const video = videos.get(element.src);
  if (!video || video.readyState < 2) return;

  ctx.drawImage(video, element.x, element.y, element.width, element.height);
}

/**
 * Renders selection handles for an element
 * @param ctx - Canvas context
 * @param element - Selected element
 * @param color - Handle color
 */
export function renderSelectionHandles(
  ctx: CanvasRenderingContext2D,
  element: CanvasElement,
  color: string = '#3b82f6'
): void {
  ctx.save();

  const handles = getResizeHandlePositions(element);

  // Draw bounding box
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  ctx.beginPath();
  const center = getElementCenter(element);
  ctx.translate(center.x, center.y);
  ctx.rotate(element.rotation);
  ctx.translate(-center.x, -center.y);
  ctx.rect(element.x, element.y, element.width, element.height);
  ctx.stroke();

  ctx.restore();
  ctx.save();

  // Draw resize handles
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);

  const handleTypes: Array<keyof typeof handles> = [
    'topLeft',
    'topCenter',
    'topRight',
    'middleLeft',
    'middleRight',
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
  ];

  handleTypes.forEach((handleType) => {
    const handle = handles[handleType];
    ctx.fillRect(
      handle.x - HANDLE_SIZE / 2,
      handle.y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE
    );
    ctx.strokeRect(
      handle.x - HANDLE_SIZE / 2,
      handle.y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE
    );
  });

  // Draw rotation handle
  const rotationHandle = handles.rotation;
  ctx.beginPath();
  ctx.arc(rotationHandle.x, rotationHandle.y, HANDLE_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw line from top center to rotation handle
  ctx.beginPath();
  ctx.moveTo(handles.topCenter.x, handles.topCenter.y);
  ctx.lineTo(rotationHandle.x, rotationHandle.y);
  ctx.stroke();

  ctx.restore();
}

/**
 * Renders a grid overlay on the canvas
 * @param ctx - Canvas context
 * @param width - Canvas width
 * @param height - Canvas height
 * @param gridSize - Grid cell size
 * @param color - Grid color
 */
export function renderGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number = 20,
  color: string = 'rgba(0, 0, 0, 0.1)'
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Applies filters to the canvas context
 * @param ctx - Canvas context
 * @param filters - Filter settings
 */
function applyFilters(
  ctx: CanvasRenderingContext2D,
  filters: ImageElement['filters']
): void {
  if (!filters) return;

  const filterParts: string[] = [];

  if (filters.brightness !== undefined) {
    filterParts.push(`brightness(${filters.brightness}%)`);
  }
  if (filters.contrast !== undefined) {
    filterParts.push(`contrast(${filters.contrast}%)`);
  }
  if (filters.saturation !== undefined) {
    filterParts.push(`saturate(${filters.saturation}%)`);
  }
  if (filters.blur !== undefined) {
    filterParts.push(`blur(${filters.blur}px)`);
  }
  if (filters.grayscale) {
    filterParts.push('grayscale(100%)');
  }
  if (filters.sepia) {
    filterParts.push('sepia(100%)');
  }

  ctx.filter = filterParts.join(' ') || 'none';
}

/**
 * Clears the canvas
 * @param ctx - Canvas context
 * @param width - Canvas width
 * @param height - Canvas height
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Renders multiple elements in order
 * @param ctx - Canvas context
 * @param elements - Elements to render
 * @param images - Map of loaded images
 * @param videos - Map of loaded videos
 */
export function renderElements(
  ctx: CanvasRenderingContext2D,
  elements: CanvasElement[],
  images?: Map<string, HTMLImageElement>,
  videos?: Map<string, HTMLVideoElement>
): void {
  // Sort by z-index
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  sorted.forEach((element) => {
    renderElement(ctx, element, images, videos);
  });
}
