/**
 * Import verification test
 * This file verifies all playback system exports are working correctly
 */

// Test hook exports
import { usePlayback, PLAYBACK_SPEEDS } from '@/app/hooks/usePlayback';
import type { PlaybackSpeed, UsePlaybackOptions } from '@/app/hooks/usePlayback';

// Test component exports
import { PlaybackControls, PlaybackDemo } from '@/app/components/playback';
import type { PlaybackControlsProps } from '@/app/components/playback';

// Test re-exports from hooks index
import { usePlayback as usePlaybackReexport } from '@/app/hooks';

// Verify types
const speed: PlaybackSpeed = { value: 1, label: '1x' };
const options: UsePlaybackOptions = {
  onRender: (time) => console.log(time),
};
const props: PlaybackControlsProps = {
  showFrameStep: true,
};

// Verify constants
console.log('Available speeds:', PLAYBACK_SPEEDS);

// If this file compiles without errors, all imports are working!
export const IMPORTS_VERIFIED = true;
