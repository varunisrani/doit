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
    <div className="border-b border-zinc-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-white">{title}</span>
          {badge && (
            <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        )}
      </button>
      {isOpen && <div className="px-4 py-3">{children}</div>}
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
    info: 'border-blue-600/30 bg-blue-600/10 text-blue-400',
    warning: 'border-yellow-600/30 bg-yellow-600/10 text-yellow-400',
    error: 'border-red-600/30 bg-red-600/10 text-red-400',
    success: 'border-green-600/30 bg-green-600/10 text-green-400'
  };

  const defaultIcons = {
    info: <Info className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />
  };

  return (
    <div className={`p-3 rounded-lg border ${typeStyles[type]} mb-2`}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5">{icon || defaultIcons[type]}</span>
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-sm text-zinc-300">{description}</p>
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
  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-zinc-400">{title}</span>
      {icon && <span className="text-zinc-400">{icon}</span>}
    </div>
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-white">{value}</span>
      {trend && (
        <span className={`text-xs ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend.isPositive ? '+' : ''}{trend.value}%
        </span>
      )}
    </div>
  </div>
);

export const AnalysisPanel: React.FC = () => {
  const { elements } = useCanvasStore();
  const { selectedElementIds } = useSelectionStore();
  const { clips, duration } = useTimelineStore();

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const elementsByType = elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalTransitions = clips.reduce((count, clip) => {
      return count + ((clip.transitionIn ? 1 : 0) + (clip.transitionOut ? 1 : 0));
    }, 0);

    const avgElementDuration = duration > 0 ? Math.round(duration / Math.max(elements.length, 1)) : 0;

    return {
      totalElements: elements.length,
      totalClips: clips.length,
      totalTransitions,
      duration: Math.round(duration / 1000), // Convert to seconds
      elementsByType,
      avgElementDuration,
      selectedCount: selectedElementIds.length
    };
  }, [elements, clips, duration, selectedElementIds]);

  // Analyze transitions
  const transitionIssues = useMemo(() => {
    const issues: TransitionIssue[] = [];

    clips.forEach((clip, index) => {
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
    <div className="w-full h-full bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analysis Panel
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
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

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white mb-2">Element Breakdown</h4>
          {Object.entries(projectStats.elementsByType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-zinc-300">
                {elementIcons[type as keyof typeof elementIcons]}
                <span className="capitalize">{type}s</span>
              </div>
              <span className="text-white font-medium">{count}</span>
            </div>
          ))}
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