'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useEditorStore } from '@/app/lib/store/editorStore';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import {
  listProjects,
  loadProject,
  deleteProject,
  saveProject,
  type ProjectData,
} from '@/app/lib/storage/localStorage';
import {
  serializeProjectData,
  deserializeProjectData,
  createNewProject,
} from '@/app/lib/storage/serialization';
import {
  FolderOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'new' | 'open' | 'save' | 'saveAs';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<ReturnType<typeof listProjects>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Store hooks
  const editorStore = useEditorStore();
  const canvasStore = useCanvasStore();
  const timelineStore = useTimelineStore();
  const selectionStore = useSelectionStore();

  // Load projects list
  useEffect(() => {
    if (isOpen && (mode === 'open' || mode === 'saveAs')) {
      const projectsList = listProjects();
      setProjects(projectsList);
    }
  }, [isOpen, mode]);

  // Set default project name for save/saveAs
  useEffect(() => {
    if (isOpen && (mode === 'save' || mode === 'saveAs' || mode === 'new')) {
      if (mode === 'new') {
        setProjectName('Untitled Project');
      } else {
        setProjectName(editorStore.metadata.name || 'Untitled Project');
      }
    }
  }, [isOpen, mode, editorStore.metadata.name]);

  const handleNewProject = () => {
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create new project data
      const newProject = createNewProject(projectName.trim());

      // Reset all stores
      editorStore.resetProject();
      canvasStore.clearElements();
      timelineStore.clearTimeline();
      selectionStore.clearAll();

      // Set the new project metadata
      editorStore.setMetadata({
        id: newProject.id,
        name: newProject.metadata.name,
        createdAt: newProject.metadata.createdAt,
        updatedAt: newProject.metadata.updatedAt,
      });

      // Save the empty project
      saveProject(newProject);

      onClose();
    } catch (err) {
      setError('Failed to create new project');
      console.error('New project error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenProject = () => {
    if (!selectedProjectId) {
      setError('Please select a project to open');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectData = loadProject(selectedProjectId);
      if (!projectData) {
        setError('Failed to load project');
        return;
      }

      // Deserialize and load into stores
      const { settings, metadata, tracks, elements, assets } = deserializeProjectData(projectData);

      editorStore.loadProjectData(settings, metadata, assets);
      canvasStore.setElements(elements);
      timelineStore.setTracks(tracks);
      selectionStore.clearAll();

      onClose();
    } catch (err) {
      setError('Failed to open project');
      console.error('Open project error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update metadata
      const currentMetadata = editorStore.metadata;
      const projectId = mode === 'saveAs' ? crypto.randomUUID() : (currentMetadata.id || crypto.randomUUID());

      const metadata = {
        ...currentMetadata,
        id: projectId,
        name: projectName.trim(),
        updatedAt: Date.now(),
      };

      if (!currentMetadata.id || mode === 'saveAs') {
        metadata.createdAt = Date.now();
      }

      // Update editor store
      editorStore.setMetadata(metadata);

      // Serialize project data
      const projectData: ProjectData = serializeProjectData(
        editorStore.project,
        metadata,
        timelineStore.tracks,
        canvasStore.elements,
        editorStore.assets
      );

      // Save to localStorage
      const success = saveProject(projectData);

      if (!success) {
        setError('Failed to save project. Storage might be full.');
        return;
      }

      editorStore.setHasUnsavedChanges(false);
      onClose();
    } catch (err) {
      setError('Failed to save project');
      console.error('Save project error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
    } catch (err) {
      setError('Failed to delete project');
      console.error('Delete project error:', err);
    }
  };

  const handleExportProject = () => {
    try {
      const projectData: ProjectData = serializeProjectData(
        editorStore.project,
        editorStore.metadata,
        timelineStore.tracks,
        canvasStore.elements,
        editorStore.assets
      );

      const jsonString = JSON.stringify(projectData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${editorStore.metadata.name || 'project'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export project');
      console.error('Export error:', err);
    }
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const projectData = JSON.parse(jsonString) as ProjectData;

        // Generate new ID
        projectData.id = crypto.randomUUID();
        projectData.metadata.name = `${projectData.metadata.name} (Imported)`;
        projectData.metadata.createdAt = Date.now();
        projectData.metadata.updatedAt = Date.now();

        // Load into stores
        const { settings, metadata, tracks, elements, assets } = deserializeProjectData(projectData);

        editorStore.loadProjectData(settings, metadata, assets);
        canvasStore.setElements(elements);
        timelineStore.setTracks(tracks);
        selectionStore.clearAll();

        // Save the imported project
        saveProject(projectData);

        onClose();
      } catch (err) {
        setError('Failed to import project. Invalid file format.');
        console.error('Import error:', err);
      }
    };

    reader.readAsText(file);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'new':
        return 'New Project';
      case 'open':
        return 'Open Project';
      case 'save':
        return 'Save Project';
      case 'saveAs':
        return 'Save Project As';
      default:
        return 'Project';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="min-w-[500px] max-w-[600px]">
        {error && (
          <div className="mb-4 p-3 bg-[var(--error-bg)] border border-[var(--error)] rounded-lg flex items-center gap-2 text-[var(--error)]">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* New Project Mode */}
        {mode === 'new' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleNewProject}
                disabled={isLoading}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </div>
        )}

        {/* Open Project Mode */}
        {mode === 'open' && (
          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto border border-[var(--border-primary)] rounded-lg">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No projects found</p>
                  <p className="text-sm mt-1">Create a new project to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-primary)]">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedProjectId === project.id
                          ? 'bg-[var(--primary)]/10 border-l-2 border-[var(--primary)]'
                          : 'hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
                          <div>
                            <h4 className="font-medium text-[var(--text-primary)]">
                              {project.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-1">
                              <Clock className="w-3 h-3" />
                              <span>Modified {formatDate(project.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="text-[var(--error)] hover:bg-[var(--error-bg)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--primary)]">
                <Upload className="w-4 h-4" />
                Import from file
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportProject}
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleOpenProject}
                disabled={!selectedProjectId || isLoading}
                leftIcon={<FolderOpen className="w-4 h-4" />}
              >
                {isLoading ? 'Opening...' : 'Open Project'}
              </Button>
            </div>
          </div>
        )}

        {/* Save / Save As Mode */}
        {(mode === 'save' || mode === 'saveAs') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                autoFocus
              />
            </div>

            {mode === 'saveAs' && projects.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Existing Projects
                </label>
                <div className="max-h-[150px] overflow-y-auto border border-[var(--border-primary)] rounded-lg">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setProjectName(project.name)}
                      className="p-3 hover:bg-[var(--surface-hover)] cursor-pointer flex items-center gap-2 text-sm"
                    >
                      <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span>{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportProject}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export to file
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProject}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : mode === 'saveAs' ? 'Save As' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProjectModal;
