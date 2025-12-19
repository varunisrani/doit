'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChevronLeft, ChevronRight, Layers, Settings, Clock, Monitor, MousePointer } from 'lucide-react';

interface EditorLayoutProps {
  children?: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <div className="enterprise-header border-b border-accent z-50">
        <Header />
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {showSidebar && (
          <div className="enterprise-sidebar border-r border-accent">
            <Sidebar />
          </div>
        )}

        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-6 h-12 enterprise-button rounded-r flex items-center justify-center text-muted hover:text-foreground border-l-0"
          style={{ left: showSidebar ? 'rem' : '0' }}
          onClick={() => setShowSidebar(!showSidebar)}
          title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
        >
          {showSidebar ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 flex flex-col min-w-0 gap-0">
          <div className="flex-1 flex flex-col relative">
            <div className="enterprise-timeline-ruler h-8 flex items-center px-3 border-b border-accent">
              <button className="enterprise-compact enterprise-button mr-2"><MousePointer className="w-3 h-3" /></button>
              <div className="w-px h-3 bg-accent mx-1"></div>
              <span className="enterprise-compact text-muted font-mono mr-4">1920x1080</span>
              <div className="w-px h-3 bg-accent mx-1"></div>
              <span className="enterprise-compact text-muted">Zoom: 100%</span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-5xl aspect-video enterprise-canvas rounded flex items-center justify-center relative overflow-hidden border border-accent">
                <div className="text-center text-muted">
                  <Monitor className="w-12 h-12 mx-auto mb-3 opacity-60" />
                  <p className="text-xs font-medium">Canvas Empty</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-64 enterprise-timeline flex flex-col overflow-hidden">
            <div className="enterprise-timeline-ruler h-8 flex items-center justify-between px-3 border-b border-accent">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-muted">
                  <Clock className="w-3 h-3" />
                  <span className="enterprise-compact font-mono">00:00:00:00</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="enterprise-compact enterprise-button"><Layers className="w-3 h-3" /></button>
              </div>
            </div>

            <div className="enterprise-timeline-ruler h-6 flex items-center px-3 border-b border-accent text-xs text-muted font-mono">
              <span className="mr-8">00:00</span>
              <span className="mr-8">00:05</span>
              <span className="mr-8">00:10</span>
              <span className="mr-8">00:15</span>
              <span className="mr-8">00:20</span>
            </div>

            <div className="flex-1 overflow-y-auto p-1 space-y-1 bg-secondary">
              <div className="h-16 bg-secondary border border-accent relative hover:border-primary transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-24 border-r border-accent bg-enterprise-sidebar flex items-center justify-center">
                  <span className="enterprise-compact text-muted font-medium">Video 1</span>
                </div>
              </div>
              <div className="h-16 bg-secondary border border-accent relative hover:border-primary transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-24 border-r border-accent bg-enterprise-sidebar flex items-center justify-center">
                  <span className="enterprise-compact text-muted font-medium">Video 2</span>
                </div>
              </div>
              <div className="h-16 bg-secondary border border-accent relative hover:border-primary transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-24 border-r border-accent bg-enterprise-sidebar flex items-center justify-center">
                  <span className="enterprise-compact text-muted font-medium">Audio 1</span>
                </div>
              </div>
              <div className="h-16 bg-secondary border border-accent relative hover:border-primary transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-24 border-r border-accent bg-enterprise-sidebar flex items-center justify-center">
                  <span className="enterprise-compact text-muted font-medium">Text 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="w-6 h-12 self-center enterprise-button rounded-l flex items-center justify-center text-muted hover:text-foreground border-r-0"
          onClick={() => setShowProperties(!showProperties)}
          title={showProperties ? "Hide Properties" : "Show Properties"}
        >
          {showProperties ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {showProperties && (
          <aside className="w-72 enterprise-panel border-l border-accent overflow-y-auto z-20">
            <div className="p-4">
              <h2 className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Properties
              </h2>

              <div className="space-y-4">
                <div className="enterprise-panel p-3 border border-accent">
                  <h3 className="text-xs font-medium text-foreground mb-3">Transform</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted font-medium mb-1 block">X</label>
                        <input type="number" className="w-full enterprise-input enterprise-compact rounded" defaultValue={0} />
                      </div>
                      <div>
                        <label className="text-xs text-muted font-medium mb-1 block">Y</label>
                        <input type="number" className="w-full enterprise-input enterprise-compact rounded" defaultValue={0} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted font-medium mb-1 block">W</label>
                        <input type="number" className="w-full enterprise-input enterprise-compact rounded" defaultValue={1920} />
                      </div>
                      <div>
                        <label className="text-xs text-muted font-medium mb-1 block">H</label>
                        <input type="number" className="w-full enterprise-input enterprise-compact rounded" defaultValue={1080} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted font-medium mb-1 block">Rotation</label>
                      <input type="range" className="w-full h-1" min="0" max="360" defaultValue={0} />
                    </div>
                  </div>
                </div>

                <div className="enterprise-panel p-3 border border-accent">
                  <h3 className="text-xs font-medium text-foreground mb-3">Appearance</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted font-medium mb-1 block">Opacity</label>
                      <div className="flex items-center gap-2">
                        <input type="range" className="flex-1 h-1" min="0" max="100" defaultValue={100} />
                        <span className="text-xs text-muted w-8 text-right">100%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted font-medium mb-1 block">Blend Mode</label>
                      <select className="w-full enterprise-input enterprise-compact rounded">
                        <option>Normal</option>
                        <option>Multiply</option>
                        <option>Screen</option>
                        <option>Overlay</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
      {children}
    </div>
  );
};
