// Keyboard Shortcuts

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Command key on Mac
  description: string;
  action: string;
  category: 'general' | 'edit' | 'timeline' | 'canvas' | 'playback' | 'tools';
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // General
  {
    key: 's',
    ctrl: true,
    description: 'Save project',
    action: 'save',
    category: 'general',
  },
  {
    key: 'o',
    ctrl: true,
    description: 'Open project',
    action: 'open',
    category: 'general',
  },
  {
    key: 'n',
    ctrl: true,
    description: 'New project',
    action: 'new',
    category: 'general',
  },
  {
    key: 'e',
    ctrl: true,
    shift: true,
    description: 'Export project',
    action: 'export',
    category: 'general',
  },
  {
    key: '/',
    ctrl: true,
    description: 'Show keyboard shortcuts',
    action: 'showShortcuts',
    category: 'general',
  },

  // Edit
  {
    key: 'z',
    ctrl: true,
    description: 'Undo',
    action: 'undo',
    category: 'edit',
  },
  {
    key: 'y',
    ctrl: true,
    description: 'Redo',
    action: 'redo',
    category: 'edit',
  },
  {
    key: 'z',
    ctrl: true,
    shift: true,
    description: 'Redo (alternative)',
    action: 'redo',
    category: 'edit',
  },
  {
    key: 'a',
    ctrl: true,
    description: 'Select all',
    action: 'selectAll',
    category: 'edit',
  },
  {
    key: 'c',
    ctrl: true,
    description: 'Copy',
    action: 'copy',
    category: 'edit',
  },
  {
    key: 'x',
    ctrl: true,
    description: 'Cut',
    action: 'cut',
    category: 'edit',
  },
  {
    key: 'v',
    ctrl: true,
    description: 'Paste',
    action: 'paste',
    category: 'edit',
  },
  {
    key: 'd',
    ctrl: true,
    description: 'Duplicate',
    action: 'duplicate',
    category: 'edit',
  },
  {
    key: 'Delete',
    description: 'Delete selection',
    action: 'delete',
    category: 'edit',
  },
  {
    key: 'Backspace',
    description: 'Delete selection',
    action: 'delete',
    category: 'edit',
  },

  // Canvas
  {
    key: '+',
    ctrl: true,
    description: 'Zoom in',
    action: 'zoomIn',
    category: 'canvas',
  },
  {
    key: '=',
    ctrl: true,
    description: 'Zoom in (alternative)',
    action: 'zoomIn',
    category: 'canvas',
  },
  {
    key: '-',
    ctrl: true,
    description: 'Zoom out',
    action: 'zoomOut',
    category: 'canvas',
  },
  {
    key: '0',
    ctrl: true,
    description: 'Fit to screen',
    action: 'fitToScreen',
    category: 'canvas',
  },
  {
    key: '1',
    ctrl: true,
    description: 'Actual size (100%)',
    action: 'actualSize',
    category: 'canvas',
  },
  {
    key: 'g',
    ctrl: true,
    description: 'Toggle grid',
    action: 'toggleGrid',
    category: 'canvas',
  },
  {
    key: ';',
    ctrl: true,
    description: 'Toggle guides',
    action: 'toggleGuides',
    category: 'canvas',
  },
  {
    key: "'",
    ctrl: true,
    description: 'Toggle snap to grid',
    action: 'toggleSnap',
    category: 'canvas',
  },

  // Timeline
  {
    key: ' ',
    description: 'Play/Pause',
    action: 'playPause',
    category: 'playback',
  },
  {
    key: 'ArrowLeft',
    description: 'Move playhead left (1 frame)',
    action: 'previousFrame',
    category: 'timeline',
  },
  {
    key: 'ArrowRight',
    description: 'Move playhead right (1 frame)',
    action: 'nextFrame',
    category: 'timeline',
  },
  {
    key: 'ArrowLeft',
    shift: true,
    description: 'Move playhead left (10 frames)',
    action: 'jumpBackward',
    category: 'timeline',
  },
  {
    key: 'ArrowRight',
    shift: true,
    description: 'Move playhead right (10 frames)',
    action: 'jumpForward',
    category: 'timeline',
  },
  {
    key: 'Home',
    description: 'Go to start',
    action: 'goToStart',
    category: 'timeline',
  },
  {
    key: 'End',
    description: 'Go to end',
    action: 'goToEnd',
    category: 'timeline',
  },
  {
    key: 's',
    description: 'Split clip at playhead',
    action: 'splitClip',
    category: 'timeline',
  },
  {
    key: 'i',
    description: 'Set in point',
    action: 'setInPoint',
    category: 'timeline',
  },
  {
    key: 'o',
    description: 'Set out point',
    action: 'setOutPoint',
    category: 'timeline',
  },
  {
    key: 'm',
    description: 'Add marker',
    action: 'addMarker',
    category: 'timeline',
  },

  // Tools
  {
    key: 'v',
    description: 'Select tool',
    action: 'selectTool',
    category: 'tools',
  },
  {
    key: 't',
    description: 'Text tool',
    action: 'textTool',
    category: 'tools',
  },
  {
    key: 'r',
    description: 'Shape tool',
    action: 'shapeTool',
    category: 'tools',
  },
  {
    key: 'c',
    description: 'Crop tool',
    action: 'cropTool',
    category: 'tools',
  },
  {
    key: 'h',
    description: 'Pan tool',
    action: 'panTool',
    category: 'tools',
  },
  {
    key: 'z',
    description: 'Zoom tool',
    action: 'zoomTool',
    category: 'tools',
  },

  // Layers
  {
    key: ']',
    ctrl: true,
    description: 'Bring forward',
    action: 'bringForward',
    category: 'canvas',
  },
  {
    key: '[',
    ctrl: true,
    description: 'Send backward',
    action: 'sendBackward',
    category: 'canvas',
  },
  {
    key: ']',
    ctrl: true,
    shift: true,
    description: 'Bring to front',
    action: 'bringToFront',
    category: 'canvas',
  },
  {
    key: '[',
    ctrl: true,
    shift: true,
    description: 'Send to back',
    action: 'sendToBack',
    category: 'canvas',
  },

  // Transform
  {
    key: 'ArrowUp',
    description: 'Move up (1px)',
    action: 'moveUp',
    category: 'canvas',
  },
  {
    key: 'ArrowDown',
    description: 'Move down (1px)',
    action: 'moveDown',
    category: 'canvas',
  },
  {
    key: 'ArrowLeft',
    description: 'Move left (1px)',
    action: 'moveLeft',
    category: 'canvas',
  },
  {
    key: 'ArrowRight',
    description: 'Move right (1px)',
    action: 'moveRight',
    category: 'canvas',
  },
  {
    key: 'ArrowUp',
    shift: true,
    description: 'Move up (10px)',
    action: 'moveUpLarge',
    category: 'canvas',
  },
  {
    key: 'ArrowDown',
    shift: true,
    description: 'Move down (10px)',
    action: 'moveDownLarge',
    category: 'canvas',
  },
  {
    key: 'ArrowLeft',
    shift: true,
    description: 'Move left (10px)',
    action: 'moveLeftLarge',
    category: 'canvas',
  },
  {
    key: 'ArrowRight',
    shift: true,
    description: 'Move right (10px)',
    action: 'moveRightLarge',
    category: 'canvas',
  },

  // Grouping
  {
    key: 'g',
    ctrl: true,
    description: 'Group selection',
    action: 'group',
    category: 'edit',
  },
  {
    key: 'g',
    ctrl: true,
    shift: true,
    description: 'Ungroup selection',
    action: 'ungroup',
    category: 'edit',
  },

  // Lock
  {
    key: 'l',
    ctrl: true,
    description: 'Lock/unlock selection',
    action: 'toggleLock',
    category: 'edit',
  },

  // Visibility
  {
    key: 'h',
    ctrl: true,
    description: 'Hide/show selection',
    action: 'toggleVisibility',
    category: 'edit',
  },
];

// Shortcut map for quick lookup
export const SHORTCUT_MAP = new Map<string, KeyboardShortcut>();

KEYBOARD_SHORTCUTS.forEach((shortcut) => {
  const key = createShortcutKey(shortcut);
  SHORTCUT_MAP.set(key, shortcut);
});

// Create a unique key from shortcut combination
export function createShortcutKey(shortcut: {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push('ctrl');
  if (shortcut.shift) parts.push('shift');
  if (shortcut.alt) parts.push('alt');
  if (shortcut.meta) parts.push('meta');

  parts.push(shortcut.key.toLowerCase());

  return parts.join('+');
}

// Check if keyboard event matches shortcut
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // On Mac, Cmd key is used instead of Ctrl
  const ctrlKey = isMac ? event.metaKey : event.ctrlKey;
  const metaKey = isMac ? event.ctrlKey : event.metaKey;

  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    !!event.shiftKey === !!shortcut.shift &&
    !!event.altKey === !!shortcut.alt &&
    !!ctrlKey === !!shortcut.ctrl &&
    !!metaKey === !!shortcut.meta
  );
}

// Get shortcut display text
export function getShortcutText(shortcut: KeyboardShortcut): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (shortcut.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (shortcut.meta) {
    parts.push(isMac ? 'Ctrl' : 'Win');
  }

  // Format key name
  let keyName = shortcut.key;
  if (keyName === ' ') {
    keyName = 'Space';
  } else if (keyName.length === 1) {
    keyName = keyName.toUpperCase();
  } else {
    // Capitalize first letter of special keys
    keyName = keyName.charAt(0).toUpperCase() + keyName.slice(1);
  }

  parts.push(keyName);

  return parts.join(isMac ? '' : '+');
}

// Group shortcuts by category
export const SHORTCUTS_BY_CATEGORY = KEYBOARD_SHORTCUTS.reduce((acc, shortcut) => {
  if (!acc[shortcut.category]) {
    acc[shortcut.category] = [];
  }
  acc[shortcut.category].push(shortcut);
  return acc;
}, {} as Record<string, KeyboardShortcut[]>);

// Category display names
export const CATEGORY_NAMES: Record<string, string> = {
  general: 'General',
  edit: 'Edit',
  timeline: 'Timeline',
  canvas: 'Canvas',
  playback: 'Playback',
  tools: 'Tools',
};
