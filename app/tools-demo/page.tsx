'use client';

import { CanvasEditor } from '../components/tools/CanvasEditor';

/**
 * Tools Demo Page
 *
 * Demonstrates the complete Text & Shapes system with modern UI.
 *
 * Features:
 * - Text Tool with rich editing and modern typography
 * - Shape Tool with multiple shapes and gradients
 * - Select Tool for manipulation with visual feedback
 * - Crop Tool with aspect ratios and preview
 * - Zoom Tool with smooth presets
 * - Full keyboard shortcuts with hints
 * - Modern glassmorphism design
 * - Smooth animations and transitions
 *
 * Navigate to /tools-demo to see this in action
 */
export default function ToolsDemoPage() {
  return (
    <div className="w-full h-screen bg-[var(--background)]">
      <div className="h-full flex flex-col">
        {/* Modern Header */}
        <header className="h-16 bg-[var(--surface-elevated)] backdrop-blur-xl border-b border-[var(--border-primary)] flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Tools Demo</h1>
              <p className="text-xs text-[var(--text-tertiary)]">Interactive Canvas Tools</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] rounded-full border border-[var(--border-primary)]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-[var(--text-secondary)]">Live Preview</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105">
              Reset Canvas
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          <CanvasEditor />

          {/* Floating Help Panel */}
          <div className="absolute bottom-6 left-6 bg-[var(--surface-elevated)] backdrop-blur-xl rounded-xl border border-[var(--border-primary)] p-4 shadow-2xl max-w-xs">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips
            </h3>
            <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
              <li>• Press <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[var(--text-primary)]">V</kbd> for Select Tool</li>
              <li>• Press <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[var(--text-primary)]">T</kbd> for Text Tool</li>
              <li>• Press <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[var(--text-primary)]">Space</kbd> to pan canvas</li>
              <li>• Scroll to zoom in/out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
