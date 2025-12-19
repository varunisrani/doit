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
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white">Playback System Demo</h2>

      <div className="bg-zinc-800 rounded-lg p-4 aspect-video flex items-center justify-center">
        <p className="text-zinc-400">Preview Canvas Area</p>
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

      <div className="text-sm text-zinc-400 space-y-2">
        <h3 className="font-semibold text-white">Features:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Play, Pause, Stop controls</li>
          <li>Frame-by-frame stepping (J/L keys)</li>
          <li>Skip forward/backward by 5 seconds</li>
          <li>Jump to start/end</li>
          <li>Variable playback speed (0.25x to 2x)</li>
          <li>Loop mode toggle</li>
          <li>Time scrubber for seeking</li>
          <li>Accurate time display with milliseconds</li>
          <li>Keyboard shortcuts support</li>
          <li>RequestAnimationFrame-based smooth playback</li>
        </ul>
      </div>
    </div>
  );
};
