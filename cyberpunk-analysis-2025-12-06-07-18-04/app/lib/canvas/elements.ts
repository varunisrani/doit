/**
 * Canvas element creation utilities
 */

export type ElementType = 'image' | 'text' | 'shape' | 'video';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    grayscale?: boolean;
    sepia?: boolean;
  };
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  backgroundColor?: string;
  padding?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'triangle' | 'line';
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

export interface VideoElement extends BaseElement {
  type: 'video';
  src: string;
  currentTime: number;
  volume: number;
  muted: boolean;
}

export type CanvasElement = ImageElement | TextElement | ShapeElement | VideoElement;

/**
 * Generates a unique ID for an element
 * @returns Unique ID string
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a new image element
 * @param src - Image source URL
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @returns New image element
 */
export function createImageElement(
  src: string,
  x: number = 0,
  y: number = 0,
  width: number = 100,
  height: number = 100
): ImageElement {
  return {
    id: generateId(),
    type: 'image',
    src,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,
    filters: {},
  };
}

/**
 * Creates a new text element
 * @param text - Text content
 * @param x - X position
 * @param y - Y position
 * @returns New text element
 */
export function createTextElement(
  text: string = 'Text',
  x: number = 0,
  y: number = 0
): TextElement {
  return {
    id: generateId(),
    type: 'text',
    text,
    x,
    y,
    width: 200,
    height: 50,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
    lineHeight: 1.2,
    letterSpacing: 0,
  };
}

/**
 * Creates a new shape element
 * @param shape - Shape type
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @returns New shape element
 */
export function createShapeElement(
  shape: ShapeElement['shape'] = 'rectangle',
  x: number = 0,
  y: number = 0,
  width: number = 100,
  height: number = 100
): ShapeElement {
  return {
    id: generateId(),
    type: 'shape',
    shape,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,
    fillColor: '#3b82f6',
    strokeColor: '#1e40af',
    strokeWidth: 2,
    cornerRadius: 0,
  };
}

/**
 * Creates a new video element
 * @param src - Video source URL
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @returns New video element
 */
export function createVideoElement(
  src: string,
  x: number = 0,
  y: number = 0,
  width: number = 320,
  height: number = 240
): VideoElement {
  return {
    id: generateId(),
    type: 'video',
    src,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,
    currentTime: 0,
    volume: 1,
    muted: false,
  };
}

/**
 * Clones an element
 * @param element - Element to clone
 * @returns Cloned element with new ID
 */
export function cloneElement<T extends CanvasElement>(element: T): T {
  return {
    ...element,
    id: generateId(),
    x: element.x + 20,
    y: element.y + 20,
  };
}

/**
 * Updates element properties
 * @param element - Element to update
 * @param updates - Partial properties to update
 * @returns Updated element
 */
export function updateElement<T extends CanvasElement>(
  element: T,
  updates: Partial<T>
): T {
  return {
    ...element,
    ...updates,
  };
}

/**
 * Gets default properties for an element type
 * @param type - Element type
 * @returns Default properties object
 */
export function getDefaultProperties(type: ElementType): Partial<CanvasElement> {
  const base = {
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,
  };

  switch (type) {
    case 'image':
      return { ...base, filters: {} };
    case 'text':
      return {
        ...base,
        fontSize: 24,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
      };
    case 'shape':
      return {
        ...base,
        fillColor: '#3b82f6',
        strokeColor: '#1e40af',
        strokeWidth: 2,
        cornerRadius: 0,
      };
    case 'video':
      return {
        ...base,
        currentTime: 0,
        volume: 1,
        muted: false,
      };
    default:
      return base;
  }
}

/**
 * Validates element properties
 * @param element - Element to validate
 * @returns True if element is valid
 */
export function isValidElement(element: any): element is CanvasElement {
  return (
    element &&
    typeof element === 'object' &&
    'id' in element &&
    'type' in element &&
    'x' in element &&
    'y' in element &&
    'width' in element &&
    'height' in element
  );
}

/**
 * Sorts elements by z-index
 * @param elements - Elements to sort
 * @returns Sorted elements array
 */
export function sortElementsByZIndex(elements: CanvasElement[]): CanvasElement[] {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}

/**
 * Gets the bounding box of multiple elements
 * @param elements - Elements to get bounds for
 * @returns Bounding box
 */
export function getElementsBounds(elements: CanvasElement[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x + element.width);
    maxY = Math.max(maxY, element.y + element.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
