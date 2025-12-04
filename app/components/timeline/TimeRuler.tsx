'use client';

import { useCallback, useMemo } from 'react';
import { formatTime } from '../../lib/timeline/timeUtils';

interface TimeRulerProps {
  duration: number; // in seconds
  zoom: number; // pixels per second
  onSeek: (time: number) => void;
}

export function TimeRuler({ duration, zoom, onSeek }: TimeRulerProps) {
  // Calculate tick intervals based on zoom
  const { majorInterval, minorInterval } = useMemo(() => {
    // Adjust intervals based on zoom level
    if (zoom >= 200) {
      return { majorInterval: 1, minorInterval: 0.1 }; // 1s major, 100ms minor
    } else if (zoom >= 100) {
      return { majorInterval: 5, minorInterval: 1 }; // 5s major, 1s minor
    } else if (zoom >= 50) {
      return { majorInterval: 10, minorInterval: 5 }; // 10s major, 5s minor
    } else if (zoom >= 20) {
      return { majorInterval: 30, minorInterval: 10 }; // 30s major, 10s minor
    } else {
      return { majorInterval: 60, minorInterval: 30 }; // 60s major, 30s minor
    }
  }, [zoom]);

  // Generate tick marks
  const ticks = useMemo(() => {
    const majorTicks: Array<{ time: number; label: string }> = [];
    const minorTicks: number[] = [];

    for (let time = 0; time <= duration; time += minorInterval) {
      if (time % majorInterval === 0) {
        majorTicks.push({
          time,
          label: formatTime(time * 1000),
        });
      } else {
        minorTicks.push(time);
      }
    }

    return { majorTicks, minorTicks };
  }, [duration, majorInterval, minorInterval]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / zoom;
    onSeek(Math.max(0, Math.min(duration, time)));
  }, [zoom, duration, onSeek]);

  const width = duration * zoom;

  return (
    <div
      className="relative h-8 bg-gray-800 border-b border-gray-700 cursor-pointer select-none overflow-hidden"
      onClick={handleClick}
      style={{ width: `${width}px` }}
    >
      {/* Minor ticks */}
      {ticks.minorTicks.map((time) => (
        <div
          key={`minor-${time}`}
          className="absolute bottom-0 w-px h-2 bg-gray-600"
          style={{ left: `${time * zoom}px` }}
        />
      ))}

      {/* Major ticks and labels */}
      {ticks.majorTicks.map(({ time, label }) => (
        <div
          key={`major-${time}`}
          className="absolute bottom-0"
          style={{ left: `${time * zoom}px` }}
        >
          {/* Tick mark */}
          <div className="w-px h-4 bg-gray-400" />

          {/* Time label */}
          <div className="absolute top-0 left-1 text-xs text-gray-300 whitespace-nowrap">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
