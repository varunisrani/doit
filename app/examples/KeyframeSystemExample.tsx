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
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Keyframe Animation System</h1>
            <p className="text-gray-400">
              Complete example of keyframe-based animation system
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Zoom:
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="ml-2 w-32"
              />
              <span className="ml-2">{zoom.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="relative bg-black rounded aspect-video overflow-hidden">
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
                    absolute cursor-pointer transition-shadow
                    ${selectedElement === element.id ? 'ring-2 ring-purple-500' : ''}
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
                    <div className="flex items-center justify-center h-full bg-purple-600 rounded-lg p-4">
                      <span className="text-white font-bold text-2xl">
                        {element.content}
                      </span>
                    </div>
                  )}
                  {element.type === 'shape' && (
                    <div className="w-full h-full bg-blue-600 rounded-lg" />
                  )}
                </div>
              );
            })}

            {/* Time indicator overlay */}
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayback}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-medium transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Reset
            </button>

            {/* Timeline Scrubber */}
            <div className="flex-1">
              <div
                className="relative h-8 bg-gray-800 rounded cursor-pointer"
                onClick={handleTimelineClick}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-purple-600 rounded transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute top-0 w-1 h-full bg-white"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-sm font-mono text-gray-400 w-32 text-right">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Element Selector */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-sm font-semibold mb-3">Elements</h3>
          <div className="flex gap-2">
            {elements.map((element) => (
              <button
                key={element.id}
                onClick={() => setSelectedElement(element.id)}
                className={`
                  px-4 py-2 rounded transition-colors
                  ${
                    selectedElement === element.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline (takes 2 columns on large screens) */}
            <div className="lg:col-span-2">
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
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Timeline Interactions:</h4>
              <ul className="space-y-1">
                <li>• Click on track to add keyframe</li>
                <li>• Drag diamond to move keyframe</li>
                <li>• Right-click diamond to delete</li>
                <li>• Click diamond to select and edit</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Editor Panel:</h4>
              <ul className="space-y-1">
                <li>• Toggle keyframes per property</li>
                <li>• Adjust values and timing</li>
                <li>• Select easing functions</li>
                <li>• Preview easing curves</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {elements.length}
              </div>
              <div className="text-xs text-gray-500">Elements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {currentElement?.keyframes.length || 0}
              </div>
              <div className="text-xs text-gray-500">Keyframes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {formatTime(duration)}
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {zoom.toFixed(1)}x
              </div>
              <div className="text-xs text-gray-500">Zoom</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
