'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/app/lib/store/canvasStore';
import { useSelectionStore } from '@/app/lib/store/selectionStore';
import { useTimelineStore } from '@/app/lib/store/timelineStore';
import { analyzeTransition, TransitionIssue } from '@/app/lib/effects/transitions-utils';
import {
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Eye,
  Zap,
  Palette,
  Clock,
  Layers,
  FileText,
  Image,
  Video,
  Square
} from 'lucide-react';
import type { CanvasElement } from '@/app/types/elements';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  badge?: string | number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = true,
  icon,
  children,
  badge
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border-primary)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-hover)] transition-all duration-200 group"
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              {icon}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-[var(--accent)]/10 text-[var(--accent)] rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 bg-[var(--surface-elevated)]/50">{children}</div>
      </div>
    </div>
  );
};

interface AnalysisItemProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const AnalysisItem: React.FC<AnalysisItemProps> = ({
  type,
  title,
  description,
  icon
}) => {
  const typeStyles = {
    info: 'border-[var(--info)]/30 bg-[var(--info-bg)] text-[var(--info)]',
    warning: 'border-[var(--warning)]/30 bg-[var(--warning-bg)] text-[var(--warning)]',
    error: 'border-[var(--error)]/30 bg-[var(--error-bg)] text-[var(--error)]',
    success: 'border-[var(--success)]/30 bg-[var(--success-bg)] text-[var(--success)]'
  };

  const defaultIcons = {
    info: <Info className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />
  };

  return (
    <div className={`p-4 rounded-xl border ${typeStyles[type]} mb-3 transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0">{icon || defaultIcons[type]}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--text-primary)] mb-1">{title}</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-[var(--surface-elevated)]/50 rounded-xl p-4 border border-[var(--border-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-secondary)] transition-all duration-200 hover:shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">{title}</span>
      {icon && <span className="text-[var(--text-secondary)]">{icon}</span>}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-[var(--text-primary)]">{value}</span>
      {trend && (
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
          trend.isPositive
            ? 'bg-[var(--success-bg)] text-[var(--success)]'
            : 'bg-[var(--error-bg)] text-[var(--error)]'
        }`}>
          {trend.isPositive ? '+' : ''}{trend.value}%
        </span>
      )}
    </div>
  </div>
);

export const AnalysisPanel: React.FC = () => {
  const { elements } = useCanvasStore();
  const { selectedElementIds } = useSelectionStore();
  const { tracks, duration } = useTimelineStore();

  // Get all clips from all tracks
  const clips = useMemo(() => {
    return tracks.flatMap(track => track.clips || []);
  }, [tracks]);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const elementsByType = elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalTransitions = clips.reduce((count, clip: any) => {
      return count + ((clip.transitionIn ? 1 : 0) + (clip.transitionOut ? 1 : 0));
    }, 0);

    const avgElementDuration = duration > 0 ? Math.round(duration / Math.max(elements.length, 1)) : 0;

    return {
      totalElements: elements.length,
      totalClips: clips.length,
      totalTransitions,
      duration: Math.round(duration), // Already in seconds
      elementsByType,
      avgElementDuration,
      selectedCount: selectedElementIds.size
    };
  }, [elements, clips, duration, selectedElementIds]);

  // Analyze transitions
  const transitionIssues = useMemo(() => {
    const issues: TransitionIssue[] = [];

    clips.forEach((clip: any, index: number) => {
      if (clip.transitionIn) {
        const clipIssues = analyzeTransition(clip.transitionIn, clip.duration || 0);
        issues.push(...clipIssues.map(issue => ({
          ...issue,
          message: `Clip ${index + 1} (In): ${issue.message}`
        })));
      }

      if (clip.transitionOut) {
        const clipIssues = analyzeTransition(clip.transitionOut, clip.duration || 0, clip.transitionIn);
        issues.push(...clipIssues.map(issue => ({
          ...issue,
          message: `Clip ${index + 1} (Out): ${issue.message}`
        })));
      }
    });

    return issues;
  }, [clips]);

  // Performance analysis
  const performanceIssues = useMemo(() => {
    const issues: AnalysisItemProps[] = [];

    // Check element count
    if (elements.length > 50) {
      issues.push({
        type: 'warning',
        title: 'High Element Count',
        description: 'Project has many elements which may impact performance during playback.'
      });
    }

    // Check for overlapping elements
    const overlappingElements = elements.filter(el =>
      el.transform && (el.transform.opacity < 1 || el.transform.scale !== 1)
    );

    if (overlappingElements.length > 10) {
      issues.push({
        type: 'info',
        title: 'Complex Overlays',
        description: `${overlappingElements.length} elements use transparency or scaling, which requires more rendering power.`
      });
    }

    // Check project duration
    if (duration > 300000) { // 5 minutes
      issues.push({
        type: 'info',
        title: 'Long Duration',
        description: 'Project is longer than 5 minutes. Consider breaking into smaller segments.'
      });
    }

    return issues;
  }, [elements, duration]);

  // Style consistency analysis
  const styleAnalysis = useMemo(() => {
    const issues: AnalysisItemProps[] = [];

    // Analyze color usage
    const colorMap = new Map<string, number>();
    elements.forEach(el => {
      if (el.style?.backgroundColor) {
        colorMap.set(el.style.backgroundColor, (colorMap.get(el.style.backgroundColor) || 0) + 1);
      }
    });

    if (colorMap.size > 8) {
      issues.push({
        type: 'warning',
        title: 'Color Variety',
        description: `Using ${colorMap.size} different background colors. Consider a more consistent palette.`
      });
    }

    // Analyze font usage
    const fontMap = new Map<string, number>();
    elements.forEach(el => {
      if (el.type === 'text' && el.style?.fontFamily) {
        fontMap.set(el.style.fontFamily, (fontMap.get(el.style.fontFamily) || 0) + 1);
      }
    });

    if (fontMap.size > 3) {
      issues.push({
        type: 'info',
        title: 'Font Variety',
        description: `Using ${fontMap.size} different fonts. Consider limiting to 2-3 for consistency.`
      });
    }

    // Check for consistent spacing
    const alignedElements = elements.filter(el =>
      el.transform && (el.transform.x % 10 === 0 && el.transform.y % 10 === 0)
    );

    if (alignedElements.length < elements.length * 0.5) {
      issues.push({
        type: 'warning',
        title: 'Alignment',
        description: 'Many elements are not aligned to grid. Consider using alignment tools for better organization.'
      });
    }

    return issues;
  }, [elements]);

  const elementIcons = {
    text: <FileText className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    shape: <Square className="w-4 h-4" />
  };

  return (
    <div className="w-full h-full bg-[var(--surface)] border-l border-[var(--border-primary)] overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--accent)]" />
            Analysis Panel
          </h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Real-time analysis of your video project
        </p>
      </div>

      {/* Project Statistics */}
      <CollapsibleSection
        title="Project Statistics"
        icon={<Eye className="w-4 h-4" />}
        badge={projectStats.totalElements}
      >
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            title="Elements"
            value={projectStats.totalElements}
            icon={<Layers className="w-3 h-3" />}
          />
          <StatCard
            title="Clips"
            value={projectStats.totalClips}
            icon={<Video className="w-3 h-3" />}
          />
          <StatCard
            title="Duration"
            value={`${projectStats.duration}s`}
            icon={<Clock className="w-3 h-3" />}
          />
          <StatCard
            title="Transitions"
            value={projectStats.totalTransitions}
            icon={<Zap className="w-3 h-3" />}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Element Breakdown</h4>
          <div className="grid gap-2">
            {Object.entries(projectStats.elementsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-lg border border-[var(--border-primary)] hover:bg-[var(--surface-hover)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                    {elementIcons[type as keyof typeof elementIcons]}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{type}s</span>
                    <p className="text-xs text-[var(--text-tertiary)]">Project elements</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--text-primary)]">{count}</span>
                  <p className="text-xs text-[var(--text-tertiary)]">items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Transition Analysis */}
      <CollapsibleSection
        title="Transition Analysis"
        icon={<Zap className="w-4 h-4" />}
        badge={transitionIssues.length}
      >
        {transitionIssues.length === 0 ? (
          <AnalysisItem
            type="success"
            title="No Transition Issues"
            description="All transitions look good!"
          />
        ) : (
          transitionIssues.map((issue, index) => (
            <AnalysisItem
              key={index}
              type={issue.severity}
              title={issue.severity === 'error' ? 'Transition Error' : 'Transition Warning'}
              description={issue.message}
            />
          ))
        )}
      </CollapsibleSection>

      {/* Performance Analysis */}
      <CollapsibleSection
        title="Performance"
        icon={<Zap className="w-4 h-4" />}
        badge={performanceIssues.length}
      >
        {performanceIssues.length === 0 ? (
          <AnalysisItem
            type="success"
            title="Optimized Performance"
            description="Project should run smoothly."
          />
        ) : (
          performanceIssues.map((issue, index) => (
            <AnalysisItem
              key={index}
              {...issue}
            />
          ))
        )}
      </CollapsibleSection>

      {/* Style Analysis */}
      <CollapsibleSection
        title="Style Consistency"
        icon={<Palette className="w-4 h-4" />}
        badge={styleAnalysis.length}
      >
        {styleAnalysis.length === 0 ? (
          <AnalysisItem
            type="success"
            title="Consistent Styling"
            description="Good visual consistency throughout the project."
          />
        ) : (
          styleAnalysis.map((issue, index) => (
            <AnalysisItem
              key={index}
              {...issue}
            />
          ))
        )}
      </CollapsibleSection>
    </div>
  );
};