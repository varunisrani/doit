// Export Presets and Configurations

import type { ExportPreset, ProjectTemplate } from '../types/project';
import type { AnimationPreset, TransitionPreset, FilterPreset } from '../types/effects';

// Export Resolution Presets
export const RESOLUTION_PRESETS = {
  '480p': { width: 854, height: 480, label: '480p (SD)', aspectRatio: '16:9' },
  '720p': { width: 1280, height: 720, label: '720p (HD)', aspectRatio: '16:9' },
  '1080p': { width: 1920, height: 1080, label: '1080p (Full HD)', aspectRatio: '16:9' },
  '1440p': { width: 2560, height: 1440, label: '1440p (2K)', aspectRatio: '16:9' },
  '4K': { width: 3840, height: 2160, label: '4K (Ultra HD)', aspectRatio: '16:9' },
} as const;

// Export Quality Presets
export const QUALITY_PRESETS = {
  low: {
    label: 'Low',
    bitrate: 1000000, // 1 Mbps
    description: 'Smaller file size, lower quality',
  },
  medium: {
    label: 'Medium',
    bitrate: 5000000, // 5 Mbps
    description: 'Balanced size and quality',
  },
  high: {
    label: 'High',
    bitrate: 10000000, // 10 Mbps
    description: 'Larger file size, higher quality',
  },
  ultra: {
    label: 'Ultra',
    bitrate: 20000000, // 20 Mbps
    description: 'Largest file size, best quality',
  },
} as const;

// Export Format Presets
export const EXPORT_PRESETS: ExportPreset[] = [
  // Web
  {
    id: 'web-1080p',
    name: 'Web 1080p',
    description: 'Optimized for web streaming (1920x1080)',
    format: 'mp4',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'high',
      codec: 'h264',
      bitrate: 8000000,
      audioEnabled: true,
      audioBitrate: 192000,
      audioSampleRate: 48000,
    },
    category: 'web',
  },
  {
    id: 'web-720p',
    name: 'Web 720p',
    description: 'Optimized for web streaming (1280x720)',
    format: 'mp4',
    settings: {
      resolution: '720p',
      fps: 30,
      quality: 'medium',
      codec: 'h264',
      bitrate: 5000000,
      audioEnabled: true,
      audioBitrate: 128000,
      audioSampleRate: 48000,
    },
    category: 'web',
  },

  // Social Media
  {
    id: 'youtube-1080p',
    name: 'YouTube 1080p',
    description: 'YouTube recommended settings (1920x1080)',
    format: 'mp4',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'high',
      codec: 'h264',
      bitrate: 8000000,
      audioEnabled: true,
      audioBitrate: 192000,
      audioSampleRate: 48000,
    },
    category: 'social',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: 'Instagram Story format (1080x1920)',
    format: 'mp4',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'high',
      codec: 'h264',
      bitrate: 5000000,
      audioEnabled: true,
      audioBitrate: 128000,
      audioSampleRate: 44100,
    },
    category: 'social',
  },
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    description: 'Instagram square post (1080x1080)',
    format: 'mp4',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'high',
      codec: 'h264',
      bitrate: 5000000,
      audioEnabled: true,
      audioBitrate: 128000,
      audioSampleRate: 44100,
    },
    category: 'social',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'TikTok format (1080x1920)',
    format: 'mp4',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'high',
      codec: 'h264',
      bitrate: 5000000,
      audioEnabled: true,
      audioBitrate: 128000,
      audioSampleRate: 44100,
    },
    category: 'social',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Twitter video (1280x720)',
    format: 'mp4',
    settings: {
      resolution: '720p',
      fps: 30,
      quality: 'medium',
      codec: 'h264',
      bitrate: 5000000,
      audioEnabled: true,
      audioBitrate: 128000,
      audioSampleRate: 44100,
    },
    category: 'social',
  },

  // Broadcast
  {
    id: 'broadcast-4k',
    name: 'Broadcast 4K',
    description: 'Professional 4K broadcast quality',
    format: 'mp4',
    settings: {
      resolution: '4K',
      fps: 30,
      quality: 'ultra',
      codec: 'h264',
      bitrate: 20000000,
      audioEnabled: true,
      audioBitrate: 320000,
      audioSampleRate: 48000,
    },
    category: 'broadcast',
  },
  {
    id: 'broadcast-1080p',
    name: 'Broadcast 1080p',
    description: 'Professional Full HD broadcast quality',
    format: 'mp4',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'ultra',
      codec: 'h264',
      bitrate: 15000000,
      audioEnabled: true,
      audioBitrate: 256000,
      audioSampleRate: 48000,
    },
    category: 'broadcast',
  },

  // GIF
  {
    id: 'gif-high',
    name: 'Animated GIF',
    description: 'High quality animated GIF',
    format: 'gif',
    settings: {
      resolution: '720p',
      fps: 24,
      quality: 'high',
      audioEnabled: false,
    },
    category: 'custom',
  },

  // WebM
  {
    id: 'webm-1080p',
    name: 'WebM 1080p',
    description: 'WebM format for web (1920x1080)',
    format: 'webm',
    settings: {
      resolution: '1080p',
      fps: 30,
      quality: 'high',
      codec: 'vp9',
      bitrate: 8000000,
      audioEnabled: true,
      audioBitrate: 192000,
      audioSampleRate: 48000,
    },
    category: 'web',
  },
];

// Project Templates
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'youtube-landscape',
    name: 'YouTube Landscape',
    description: 'Standard YouTube video (16:9)',
    thumbnail: '/templates/youtube-landscape.jpg',
    category: 'youtube',
    settings: {
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 60000,
      backgroundColor: '#000000',
      aspectRatio: '16:9',
    },
    presetTracks: 5,
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: 'Vertical Instagram Story (9:16)',
    thumbnail: '/templates/instagram-story.jpg',
    category: 'social',
    settings: {
      width: 1080,
      height: 1920,
      fps: 30,
      duration: 15000,
      backgroundColor: '#000000',
      aspectRatio: '9:16',
    },
    presetTracks: 4,
  },
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    description: 'Square Instagram post (1:1)',
    thumbnail: '/templates/instagram-post.jpg',
    category: 'social',
    settings: {
      width: 1080,
      height: 1080,
      fps: 30,
      duration: 30000,
      backgroundColor: '#000000',
      aspectRatio: '1:1',
    },
    presetTracks: 4,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Vertical TikTok video (9:16)',
    thumbnail: '/templates/tiktok.jpg',
    category: 'social',
    settings: {
      width: 1080,
      height: 1920,
      fps: 30,
      duration: 60000,
      backgroundColor: '#000000',
      aspectRatio: '9:16',
    },
    presetTracks: 4,
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Standard presentation (16:9)',
    thumbnail: '/templates/presentation.jpg',
    category: 'presentation',
    settings: {
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 300000,
      backgroundColor: '#ffffff',
      aspectRatio: '16:9',
    },
    presetTracks: 3,
  },
];

// Animation Presets
export const ANIMATION_PRESETS: AnimationPreset[] = [
  // Entrance Animations
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    description: 'Fade element in from transparent',
    defaultDuration: 500,
    keyframes: [
      { time: 0, property: 'opacity', value: 0, easing: 'easeOut' },
      { time: 500, property: 'opacity', value: 1, easing: 'easeOut' },
    ],
  },
  {
    id: 'slide-in-left',
    name: 'Slide In Left',
    category: 'entrance',
    description: 'Slide element in from the left',
    defaultDuration: 500,
    keyframes: [
      { time: 0, property: 'x', value: -100, easing: 'easeOut' },
      { time: 500, property: 'x', value: 0, easing: 'easeOut' },
      { time: 0, property: 'opacity', value: 0, easing: 'easeOut' },
      { time: 500, property: 'opacity', value: 1, easing: 'easeOut' },
    ],
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    category: 'entrance',
    description: 'Scale element from small to normal',
    defaultDuration: 500,
    keyframes: [
      { time: 0, property: 'scaleX', value: 0, easing: 'easeOut' },
      { time: 500, property: 'scaleX', value: 1, easing: 'easeOut' },
      { time: 0, property: 'scaleY', value: 0, easing: 'easeOut' },
      { time: 500, property: 'scaleY', value: 1, easing: 'easeOut' },
      { time: 0, property: 'opacity', value: 0, easing: 'easeOut' },
      { time: 500, property: 'opacity', value: 1, easing: 'easeOut' },
    ],
  },

  // Exit Animations
  {
    id: 'fade-out',
    name: 'Fade Out',
    category: 'exit',
    description: 'Fade element out to transparent',
    defaultDuration: 500,
    keyframes: [
      { time: 0, property: 'opacity', value: 1, easing: 'easeIn' },
      { time: 500, property: 'opacity', value: 0, easing: 'easeIn' },
    ],
  },
  {
    id: 'slide-out-right',
    name: 'Slide Out Right',
    category: 'exit',
    description: 'Slide element out to the right',
    defaultDuration: 500,
    keyframes: [
      { time: 0, property: 'x', value: 0, easing: 'easeIn' },
      { time: 500, property: 'x', value: 100, easing: 'easeIn' },
      { time: 0, property: 'opacity', value: 1, easing: 'easeIn' },
      { time: 500, property: 'opacity', value: 0, easing: 'easeIn' },
    ],
  },

  // Emphasis Animations
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'emphasis',
    description: 'Scale element in and out',
    defaultDuration: 1000,
    keyframes: [
      { time: 0, property: 'scaleX', value: 1, easing: 'easeInOut' },
      { time: 500, property: 'scaleX', value: 1.1, easing: 'easeInOut' },
      { time: 1000, property: 'scaleX', value: 1, easing: 'easeInOut' },
      { time: 0, property: 'scaleY', value: 1, easing: 'easeInOut' },
      { time: 500, property: 'scaleY', value: 1.1, easing: 'easeInOut' },
      { time: 1000, property: 'scaleY', value: 1, easing: 'easeInOut' },
    ],
  },
  {
    id: 'shake',
    name: 'Shake',
    category: 'emphasis',
    description: 'Shake element horizontally',
    defaultDuration: 500,
    keyframes: [
      { time: 0, property: 'x', value: 0, easing: 'linear' },
      { time: 100, property: 'x', value: -10, easing: 'linear' },
      { time: 200, property: 'x', value: 10, easing: 'linear' },
      { time: 300, property: 'x', value: -10, easing: 'linear' },
      { time: 400, property: 'x', value: 10, easing: 'linear' },
      { time: 500, property: 'x', value: 0, easing: 'linear' },
    ],
  },
];

// Transition Presets
export const TRANSITION_PRESETS: TransitionPreset[] = [
  {
    id: 'fade',
    name: 'Fade',
    type: 'fade',
    description: 'Smooth fade between clips',
    defaultDuration: 500,
    category: 'basic',
  },
  {
    id: 'dissolve',
    name: 'Dissolve',
    type: 'dissolve',
    description: 'Cross-dissolve between clips',
    defaultDuration: 500,
    category: 'basic',
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    type: 'slide-left',
    description: 'Slide new clip from right',
    defaultDuration: 500,
    category: 'slide',
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    type: 'slide-right',
    description: 'Slide new clip from left',
    defaultDuration: 500,
    category: 'slide',
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    type: 'zoom-in',
    description: 'Zoom into new clip',
    defaultDuration: 500,
    category: 'zoom',
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    type: 'zoom-out',
    description: 'Zoom out from old clip',
    defaultDuration: 500,
    category: 'zoom',
  },
  {
    id: 'wipe-left',
    name: 'Wipe Left',
    type: 'wipe-left',
    description: 'Wipe to reveal new clip',
    defaultDuration: 500,
    category: 'wipe',
  },
];

// Filter Presets
export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Boost colors and saturation',
    category: 'color',
    filters: [
      { type: 'saturation', enabled: true, intensity: 1.3 },
      { type: 'contrast', enabled: true, intensity: 1.1 },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic vintage look',
    category: 'vintage',
    filters: [
      { type: 'sepia', enabled: true, intensity: 0.5 },
      { type: 'contrast', enabled: true, intensity: 0.9 },
      { type: 'vignette', enabled: true, intensity: 0.7 },
    ],
  },
  {
    id: 'black-white',
    name: 'Black & White',
    description: 'Classic black and white',
    category: 'artistic',
    filters: [
      { type: 'grayscale', enabled: true, intensity: 1 },
      { type: 'contrast', enabled: true, intensity: 1.2 },
    ],
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Film-like color grading',
    category: 'cinematic',
    filters: [
      { type: 'contrast', enabled: true, intensity: 1.2 },
      { type: 'saturation', enabled: true, intensity: 0.9 },
      { type: 'vignette', enabled: true, intensity: 0.5 },
    ],
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Warm color temperature',
    category: 'color',
    filters: [
      { type: 'temperature', enabled: true, intensity: 1.2 },
      { type: 'saturation', enabled: true, intensity: 1.1 },
    ],
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Cool color temperature',
    category: 'color',
    filters: [
      { type: 'temperature', enabled: true, intensity: 0.8 },
      { type: 'tint', enabled: true, intensity: 1.1 },
    ],
  },
  {
    id: 'soft-blur',
    name: 'Soft Blur',
    description: 'Gentle blur effect',
    category: 'blur',
    filters: [
      { type: 'blur', enabled: true, intensity: 0.3 },
      { type: 'brightness', enabled: true, intensity: 1.05 },
    ],
  },
];

// Codec Options
export const CODEC_OPTIONS = {
  mp4: [
    { value: 'h264', label: 'H.264 (Recommended)', description: 'Best compatibility' },
    { value: 'h265', label: 'H.265/HEVC', description: 'Better compression' },
  ],
  webm: [
    { value: 'vp8', label: 'VP8', description: 'Good compatibility' },
    { value: 'vp9', label: 'VP9 (Recommended)', description: 'Better compression' },
  ],
} as const;

// Audio Settings
export const AUDIO_BITRATE_OPTIONS = [64000, 96000, 128000, 192000, 256000, 320000] as const;
export const AUDIO_SAMPLE_RATES = [44100, 48000, 96000] as const;
