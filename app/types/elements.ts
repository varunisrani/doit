// Canvas Element Types

import type { Filter } from './effects';

export type ElementType = 'image' | 'text' | 'shape' | 'video';

export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'line'
  | 'polygon'
  | 'star'
  | 'arrow';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type VerticalAlign = 'top' | 'middle' | 'bottom';

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';

export type FontStyle = 'normal' | 'italic' | 'oblique';

export type TextDecoration = 'none' | 'underline' | 'line-through' | 'overline';

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  transform: Transform;
  style: ElementStyle;
  filters: Filter[];
  locked: boolean;
  visible: boolean;
  clipPath?: ClipPath;
}

export interface Transform {
  x: number;               // Position X
  y: number;               // Position Y
  width: number;           // Element width
  height: number;          // Element height
  rotation: number;        // Rotation in degrees (0-360)
  scaleX: number;          // Horizontal scale (1 = 100%)
  scaleY: number;          // Vertical scale (1 = 100%)
  anchorX: number;         // Transform origin X (0-1)
  anchorY: number;         // Transform origin Y (0-1)
  flipX: boolean;          // Horizontal flip
  flipY: boolean;          // Vertical flip
  skewX?: number;          // Skew X in degrees
  skewY?: number;          // Skew Y in degrees
}

export interface ElementStyle {
  opacity: number;         // 0 to 1
  blendMode: BlendMode;
  zIndex: number;          // Layer order
  borderRadius?: number;   // For shapes
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  shadow?: Shadow;
  mask?: string;           // Mask image URL
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface Shadow {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  spread?: number;
}

export interface ClipPath {
  type: 'rectangle' | 'circle' | 'polygon' | 'path';
  data: string | number[];
}

// Image Element
export interface ImageElement extends CanvasElement {
  type: 'image';
  src: string;             // Image source URL or data URL
  assetId?: string;        // Reference to Asset
  naturalWidth: number;    // Original image width
  naturalHeight: number;   // Original image height
  crop?: CropData;
  filters: Filter[];
}

export interface CropData {
  x: number;               // Crop offset X
  y: number;               // Crop offset Y
  width: number;           // Cropped width
  height: number;          // Cropped height
}

// Text Element
export interface TextElement extends CanvasElement {
  type: 'text';
  content: string;         // Text content
  fontFamily: string;      // Font family name
  fontSize: number;        // Font size in px
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  textDecoration: TextDecoration;
  color: string;           // Text color (hex)
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  lineHeight: number;      // Line height multiplier (1.0 = 100%)
  letterSpacing: number;   // Letter spacing in px
  wordSpacing: number;     // Word spacing in px
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow?: TextShadow;
  textStroke?: TextStroke;
  backgroundColor?: string;
  padding?: number;
  maxWidth?: number;
  maxHeight?: number;
  autoSize: boolean;       // Auto-resize to fit content
}

export interface TextShadow {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface TextStroke {
  color: string;
  width: number;
}

// Shape Element
export interface ShapeElement extends CanvasElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDashArray?: number[]; // For dashed lines [dash, gap]
  points?: Point[];        // For polygon/star/line
  radius?: number;         // For circle
  radiusX?: number;        // For ellipse
  radiusY?: number;        // For ellipse
  sides?: number;          // For polygon/star
  innerRadius?: number;    // For star
  cornerRadius?: number;   // For rounded rectangles
}

export interface Point {
  x: number;
  y: number;
}

// Video Element (for future enhancement)
export interface VideoElement extends CanvasElement {
  type: 'video';
  src: string;
  assetId?: string;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
}

// Selection Handles
export type HandlePosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'rotation';

export interface SelectionHandle {
  position: HandlePosition;
  x: number;
  y: number;
  size: number;
  cursor: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  handles: SelectionHandle[];
}

// Alignment and Distribution
export type AlignmentType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type DistributionType =
  | 'horizontal'
  | 'vertical';

// Grid and Guides
export interface GridConfig {
  enabled: boolean;
  size: number;            // Grid cell size in px
  color: string;
  opacity: number;
  snap: boolean;
}

export interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;        // X or Y coordinate
  color: string;
  locked: boolean;
}

export interface Ruler {
  enabled: boolean;
  color: string;
  backgroundColor: string;
  fontSize: number;
  unit: 'px' | 'cm' | 'in';
}
