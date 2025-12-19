/**
 * Transform utility functions for canvas elements
 */

import { Point, rotatePoint } from '../utils/mathUtils';
import { CanvasElement } from './elements';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TransformHandles {
  topLeft: Point;
  topCenter: Point;
  topRight: Point;
  middleLeft: Point;
  middleRight: Point;
  bottomLeft: Point;
  bottomCenter: Point;
  bottomRight: Point;
  rotation: Point;
}

export type HandleType =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'middleLeft'
  | 'middleRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'rotation';

/**
 * Calculates the bounding box of an element
 * @param element - The element
 * @returns Bounding box
 */
export function calculateBoundingBox(element: CanvasElement): BoundingBox {
  return {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };
}

/**
 * Applies a transform matrix to a point
 * @param point - The point to transform
 * @param element - The element with transform properties
 * @returns Transformed point
 */
export function applyTransformToPoint(
  point: Point,
  element: CanvasElement
): Point {
  const center = {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };

  return rotatePoint(point, center, element.rotation);
}

/**
 * Gets the position of the rotation handle
 * @param element - The element
 * @param handleDistance - Distance from element (default: 30)
 * @returns Rotation handle position
 */
export function getRotationHandlePosition(
  element: CanvasElement,
  handleDistance: number = 30
): Point {
  const center = {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };

  const handlePoint = {
    x: center.x,
    y: element.y - handleDistance,
  };

  return rotatePoint(handlePoint, center, element.rotation);
}

/**
 * Gets all resize handle positions
 * @param element - The element
 * @returns Object containing all handle positions
 */
export function getResizeHandlePositions(
  element: CanvasElement
): TransformHandles {
  const { x, y, width, height, rotation } = element;
  const center = { x: x + width / 2, y: y + height / 2 };

  // Calculate handle positions before rotation
  const handles = {
    topLeft: { x, y },
    topCenter: { x: x + width / 2, y },
    topRight: { x: x + width, y },
    middleLeft: { x, y: y + height / 2 },
    middleRight: { x: x + width, y: y + height / 2 },
    bottomLeft: { x, y: y + height },
    bottomCenter: { x: x + width / 2, y: y + height },
    bottomRight: { x: x + width, y: y + height },
    rotation: getRotationHandlePosition(element),
  };

  // Apply rotation to all handles except rotation handle (already rotated)
  const rotatedHandles: TransformHandles = { ...handles };
  for (const [key, point] of Object.entries(handles)) {
    if (key !== 'rotation') {
      rotatedHandles[key as HandleType] = rotatePoint(point, center, rotation);
    }
  }

  return rotatedHandles;
}

/**
 * Transforms element based on handle drag
 * @param element - The element to transform
 * @param handleType - The handle being dragged
 * @param delta - The drag delta
 * @param maintainAspectRatio - Whether to maintain aspect ratio
 * @returns Updated element properties
 */
export function transformElementByHandle(
  element: CanvasElement,
  handleType: HandleType,
  delta: Point,
  maintainAspectRatio: boolean = false
): Partial<CanvasElement> {
  if (handleType === 'rotation') {
    return transformRotation(element, delta);
  }

  return transformResize(element, handleType, delta, maintainAspectRatio);
}

/**
 * Transforms element rotation
 * @param element - The element
 * @param mousePos - Current mouse position
 * @returns Updated rotation
 */
function transformRotation(
  element: CanvasElement,
  mousePos: Point
): Partial<CanvasElement> {
  const center = {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };

  const angle = Math.atan2(mousePos.y - center.y, mousePos.x - center.x);
  const rotation = angle + Math.PI / 2;

  return { rotation };
}

/**
 * Transforms element size based on handle
 * @param element - The element
 * @param handleType - The handle type
 * @param delta - Drag delta
 * @param maintainAspectRatio - Maintain aspect ratio
 * @returns Updated element properties
 */
function transformResize(
  element: CanvasElement,
  handleType: HandleType,
  delta: Point,
  maintainAspectRatio: boolean
): Partial<CanvasElement> {
  const aspectRatio = element.width / element.height;
  let { x, y, width, height } = element;

  // Apply rotation to delta if element is rotated
  const rotatedDelta = element.rotation !== 0
    ? rotatePoint(delta, { x: 0, y: 0 }, -element.rotation)
    : delta;

  switch (handleType) {
    case 'topLeft':
      x += rotatedDelta.x;
      y += rotatedDelta.y;
      width -= rotatedDelta.x;
      height -= rotatedDelta.y;
      break;
    case 'topCenter':
      y += rotatedDelta.y;
      height -= rotatedDelta.y;
      break;
    case 'topRight':
      y += rotatedDelta.y;
      width += rotatedDelta.x;
      height -= rotatedDelta.y;
      break;
    case 'middleLeft':
      x += rotatedDelta.x;
      width -= rotatedDelta.x;
      break;
    case 'middleRight':
      width += rotatedDelta.x;
      break;
    case 'bottomLeft':
      x += rotatedDelta.x;
      width -= rotatedDelta.x;
      height += rotatedDelta.y;
      break;
    case 'bottomCenter':
      height += rotatedDelta.y;
      break;
    case 'bottomRight':
      width += rotatedDelta.x;
      height += rotatedDelta.y;
      break;
  }

  // Maintain aspect ratio if requested
  if (maintainAspectRatio) {
    if (handleType.includes('Left') || handleType.includes('Right')) {
      height = width / aspectRatio;
    } else if (handleType.includes('Top') || handleType.includes('Bottom')) {
      width = height * aspectRatio;
    }
  }

  // Ensure minimum size
  const minSize = 10;
  if (width < minSize) {
    width = minSize;
  }
  if (height < minSize) {
    height = minSize;
  }

  return { x, y, width, height };
}

/**
 * Gets the cursor style for a handle
 * @param handleType - The handle type
 * @param elementRotation - Element rotation in radians
 * @returns CSS cursor string
 */
export function getHandleCursor(
  handleType: HandleType,
  elementRotation: number = 0
): string {
  if (handleType === 'rotation') {
    return 'grab';
  }

  // Convert rotation to degrees and normalize
  const rotationDeg = (elementRotation * 180) / Math.PI;
  const normalizedRotation = ((rotationDeg % 180) + 180) % 180;

  // Map handle types to base cursor angles
  const cursorMap: Record<string, number> = {
    topLeft: 135,
    topCenter: 90,
    topRight: 45,
    middleLeft: 180,
    middleRight: 0,
    bottomLeft: 45,
    bottomCenter: 90,
    bottomRight: 135,
  };

  const baseCursor = cursorMap[handleType] || 0;
  const adjustedAngle = (baseCursor + normalizedRotation) % 180;

  // Convert angle to cursor type
  const cursors = ['e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize', 'n-resize', 'ne-resize'];
  const cursorIndex = Math.round(adjustedAngle / 22.5) % 8;

  return cursors[cursorIndex];
}

/**
 * Gets the center point of an element
 * @param element - The element
 * @returns Center point
 */
export function getElementCenter(element: CanvasElement): Point {
  return {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };
}

/**
 * Gets the four corners of an element (accounting for rotation)
 * @param element - The element
 * @returns Array of corner points
 */
export function getElementCorners(element: CanvasElement): Point[] {
  const { x, y, width, height, rotation } = element;
  const center = getElementCenter(element);

  const corners = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];

  if (rotation === 0) {
    return corners;
  }

  return corners.map((corner) => rotatePoint(corner, center, rotation));
}

/**
 * Checks if a point is inside an element's bounds
 * @param point - The point to test
 * @param element - The element
 * @returns True if point is inside element
 */
export function isPointInElement(point: Point, element: CanvasElement): boolean {
  const center = getElementCenter(element);

  // Rotate point back to element's local space
  const localPoint = rotatePoint(point, center, -element.rotation);

  return (
    localPoint.x >= element.x &&
    localPoint.x <= element.x + element.width &&
    localPoint.y >= element.y &&
    localPoint.y <= element.y + element.height
  );
}
