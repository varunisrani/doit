'use client';

import { useCallback, useMemo } from 'react';
import { formatTime } from '../../lib/timeline/timeUtils';

interface TimeRulerProps {
  duration: number; // in seconds
  zoom: number; // pixels per second
  currentTime?: number; // in seconds - for preview line
  onSeek: (time: number) => void;
}

export function TimeRuler({ duration, zoom, currentTime = 0, onSeek }: TimeRulerProps) {
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
      className="relative h-10 cursor-pointer select-none overflow-hidden transition-colors duration-200 hover:bg-[var(--surface-hover)]"
      style={{
        width: `${width}px`,
        background: 'var(--surface)',
        borderBottom: `1px solid var(--border-primary)`,
      }}
      onClick={handleClick}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern
              id="ruler-grid"
              patternUnits="userSpaceOnUse"
              width={minorInterval * zoom}
              height="100%"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="var(--border-secondary)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ruler-grid)" />
        </svg>
      </div>

      {/* Minor ticks */}
      {ticks.minorTicks.map((time) => (
        <div
          key={`minor-${time}`}
          className="absolute bottom-0 opacity-40 transition-opacity duration-200 hover:opacity-60"
          style={{
            left: `${time * zoom}px`,
            width: '1px',
            height: '8px',
            background: 'var(--border-secondary)',
          }}
        />
      ))}

      {/* Major ticks and labels */}
      {ticks.majorTicks.map(({ time, label }) => (
        <div
          key={`major-${time}`}
          className="absolute bottom-0 transition-all duration-200 hover:scale-105"
          style={{ left: `${time * zoom}px` }}
        >
          {/* Tick mark with enhanced styling */}
          <div
            className="w-px transition-all duration-200 hover:opacity-80"
            style={{
              height: '16px',
              background: 'var(--ruler-text)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          />

          {/* Time label with modern typography */}
          <div
            className="absolute top-0 left-1.5 text-xs font-mono font-medium whitespace-nowrap transition-all duration-200"
            style={{
              color: 'var(--ruler-text)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              lineHeight: '40px', // Center vertically in the 40px height
            }}
          >
            {label}
          </div>

          {/* Hover indicator */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full opacity-0 transition-opacity duration-200"
            style={{
              background: 'var(--primary)',
            }}
          />
        </div>
      ))}

      {/* Seek preview line on hover */}
      <div
        className="absolute top-0 bottom-0 w-0.5 pointer-events-none opacity-0 transition-opacity duration-200"
        style={{
          left: `${currentTime * zoom}px`,
          background: 'var(--primary)',
          boxShadow: `0 0 8px var(--primary)60`,
        }}
      />
    </div>
  );
}
