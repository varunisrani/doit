import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export type TrackType = 'video' | 'audio' | 'text';

export interface Clip {
  id: string;
  trackId: string;
  assetId?: string; // Reference to asset in editorStore
  type: 'video' | 'audio' | 'text' | 'image';
  name: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  trimStart?: number; // trim from start of source
  trimEnd?: number; // trim from end of source
  volume?: number; // 0-1, for audio/video
  opacity?: number; // 0-1
  position?: { x: number; y: number }; // for positioning on canvas
  scale?: { x: number; y: number };
  rotation?: number; // in degrees
  text?: string; // for text clips
  textStyle?: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor?: string;
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
  };
  effects?: any[]; // Can be expanded later
  locked?: boolean;
  muted?: boolean;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: Clip[];
  locked?: boolean;
  muted?: boolean;
  solo?: boolean;
  visible?: boolean;
  height?: number; // track height in pixels
  order: number; // for track ordering
}

interface TimelineState {
  // Timeline state
  tracks: Track[];
  currentTime: number; // playhead position in seconds
  duration: number; // total timeline duration
  zoom: number; // pixels per second
  scrollLeft: number; // horizontal scroll position
  isPlaying: boolean;
  loop: boolean;
  snapToGrid: boolean;
  gridSize: number; // in seconds

  // Playback actions
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;
  setLoop: (loop: boolean) => void;

  // Timeline view actions
  setZoom: (zoom: number) => void;
  setScrollLeft: (scrollLeft: number) => void;
  setDuration: (duration: number) => void;
  setSnapToGrid: (snap: boolean) => void;
  setGridSize: (size: number) => void;

  // Track actions
  addTrack: (track: Omit<Track, 'id' | 'clips' | 'order'>) => string;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  reorderTracks: (trackIds: string[]) => void;
  duplicateTrack: (trackId: string) => void;
  toggleTrackMute: (trackId: string) => void;
  toggleTrackSolo: (trackId: string) => void;
  toggleTrackVisibility: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;

  // Clip actions
  addClip: (trackId: string, clip: Omit<Clip, 'id' | 'trackId'>) => string;
  removeClip: (clipId: string) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  moveClip: (clipId: string, newTrackId: string, newStartTime: number) => void;
  duplicateClip: (clipId: string) => void;
  splitClip: (clipId: string, splitTime: number) => void;
  trimClip: (clipId: string, trimStart?: number, trimEnd?: number) => void;
  toggleClipMute: (clipId: string) => void;
  toggleClipLock: (clipId: string) => void;

  // Bulk actions
  removeClips: (clipIds: string[]) => void;
  clearTimeline: () => void;
  setTracks: (tracks: Track[]) => void;

  // Utility
  getClipById: (clipId: string) => Clip | undefined;
  getTrackById: (trackId: string) => Track | undefined;
  getClipsByTrack: (trackId: string) => Clip[];
  getClipsAtTime: (time: number) => Clip[];
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      tracks: [],
      currentTime: 0,
      duration: 60,
      zoom: 100, // 100 pixels per second
      scrollLeft: 0,
      isPlaying: false,
      loop: false,
      snapToGrid: true,
      gridSize: 0.1, // 0.1 seconds

      // Playback actions
      setCurrentTime: (time) =>
        set((state) => {
          state.currentTime = Math.max(0, Math.min(state.duration, time));
        }),

      play: () =>
        set((state) => {
          state.isPlaying = true;
        }),

      pause: () =>
        set((state) => {
          state.isPlaying = false;
        }),

      togglePlay: () =>
        set((state) => {
          state.isPlaying = !state.isPlaying;
        }),

      stop: () =>
        set((state) => {
          state.isPlaying = false;
          state.currentTime = 0;
        }),

      setLoop: (loop) =>
        set((state) => {
          state.loop = loop;
        }),

      // Timeline view actions
      setZoom: (zoom) =>
        set((state) => {
          state.zoom = Math.max(10, Math.min(1000, zoom));
        }),

      setScrollLeft: (scrollLeft) =>
        set((state) => {
          state.scrollLeft = Math.max(0, scrollLeft);
        }),

      setDuration: (duration) =>
        set((state) => {
          state.duration = Math.max(1, duration);
        }),

      setSnapToGrid: (snap) =>
        set((state) => {
          state.snapToGrid = snap;
        }),

      setGridSize: (size) =>
        set((state) => {
          state.gridSize = Math.max(0.01, size);
        }),

      // Track actions
      addTrack: (track) => {
        const trackId = crypto.randomUUID();
        set((state) => {
          const newTrack: Track = {
            ...track,
            id: trackId,
            clips: [],
            order: state.tracks.length,
            visible: track.visible ?? true,
            height: track.height ?? 60,
          };
          state.tracks.push(newTrack);
        });
        return trackId;
      },

      removeTrack: (trackId) =>
        set((state) => {
          state.tracks = state.tracks.filter((track) => track.id !== trackId);
          // Reorder remaining tracks
          state.tracks.forEach((track, index) => {
            track.order = index;
          });
        }),

      updateTrack: (trackId, updates) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            Object.assign(track, updates);
          }
        }),

      reorderTracks: (trackIds) =>
        set((state) => {
          const trackMap = new Map(state.tracks.map((t) => [t.id, t]));
          state.tracks = trackIds
            .map((id) => trackMap.get(id))
            .filter(Boolean) as Track[];
          state.tracks.forEach((track, index) => {
            track.order = index;
          });
        }),

      duplicateTrack: (trackId) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            const newTrack: Track = {
              ...track,
              id: crypto.randomUUID(),
              name: `${track.name} (Copy)`,
              order: state.tracks.length,
              clips: track.clips.map((clip) => ({
                ...clip,
                id: crypto.randomUUID(),
              })),
            };
            state.tracks.push(newTrack);
          }
        }),

      toggleTrackMute: (trackId) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            track.muted = !track.muted;
          }
        }),

      toggleTrackSolo: (trackId) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            track.solo = !track.solo;
          }
        }),

      toggleTrackVisibility: (trackId) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            track.visible = !track.visible;
          }
        }),

      toggleTrackLock: (trackId) =>
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            track.locked = !track.locked;
          }
        }),

      // Clip actions
      addClip: (trackId, clip) => {
        const clipId = crypto.randomUUID();
        set((state) => {
          const track = state.tracks.find((t) => t.id === trackId);
          if (track) {
            const newClip: Clip = {
              ...clip,
              id: clipId,
              trackId,
            };
            track.clips.push(newClip);

            // Update duration if needed
            const clipEndTime = newClip.startTime + newClip.duration;
            if (clipEndTime > state.duration) {
              state.duration = clipEndTime;
            }
          }
        });
        return clipId;
      },

      removeClip: (clipId) =>
        set((state) => {
          for (const track of state.tracks) {
            track.clips = track.clips.filter((clip) => clip.id !== clipId);
          }
        }),

      updateClip: (clipId, updates) =>
        set((state) => {
          for (const track of state.tracks) {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
              Object.assign(clip, updates);

              // Update duration if needed
              const clipEndTime = clip.startTime + clip.duration;
              if (clipEndTime > state.duration) {
                state.duration = clipEndTime;
              }
              break;
            }
          }
        }),

      moveClip: (clipId, newTrackId, newStartTime) =>
        set((state) => {
          let clipToMove: Clip | undefined;

          // Find and remove clip from current track
          for (const track of state.tracks) {
            const clipIndex = track.clips.findIndex((c) => c.id === clipId);
            if (clipIndex !== -1) {
              clipToMove = track.clips[clipIndex];
              track.clips.splice(clipIndex, 1);
              break;
            }
          }

          // Add to new track
          if (clipToMove) {
            const newTrack = state.tracks.find((t) => t.id === newTrackId);
            if (newTrack) {
              clipToMove.trackId = newTrackId;
              clipToMove.startTime = Math.max(0, newStartTime);
              newTrack.clips.push(clipToMove);

              // Update duration if needed
              const clipEndTime = clipToMove.startTime + clipToMove.duration;
              if (clipEndTime > state.duration) {
                state.duration = clipEndTime;
              }
            }
          }
        }),

      duplicateClip: (clipId) =>
        set((state) => {
          for (const track of state.tracks) {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
              const newClip: Clip = {
                ...clip,
                id: crypto.randomUUID(),
                startTime: clip.startTime + clip.duration,
              };
              track.clips.push(newClip);

              // Update duration if needed
              const clipEndTime = newClip.startTime + newClip.duration;
              if (clipEndTime > state.duration) {
                state.duration = clipEndTime;
              }
              break;
            }
          }
        }),

      splitClip: (clipId, splitTime) =>
        set((state) => {
          for (const track of state.tracks) {
            const clipIndex = track.clips.findIndex((c) => c.id === clipId);
            if (clipIndex !== -1) {
              const clip = track.clips[clipIndex];
              const relativeTime = splitTime - clip.startTime;

              if (relativeTime > 0 && relativeTime < clip.duration) {
                // Create second part
                const secondPart: Clip = {
                  ...clip,
                  id: crypto.randomUUID(),
                  startTime: splitTime,
                  duration: clip.duration - relativeTime,
                  trimStart: (clip.trimStart || 0) + relativeTime,
                };

                // Update first part
                clip.duration = relativeTime;
                if (clip.trimEnd) {
                  clip.trimEnd += clip.duration - relativeTime;
                }

                // Add second part
                track.clips.push(secondPart);
              }
              break;
            }
          }
        }),

      trimClip: (clipId, trimStart, trimEnd) =>
        set((state) => {
          for (const track of state.tracks) {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
              if (trimStart !== undefined) {
                clip.trimStart = Math.max(0, trimStart);
              }
              if (trimEnd !== undefined) {
                clip.trimEnd = Math.max(0, trimEnd);
              }
              break;
            }
          }
        }),

      toggleClipMute: (clipId) =>
        set((state) => {
          for (const track of state.tracks) {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
              clip.muted = !clip.muted;
              break;
            }
          }
        }),

      toggleClipLock: (clipId) =>
        set((state) => {
          for (const track of state.tracks) {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
              clip.locked = !clip.locked;
              break;
            }
          }
        }),

      // Bulk actions
      removeClips: (clipIds) =>
        set((state) => {
          const clipIdSet = new Set(clipIds);
          for (const track of state.tracks) {
            track.clips = track.clips.filter((clip) => !clipIdSet.has(clip.id));
          }
        }),

      clearTimeline: () =>
        set((state) => {
          state.tracks = [];
          state.currentTime = 0;
        }),

      setTracks: (tracks) =>
        set((state) => {
          state.tracks = tracks;
        }),

      // Utility
      getClipById: (clipId) => {
        const state = get();
        for (const track of state.tracks) {
          const clip = track.clips.find((c) => c.id === clipId);
          if (clip) return clip;
        }
        return undefined;
      },

      getTrackById: (trackId) => {
        const state = get();
        return state.tracks.find((t) => t.id === trackId);
      },

      getClipsByTrack: (trackId) => {
        const state = get();
        const track = state.tracks.find((t) => t.id === trackId);
        return track?.clips || [];
      },

      getClipsAtTime: (time) => {
        const state = get();
        const clipsAtTime: Clip[] = [];
        for (const track of state.tracks) {
          for (const clip of track.clips) {
            if (time >= clip.startTime && time < clip.startTime + clip.duration) {
              clipsAtTime.push(clip);
            }
          }
        }
        return clipsAtTime;
      },
    })),
    {
      name: 'video-editor-timeline',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tracks: state.tracks,
        duration: state.duration,
        zoom: state.zoom,
        loop: state.loop,
        snapToGrid: state.snapToGrid,
        gridSize: state.gridSize,
      }),
    }
  )
);
