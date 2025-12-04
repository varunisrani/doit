/**
 * Hit testing utilities for canvas interactions
 */

import { Point, distance } from '../utils/mathUtils';
import { CanvasElement } from './elements';
import { getResizeHandlePositions, HandleType, isPointInElement } from './transforms';

export const HANDLE_SIZE = 8;
export const HANDLE_HIT_THRESHOLD = 12;

/**
 * Tests if a point is inside a rectangle
 * @param point - The point to test
 * @param x - Rectangle x position
 * @param y - Rectangle y position
 * @param width - Rectangle width
 * @param height - Rectangle height
 * @returns True if point is inside rectangle
 */
export function pointInRect(
  point: Point,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  return (
    point.x >= x &&
    point.x <= x + width &&
    point.y >= y &&
    point.y <= y + height
  );
}

/**
 * Tests if a point is inside a rotated rectangle
 * @param point - The point to test
 * @param element - The element with rotation
 * @returns True if point is inside rotated rectangle
 */
export function pointInRotatedRect(
  point: Point,
  element: CanvasElement
): boolean {
  return isPointInElement(point, element);
}

/**
 * Tests if a point is inside a circle
 * @param point - The point to test
 * @param center - Circle center
 * @param radius - Circle radius
 * @returns True if point is inside circle
 */
export function pointInCircle(
  point: Point,
  center: Point,
  radius: number
): boolean {
  return distance(point, center) <= radius;
}

/**
 * Gets the element at a given point
 * @param point - The point to test
 * @param elements - Array of elements to test
 * @param visibleOnly - Only test visible elements
 * @returns The topmost element at the point, or null
 */
export function getElementAtPoint(
  point: Point,
  elements: CanvasElement[],
  visibleOnly: boolean = true
): CanvasElement | null {
  // Sort by z-index (descending) to check from top to bottom
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  for (const element of sorted) {
    if (visibleOnly && !element.visible) continue;
    if (element.locked) continue;

    if (pointInRotatedRect(point, element)) {
      return element;
    }
  }

  return null;
}

/**
 * Gets the handle at a given point for an element
 * @param point - The point to test
 * @param element - The element
 * @returns The handle type at the point, or null
 */
export function getHandleAtPoint(
  point: Point,
  element: CanvasElement
): HandleType | null {
  const handles = getResizeHandlePositions(element);
  const threshold = HANDLE_HIT_THRESHOLD;

  // Check rotation handle first (higher priority)
  if (distance(point, handles.rotation) <= threshold) {
    return 'rotation';
  }

  // Check resize handles
  const handleOrder: HandleType[] = [
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'topCenter',
    'middleLeft',
    'middleRight',
    'bottomCenter',
  ];

  for (const handleType of handleOrder) {
    if (distance(point, handles[handleType]) <= threshold) {
      return handleType;
    }
  }

  return null;
}

/**
 * Gets all elements within a selection rectangle
 * @param selectionRect - The selection rectangle
 * @param elements - Array of elements to test
 * @param fullyContained - If true, only return elements fully inside selection
 * @returns Array of selected elements
 */
export function getElementsInRect(
  selectionRect: { x: number; y: number; width: number; height: number },
  elements: CanvasElement[],
  fullyContained: boolean = false
): CanvasElement[] {
  const selected: CanvasElement[] = [];

  for (const element of elements) {
    if (!element.visible || element.locked) continue;

    if (fullyContained) {
      // Check if element is fully contained in selection
      if (
        element.x >= selectionRect.x &&
        element.y >= selectionRect.y &&
        element.x + element.width <= selectionRect.x + selectionRect.width &&
        element.y + element.height <= selectionRect.y + selectionRect.height
      ) {
        selected.push(element);
      }
    } else {
      // Check if element intersects with selection
      if (
        element.x < selectionRect.x + selectionRect.width &&
        element.x + element.width > selectionRect.x &&
        element.y < selectionRect.y + selectionRect.height &&
        element.y + element.height > selectionRect.y
      ) {
        selected.push(element);
      }
    }
  }

  return selected;
}

/**
 * Tests if two rectangles intersect
 * @param rect1 - First rectangle
 * @param rect2 - Second rectangle
 * @returns True if rectangles intersect
 */
export function rectIntersects(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

/**
 * Tests if a rectangle fully contains another rectangle
 * @param outer - Outer rectangle
 * @param inner - Inner rectangle
 * @returns True if outer contains inner
 */
export function rectContains(
  outer: { x: number; y: number; width: number; height: number },
  inner: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

/**
 * Gets the nearest snap point to a position
 * @param position - Current position
 * @param snapPoints - Array of snap point positions
 * @param threshold - Snap threshold distance
 * @returns Snapped position or original if no snap
 */
export function getSnapPosition(
  position: number,
  snapPoints: number[],
  threshold: number = 10
): number {
  let nearestPoint = position;
  let minDistance = threshold;

  for (const snapPoint of snapPoints) {
    const dist = Math.abs(position - snapPoint);
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = snapPoint;
    }
  }

  return nearestPoint;
}

/**
 * Tests if a point is near a line
 * @param point - The point to test
 * @param lineStart - Line start point
 * @param lineEnd - Line end point
 * @param threshold - Distance threshold
 * @returns True if point is near line
 */
export function pointNearLine(
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  threshold: number = 5
): boolean {
  const lineLength = distance(lineStart, lineEnd);
  if (lineLength === 0) return distance(point, lineStart) <= threshold;

  // Calculate perpendicular distance from point to line
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) +
        (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) /
        (lineLength * lineLength)
    )
  );

  const projection = {
    x: lineStart.x + t * (lineEnd.x - lineStart.x),
    y: lineStart.y + t * (lineEnd.y - lineStart.y),
  };

  return distance(point, projection) <= threshold;
}

/**
 * Gets the closest point on a rectangle edge to a given point
 * @param point - The point
 * @param rect - The rectangle
 * @returns Closest point on rectangle edge
 */
export function getClosestPointOnRect(
  point: Point,
  rect: { x: number; y: number; width: number; height: number }
): Point {
  return {
    x: Math.max(rect.x, Math.min(point.x, rect.x + rect.width)),
    y: Math.max(rect.y, Math.min(point.y, rect.y + rect.height)),
  };
}

/**
 * Checks if elements are overlapping
 * @param element1 - First element
 * @param element2 - Second element
 * @returns True if elements overlap
 */
export function elementsOverlap(
  element1: CanvasElement,
  element2: CanvasElement
): boolean {
  return rectIntersects(
    {
      x: element1.x,
      y: element1.y,
      width: element1.width,
      height: element1.height,
    },
    {
      x: element2.x,
      y: element2.y,
      width: element2.width,
      height: element2.height,
    }
  );
}
