'use client';

import React, { useState, useRef, useEffect } from 'react';
import TransitionsPanel from '@/app/components/panels/TransitionsPanel';
import { ClipTransitions } from '@/app/components/timeline/ClipTransition';
import {
  TransitionType,
  TransitionDirection,
  Transition,
  createTransition,
  applyCombinedTransitions,
  getBaseProperties,
  renderWithTransition
} from '@/app/lib/effects/transitions';
import { applyTransitionPreset, transitionPresets } from '@/app/lib/effects/transitions-utils';

/**
 * Demo component showing the transitions system in action
 * Use this as a reference for integration
 */

interface DemoClip {
  id: string;
  startTime: number;
  endTime: number;
  color: string;
  label: string;
  transitionIn?: Transition | null;
  transitionOut?: Transition | null;
}

export default function TransitionsDemo() {
  const [clips, setClips] = useState<DemoClip[]>([
    {
      id: 'clip-1',
      startTime: 0,
      endTime: 3000,
      color: '#3b82f6',
      label: 'Clip 1',
      transitionIn: createTransition('fade', 'in', 500),
      transitionOut: null
    },
    {
      id: 'clip-2',
      startTime: 2500,
      endTime: 5500,
      color: '#8b5cf6',
      label: 'Clip 2',
      transitionIn: createTransition('slide-left', 'in', 600),
      transitionOut: createTransition('fade', 'out', 400)
    },
    {
      id: 'clip-3',
      startTime: 5000,
      endTime: 8000,
      color: '#ec4899',
      label: 'Clip 3',
      transitionIn: createTransition('zoom-in', 'in', 700),
      transitionOut: createTransition('zoom-out', 'out', 700)
    }
  ]);

  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-1');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setCurrentTime(prev => {
        const next = prev + deltaTime;
        // Loop back to start
        return next > 8000 ? 0 : next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render each clip
    clips.forEach(clip => {
      // Skip if not visible
      if (currentTime < clip.startTime || currentTime > clip.endTime) {
        return;
      }

      // Get base properties
      const baseProps = getBaseProperties(canvas.width, canvas.height);

      // Apply transitions
      const props = applyCombinedTransitions(
        baseProps,
        clip.transitionIn ?? null,
        clip.transitionOut ?? null,
        currentTime,
        clip.startTime,
        clip.endTime,
        canvas.width,
        canvas.height
      );

      // Create a simple colored rectangle as clip content
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 300;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        // Gradient background
        const gradient = tempCtx.createLinearGradient(0, 0, 400, 300);
        gradient.addColorStop(0, clip.color);
        gradient.addColorStop(1, adjustColor(clip.color, -30));
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, 400, 300);

        // Label
        tempCtx.fillStyle = 'white';
        tempCtx.font = 'bold 48px sans-serif';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(clip.label, 200, 150);

        // Render with transitions
        const x = (canvas.width - 400) / 2;
        const y = (canvas.height - 300) / 2;

        renderWithTransition(
          ctx,
          tempCanvas as any,
          props,
          x,
          y,
          400,
          300
        );
      }
    });

    // Draw time indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(`Time: ${currentTime.toFixed(0)}ms`, 20, 30);
  }, [clips, currentTime]);

  // Handle transition selection
  const handleTransitionSelect = (type: TransitionType, direction: TransitionDirection) => {
    if (!selectedClipId) return;

    setClips(prev => prev.map(clip => {
      if (clip.id !== selectedClipId) return clip;

      const transition = createTransition(type, direction, 500);

      return {
        ...clip,
        [direction === 'in' ? 'transitionIn' : 'transitionOut']: transition
      };
    }));
  };

  // Handle transition duration change
  const handleTransitionDurationChange = (
    clipId: string,
    direction: TransitionDirection,
    newDuration: number
  ) => {
    setClips(prev => prev.map(clip => {
      if (clip.id !== clipId) return clip;

      const transitionKey = direction === 'in' ? 'transitionIn' : 'transitionOut';
      const transition = clip[transitionKey];

      if (!transition) return clip;

      return {
        ...clip,
        [transitionKey]: { ...transition, duration: newDuration }
      };
    }));
  };

  // Handle transition removal
  const handleTransitionRemove = (clipId: string, direction: TransitionDirection) => {
    setClips(prev => prev.map(clip => {
      if (clip.id !== clipId) return clip;

      return {
        ...clip,
        [direction === 'in' ? 'transitionIn' : 'transitionOut']: null
      };
    }));
  };

  // Apply preset to selected clip
  const handlePresetApply = (presetId: string) => {
    if (!selectedClipId) return;

    const { transitionIn, transitionOut } = applyTransitionPreset(presetId);

    setClips(prev => prev.map(clip => {
      if (clip.id !== selectedClipId) return clip;

      return {
        ...clip,
        transitionIn,
        transitionOut
      };
    }));
  };

  const selectedClip = clips.find(c => c.id === selectedClipId);
  const pixelsPerMs = 0.1;

  return (
    <div className="h-screen bg-gray-950 text-white flex">
      {/* Transitions Panel */}
      <div className="w-80 flex-shrink-0">
        <TransitionsPanel
          selectedClipId={selectedClipId}
          onTransitionSelect={handleTransitionSelect}
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          <h1 className="text-2xl font-bold mb-2">Transitions Demo</h1>
          <p className="text-gray-400">
            Click a clip to select it, then choose a transition from the left panel
          </p>
        </div>

        {/* Canvas Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border-2 border-gray-700 rounded-lg shadow-2xl"
            />

            {/* Playback Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  lastTimeRef.current = 0;
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
              >
                Reset
              </button>

              <input
                type="range"
                min="0"
                max="8000"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                className="w-64"
              />

              <span className="text-sm tabular-nums">
                {(currentTime / 1000).toFixed(2)}s / 8.00s
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-64 border-t border-gray-700 bg-gray-850 p-4 overflow-x-auto">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Timeline</h3>

            {/* Presets */}
            <div className="mb-3 flex gap-2">
              <span className="text-sm text-gray-400">Quick Presets:</span>
              {transitionPresets.slice(0, 4).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetApply(preset.id)}
                  disabled={!selectedClipId}
                  className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time ruler */}
          <div className="relative h-40 bg-gray-800 rounded">
            {/* Time markers */}
            <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-700">
              {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000].map(time => (
                <div
                  key={time}
                  className="absolute top-0 h-full border-l border-gray-600"
                  style={{ left: `${time * pixelsPerMs}px` }}
                >
                  <span className="absolute top-1 left-1 text-xs text-gray-400">
                    {time / 1000}s
                  </span>
                </div>
              ))}
            </div>

            {/* Clips */}
            <div className="absolute top-8 left-0 right-0 bottom-0 p-2">
              {clips.map((clip, index) => {
                const width = (clip.endTime - clip.startTime) * pixelsPerMs;
                const left = clip.startTime * pixelsPerMs;

                return (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`absolute h-16 rounded cursor-pointer transition-all ${
                      selectedClipId === clip.id
                        ? 'ring-2 ring-blue-400 scale-105'
                        : 'hover:scale-102'
                    }`}
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      top: `${index * 20}px`,
                      backgroundColor: clip.color
                    }}
                  >
                    <div className="p-2 h-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {clip.label}
                      </span>
                    </div>

                    {/* Transition indicators */}
                    <ClipTransitions
                      transitionIn={clip.transitionIn}
                      transitionOut={clip.transitionOut}
                      clipWidth={width}
                      clipDuration={clip.endTime - clip.startTime}
                      onTransitionInChange={(dur) =>
                        handleTransitionDurationChange(clip.id, 'in', dur)
                      }
                      onTransitionOutChange={(dur) =>
                        handleTransitionDurationChange(clip.id, 'out', dur)
                      }
                      onTransitionInRemove={() =>
                        handleTransitionRemove(clip.id, 'in')
                      }
                      onTransitionOutRemove={() =>
                        handleTransitionRemove(clip.id, 'out')
                      }
                      selectedTransition={
                        selectedClipId === clip.id ? undefined : null
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
              style={{ left: `${currentTime * pixelsPerMs}px` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-red-500 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return '#' + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0');
}
