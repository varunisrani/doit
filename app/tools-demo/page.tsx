'use client';

import { CanvasEditor } from '../components/tools/CanvasEditor';

/**
 * Tools Demo Page
 *
 * Demonstrates the complete Text & Shapes system for Phase 6.
 *
 * Features:
 * - Text Tool with rich editing
 * - Shape Tool with multiple shapes
 * - Select Tool for manipulation
 * - Crop Tool with aspect ratios
 * - Zoom Tool with presets
 * - Full keyboard shortcuts
 *
 * Navigate to /tools-demo to see this in action
 */
export default function ToolsDemoPage() {
  return (
    <div className="w-full h-screen">
      <CanvasEditor />
    </div>
  );
}
