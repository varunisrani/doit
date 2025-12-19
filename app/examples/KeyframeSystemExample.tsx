'use client';

/**
 * Example: Keyframe Animation System Integration
 *
 * This example demonstrates how to integrate the keyframe animation system
 * into your video editor application.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Keyframe,
  AnimatableProperty,
  getElementAnimatedValues,
  createKeyframe,
} from '@/app/lib/effects/animations';
import { KeyframeTimeline, KeyframeEditor } from '@/app/components/keyframes';

// Example video element interface
interface VideoElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'shape';
  content: string;
  defaultProps: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    opacity: number;
  };
  keyframes: Keyframe[];
}

export default function KeyframeSystemExample() {
  // Video state
  const [duration] = useState(10000); // 10 seconds
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef<number>();

  // Keyframe state
  const [selectedElement, setSelectedElement] = useState<string | null>('element-1');
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<AnimatableProperty | null>(null);
  const [zoom, setZoom] = useState(1);

  // Example elements
  const [elements, setElements] = useState<VideoElement[]>([
    {
      id: 'element-1',
      type: 'text',
      content: 'Animated Text',
      defaultProps: {
        x: 100,
        y: 100,
        width: 300,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      },
      keyframes: [
        // Example animation: fade in and move
        createKeyframe('opacity', 0, 0, 'easeIn'),
        createKeyframe('opacity', 1000, 1, 'linear'),
        createKeyframe('x', 0, 100, 'easeInOut'),
        createKeyframe('x', 2000, 400, 'easeInOut'),
        createKeyframe('x', 4000, 100, 'easeInOut'),
        createKeyframe('rotation', 2000, 0, 'easeInOut'),
        createKeyframe('rotation', 3000, 360, 'easeOutElastic'),
      ],
    },
    {
      id: 'element-2',
      type: 'shape',
      content: 'Rectangle',
      defaultProps: {
        x: 50,
        y: 300,
        width: 200,
        height: 150,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      },
      keyframes: [
        // Example animation: bounce in
        createKeyframe('scaleX', 0, 0, 'easeOutBounce'),
        createKeyframe('scaleX', 1500, 1, 'linear'),
        createKeyframe('scaleY', 0, 0, 'easeOutBounce'),
        createKeyframe('scaleY', 1500, 1, 'linear'),
      ],
    },
  ]);

  // Playback control
  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now() - currentTime;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
      } else {
        setCurrentTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  // Update keyframes for selected element
  const handleKeyframesChange = (newKeyframes: Keyframe[]) => {
    if (!selectedElement) return;

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedElement
          ? { ...el, keyframes: newKeyframes }
          : el
      )
    );
  };

  // Get current element
  const currentElement = elements.find((el) => el.id === selectedElement);

  // Playback controls
  const togglePlayback = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    setCurrentTime(Math.max(0, Math.min(duration, percent * duration)));
    setIsPlaying(false);
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[var(--surface-elevated)] backdrop-blur-xl rounded-2xl border border-[var(--border-primary)]">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Keyframe Animation System
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Complete example of keyframe-based animation system
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-[var(--text-secondary)] flex items-center gap-3">
              <span>Zoom:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-purple-500"
              />
              <span className="text-purple-400 font-mono font-semibold">
                {zoom.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="bg-[var(--surface)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
          <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Preview
          </h2>
          <div className="relative bg-[var(--surface-elevated)] backdrop-blur-sm rounded-2xl aspect-video overflow-hidden border border-[var(--border-primary)]">
            {/* Render animated elements */}
            {elements.map((element) => {
              const animatedValues = getElementAnimatedValues(
                element.keyframes,
                currentTime,
                element.defaultProps
              );

              const transform = `
                translate(${animatedValues.x}px, ${animatedValues.y}px)
                rotate(${animatedValues.rotation}deg)
                scale(${animatedValues.scaleX}, ${animatedValues.scaleY})
              `;

              return (
                <div
                  key={element.id}
                  className={`
                    absolute cursor-pointer transition-all duration-300
                    ${selectedElement === element.id ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black' : ''}
                  `}
                  style={{
                    width: animatedValues.width,
                    height: animatedValues.height,
                    transform,
                    opacity: animatedValues.opacity,
                    transformOrigin: 'center center',
                  }}
                  onClick={() => setSelectedElement(element.id)}
                >
                  {element.type === 'text' && (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-600/90 to-purple-700/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                      <span className="text-white font-bold text-2xl drop-shadow-sm">
                        {element.content}
                      </span>
                    </div>
                  )}
                  {element.type === 'shape' && (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/90 to-blue-700/90 backdrop-blur-sm rounded-xl border border-blue-500/30" />
                  )}
                </div>
              );
            })}

            {/* Time indicator overlay */}
            <div className="absolute bottom-6 left-6 bg-[var(--surface-elevated)] backdrop-blur-xl px-4 py-2 rounded-xl text-sm font-mono border border-[var(--border-primary)] shadow-xl">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="bg-[var(--surface)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlayback}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="px-6 py-3 bg-[var(--surface-hover)] hover:bg-[var(--surface)] rounded-xl font-medium transition-all duration-300 border border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
            >
              Reset
            </button>

            {/* Timeline Scrubber */}
            <div className="flex-1">
              <div
                className="relative h-12 bg-[var(--surface)] rounded-xl cursor-pointer overflow-hidden backdrop-blur-sm border border-[var(--border-primary)]"
                onClick={handleTimelineClick}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl transition-all duration-150 backdrop-blur-sm"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute top-0 w-2 h-full bg-gradient-to-b from-purple-400 to-pink-400 shadow-lg shadow-purple-500/50"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-sm font-mono text-[var(--text-secondary)] w-40 text-right bg-[var(--surface)] px-4 py-2 rounded-xl border border-[var(--border-primary)] backdrop-blur-sm">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Element Selector */}
        <div className="bg-[var(--surface)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Elements
          </h3>
          <div className="flex gap-3 flex-wrap">
            {elements.map((element) => (
              <button
                key={element.id}
                onClick={() => setSelectedElement(element.id)}
                className={`
                  px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border font-medium
                  ${
                    selectedElement === element.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                  }
                `}
              >
                {element.content}
              </button>
            ))}
          </div>
        </div>

        {/* Keyframe Timeline and Editor */}
        {currentElement && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Timeline (takes 2 columns on large screens) */}
            <div className="xl:col-span-2">
              <KeyframeTimeline
                elementId={currentElement.id}
                keyframes={currentElement.keyframes}
                currentTime={currentTime}
                duration={duration}
                selectedProperty={selectedProperty}
                onKeyframesChange={handleKeyframesChange}
                onSelectedKeyframeChange={setSelectedKeyframeId}
                selectedKeyframeId={selectedKeyframeId}
                zoom={zoom}
              />
            </div>

            {/* Editor (takes 1 column) */}
            <div>
              <KeyframeEditor
                elementId={currentElement.id}
                keyframes={currentElement.keyframes}
                currentTime={currentTime}
                selectedProperty={selectedProperty}
                selectedKeyframeId={selectedKeyframeId}
                onKeyframesChange={handleKeyframesChange}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-[var(--surface)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-primary)]">
          <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[var(--text-secondary)]">
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)] text-base mb-4">Timeline Interactions:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Click on track to add keyframe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Drag diamond to move keyframe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Right-click diamond to delete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Click diamond to select and edit</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)] text-base mb-4">Editor Panel:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Toggle keyframes per property</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Adjust values and timing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Select easing functions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Preview easing curves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[var(--surface)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-primary)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {elements.length}
              </div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">Elements</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentElement?.keyframes.length || 0}
              </div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">Keyframes</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {formatTime(duration)}
              </div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">Duration</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {zoom.toFixed(1)}x
              </div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">Zoom</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
