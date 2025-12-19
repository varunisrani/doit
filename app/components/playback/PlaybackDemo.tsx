'use client';

import React, { useCallback } from 'react';
import { PlaybackControls } from './PlaybackControls';

/**
 * Demo component showing how to integrate PlaybackControls
 * This can be used as a reference for implementing playback in the editor
 */
export const PlaybackDemo: React.FC = () => {
  // Handle canvas render updates
  const handleRender = useCallback((currentTime: number) => {
    // This is where you would:
    // 1. Update canvas rendering based on current time
    // 2. Render all visible clips at the current time
    // 3. Apply effects and transitions
    // 4. Update playhead position on timeline

    console.log('Rendering at time:', currentTime);

    // Example: Get canvas context and render
    // const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
    // if (canvas) {
    //   const ctx = canvas.getContext('2d');
    //   if (ctx) {
    //     // Clear canvas
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //
    //     // Render elements at current time
    //     renderElementsAtTime(ctx, currentTime);
    //   }
    // }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Playback System Demo
        </h2>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Modern video editing playback controls with smooth animations and precise time control
        </p>
      </div>

      <div
        className="rounded-lg p-8 aspect-video flex items-center justify-center transition-all duration-200"
        style={{
          background: 'var(--surface-elevated)',
          border: `2px dashed var(--border-primary)`,
        }}
      >
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'var(--surface-hover)',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              style={{ stroke: 'var(--text-tertiary)' }}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="1.5" />
              <path d="M8 21h8M12 17v4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Preview Canvas
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Your edited video will render here
            </p>
          </div>
        </div>
      </div>

      <PlaybackControls
        onRender={handleRender}
        showFrameStep={true}
        showSkipButtons={true}
        showSpeedControl={true}
        showLoopButton={true}
        showTimeDisplay={true}
        showScrubber={true}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg"
        style={{
          background: 'var(--surface)',
          border: `1px solid var(--border-primary)`,
        }}
      >
        <div className="space-y-4">
          <h3
            className="font-semibold flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--success)' }}
            />
            Core Features
          </h3>
          <ul className="space-y-2">
            {[
              'Play, Pause, Stop controls',
              'Frame-by-frame stepping (J/L keys)',
              'Skip forward/backward by 5 seconds',
              'Jump to start/end',
              'Variable playback speed (0.25x to 2x)',
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 flex-shrink-0"
                  style={{ stroke: 'var(--success)' }}
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3
            className="font-semibold flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--primary)' }}
            />
            Advanced Controls
          </h3>
          <ul className="space-y-2">
            {[
              'Loop mode toggle',
              'Time scrubber for seeking',
              'Accurate time display with milliseconds',
              'Keyboard shortcuts support',
              'RequestAnimationFrame-based smooth playback',
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 flex-shrink-0"
                  style={{ stroke: 'var(--primary)' }}
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keyboard shortcuts reference card */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--surface-elevated)',
          border: `1px solid var(--border-secondary)`,
        }}
      >
        <h4
          className="font-medium mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Quick Reference
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'Space/K', action: 'Play/Pause' },
            { key: 'J/L', action: 'Frame step' },
            { key: '←/→', action: 'Skip 1s' },
            { key: 'Home/End', action: 'Jump to start/end' },
          ].map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <kbd
                className="px-2 py-1 rounded text-xs font-mono"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid var(--border-primary)`,
                  color: 'var(--text-secondary)',
                }}
              >
                {shortcut.key}
              </kbd>
              <span
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
