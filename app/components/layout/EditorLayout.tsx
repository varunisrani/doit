'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EditorLayoutProps {
  children?: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Sidebar Toggle Button */}
        <button
          className="w-6 bg-zinc-800 hover:bg-zinc-700 border-r border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Center Area: Canvas + Timeline */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas Area */}
          <div className="flex-1 bg-zinc-900 p-4 overflow-auto">
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-5xl aspect-video bg-black rounded-lg border border-zinc-800 flex items-center justify-center">
                <div className="text-center text-zinc-600">
                  <svg
                    className="w-24 h-24 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg">Canvas Preview</p>
                  <p className="text-sm mt-2">Drop media here or import from library</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Area */}
          <div className="h-64 bg-zinc-950 border-t border-zinc-800 p-4">
            <div className="h-full bg-zinc-900 rounded-lg border border-zinc-800 overflow-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-zinc-400">Timeline</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>0:00</span>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <span>Duration: 0:00</span>
                  </div>
                </div>

                {/* Timeline Tracks */}
                <div className="space-y-2">
                  {/* Video Track */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-xs text-zinc-400 font-medium">Video</div>
                    <div className="flex-1 h-12 bg-zinc-800 rounded border border-zinc-700 relative">
                      {/* Placeholder for timeline clips */}
                    </div>
                  </div>

                  {/* Audio Track */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-xs text-zinc-400 font-medium">Audio</div>
                    <div className="flex-1 h-12 bg-zinc-800 rounded border border-zinc-700 relative">
                      {/* Placeholder for timeline clips */}
                    </div>
                  </div>

                  {/* Text Track */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-xs text-zinc-400 font-medium">Text</div>
                    <div className="flex-1 h-12 bg-zinc-800 rounded border border-zinc-700 relative">
                      {/* Placeholder for timeline clips */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Toggle Button */}
        <button
          className="w-6 bg-zinc-800 hover:bg-zinc-700 border-l border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
          onClick={() => setShowProperties(!showProperties)}
        >
          {showProperties ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Right Sidebar: Properties Panel */}
        {showProperties && (
          <aside className="w-80 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">Properties</h2>

              {/* Property Groups */}
              <div className="space-y-4">
                {/* Transform */}
                <div>
                  <h3 className="text-xs font-medium text-zinc-400 mb-2">Transform</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-zinc-500">Position X</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300"
                        defaultValue={0}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Position Y</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300"
                        defaultValue={0}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Scale</label>
                      <input
                        type="range"
                        className="w-full mt-1"
                        min="0"
                        max="200"
                        defaultValue={100}
                      />
                    </div>
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <h3 className="text-xs font-medium text-zinc-400 mb-2">Opacity</h3>
                  <input
                    type="range"
                    className="w-full"
                    min="0"
                    max="100"
                    defaultValue={100}
                  />
                </div>

                {/* Blend Mode */}
                <div>
                  <h3 className="text-xs font-medium text-zinc-400 mb-2">Blend Mode</h3>
                  <select className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300">
                    <option>Normal</option>
                    <option>Multiply</option>
                    <option>Screen</option>
                    <option>Overlay</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="text-xs font-medium text-zinc-400 mb-2">Duration</h3>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300"
                    placeholder="00:00:00"
                  />
                </div>
              </div>

              {/* No Selection State */}
              <div className="mt-8 text-center text-sm text-zinc-600">
                <p>Select an element to view properties</p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Custom children content if provided */}
      {children}
    </div>
  );
};
