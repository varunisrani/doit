'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentProjects, loadProject } from './lib/storage/localStorage';
import { deserializeProjectData } from './lib/storage/serialization';
import { useEditorStore } from './lib/store/editorStore';
import { useCanvasStore } from './lib/store/canvasStore';
import { useTimelineStore } from './lib/store/timelineStore';
import { useSelectionStore } from './lib/store/selectionStore';
import { Film, Clock, FolderOpen, Plus, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [recentProjects, setRecentProjects] = useState<Array<{
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRedirect, setAutoRedirect] = useState(true);

  const editorStore = useEditorStore();
  const canvasStore = useCanvasStore();
  const timelineStore = useTimelineStore();
  const selectionStore = useSelectionStore();

  useEffect(() => {
    // Load recent projects
    const projects = getRecentProjects();
    setRecentProjects(projects);
    setIsLoading(false);

    // Only auto-redirect if no recent projects
    if (projects.length === 0 && autoRedirect) {
      const timer = setTimeout(() => {
        router.push('/editor');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router, autoRedirect]);

  const handleOpenProject = (projectId: string) => {
    const projectData = loadProject(projectId);
    if (!projectData) {
      console.error('Failed to load project');
      return;
    }

    const { settings, metadata, tracks, elements, assets } = deserializeProjectData(projectData);

    editorStore.loadProjectData(settings, metadata, assets);
    canvasStore.setElements(elements);
    timelineStore.setTracks(tracks);
    selectionStore.clearAll();

    router.push('/editor');
  };

  const handleNewProject = () => {
    editorStore.resetProject();
    canvasStore.clearElements();
    timelineStore.clearTimeline();
    selectionStore.clearAll();
    router.push('/editor');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-300 cursor-default">
            <Film className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2 hover:text-[var(--primary)] transition-colors duration-200">
            Video Editor Pro
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Professional Video Editing Suite
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleNewProject}
            className="group p-6 bg-[var(--surface)] border border-[var(--border-primary)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--primary)]/20 group-hover:scale-110 transition-all duration-250">
                <Plus className="w-6 h-6 text-[var(--primary)] group-hover:rotate-90 transition-transform duration-250" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-250">New Project</h3>
                <p className="text-sm text-[var(--text-secondary)]">Start from scratch</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/editor')}
            className="group p-6 bg-[var(--surface)] border border-[var(--border-primary)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] hover:shadow-lg hover:-translate-y-1 transition-all duration-250 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)]/20 group-hover:scale-110 transition-all duration-250">
                <ArrowRight className="w-6 h-6 text-[var(--accent)] group-hover:translate-x-1 transition-transform duration-250" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-250">Continue Editing</h3>
                <p className="text-sm text-[var(--text-secondary)]">Open the editor</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border-primary)] rounded-xl overflow-hidden hover:shadow-md transition-all duration-250">
            <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Projects</h2>
              </div>
              <span className="text-sm text-[var(--text-tertiary)]">{recentProjects.length} projects</span>
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {recentProjects.slice(0, 5).map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--surface-hover)] hover:translate-x-1 transition-all duration-250 ease-in-out group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--surface-elevated)] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--primary)]/10 transition-all duration-250">
                      <FolderOpen className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors duration-250" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-250">
                        {project.name}
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        Modified {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-250" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)] animate-pulse-soft">Loading...</p>
          </div>
        )}

        {/* No Recent Projects */}
        {!isLoading && recentProjects.length === 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border-primary)] rounded-xl p-8 text-center hover:shadow-md transition-all duration-250">
            <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
              <FolderOpen className="w-8 h-8 text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No Recent Projects</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Create a new project to get started with video editing
            </p>
            <div className="w-full bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg h-2 overflow-hidden">
              <div
                className="h-full rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] animate-shimmer"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-sm text-[var(--text-tertiary)] mt-2 animate-pulse-soft">
              Redirecting to editor in 3 seconds...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[var(--text-tertiary)]">
          <p>Video Editor Pro v1.0 · All data saved locally</p>
        </div>
      </div>
    </div>
  );
}
