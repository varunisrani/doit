# Keyframe Animation System - Visual Guide

This guide shows the visual layout and interactions of the keyframe system.

## Overall Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Video Editor - Keyframe Animation System                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    PREVIEW CANVAS                             │ │
│  │                                                                │ │
│  │    ┌──────────────┐                                           │ │
│  │    │  Animated    │ ◄── Elements with animations              │ │
│  │    │   Element    │                                           │ │
│  │    └──────────────┘                                           │ │
│  │                                                                │ │
│  │                         00:01.50 / 00:10.00  ◄── Time display │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ [Play] [Reset]  ━━━━━━━━━━━━━━━●━━━━━━━━━━━━  00:01.50       │ │
│  │                        Playback Controls                       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────┬─────────────────────────┐ │
│  │  KEYFRAME TIMELINE                  │   KEYFRAME EDITOR       │ │
│  │                                     │                         │ │
│  │  (Details below)                    │   (Details below)       │ │
│  │                                     │                         │ │
│  └─────────────────────────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Keyframe Timeline (Left Panel - 2/3 width)

```
┌──────────────────────────────────────────────────────────────────────┐
│ Keyframe Timeline                                                    │
│ Click on a track to add keyframe | Right-click to delete             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Position X  │ ◆─────────◆──────────────◆───────│  ◄── Track        │
│             │     ↑         ↑              ↑    │                   │
│             │  Keyframe  Selected      Keyframe │                   │
│             │                                   │                   │
│ Position Y  │ ◆──────────────────────◆──────────│                   │
│             │                                   │                   │
│ Width       │───────────────────────────────────│  ◄── No keyframes │
│             │                                   │                   │
│ Height      │─────────◆─────────────────────────│                   │
│             │                                   │                   │
│ Rotation    │ ◆─────────◆───────────◆───────────│                   │
│             │                                   │                   │
│ Scale X     │───────────────────────────────────│                   │
│             │                                   │                   │
│ Scale Y     │───────────────────────────────────│                   │
│             │                                   │                   │
│ Opacity     │ ◆──────────────────────────────◆──│                   │
│             │                                   │                   │
├──────────────────────────────────────────────────────────────────────┤
│ Time Ruler  │ 0s     1s     2s     3s     4s   │                   │
│             │ │      │      │      │      │     │                   │
│             │ ▼      ▼      ▼      ▼      ▼     │  ◄── Markers      │
├──────────────────────────────────────────────────────────────────────┤
│ Legend:                                                              │
│ ◆ Keyframe   ◆ Selected   │ Current Time                           │
└──────────────────────────────────────────────────────────────────────┘
```

### Diamond Colors
- **Purple (◆)**: Normal keyframe
- **Blue (◆)**: Selected keyframe
- Larger when selected or being dragged

### Current Time Indicator
```
│         ┊  ← Red vertical line
│    ◆    ┊    ◆
│         ┊
│    ◆    ┊
```

## Keyframe Editor (Right Panel - 1/3 width)

```
┌─────────────────────────────────┐
│  Keyframe Editor                │
├─────────────────────────────────┤
│                                 │
│  ▼ POSITION                     │ ◄── Expandable group
│     Position X          ◆       │
│     Current: 200px              │
│     [Remove Keyframe]           │
│                                 │
│     Position Y                  │
│     Current: 100px              │
│     [Add Keyframe]              │
│                                 │
│  ▼ SIZE                         │
│     Width                       │
│     Current: 300px              │
│     [Add Keyframe]              │
│                                 │
│     Height                      │
│     Current: 100px              │
│     [Add Keyframe]              │
│                                 │
│  ▼ TRANSFORM                    │
│     Rotation            ◆       │
│     Current: 45°                │
│     [Remove Keyframe]           │
│                                 │
│     Scale X                     │
│     Current: 1.00x              │
│     [Add Keyframe]              │
│                                 │
│     Scale Y                     │
│     Current: 1.00x              │
│     [Add Keyframe]              │
│                                 │
│     Opacity             ◆       │
│     Current: 100%               │
│     [Remove Keyframe]           │
│                                 │
├─────────────────────────────────┤
│  SELECTED KEYFRAME              │
├─────────────────────────────────┤
│  Property                       │
│  ┌───────────────────────────┐  │
│  │ Position X                │  │
│  └───────────────────────────┘  │
│                                 │
│  Time (ms)                      │
│  ┌───────────────────────────┐  │
│  │ 1500                      │  │
│  └───────────────────────────┘  │
│                                 │
│  Value px                       │
│  ┌───────────────────────────┐  │
│  │ 200                       │  │
│  └───────────────────────────┘  │
│                                 │
│  Easing Function                │
│  ┌───────────────────────────┐  │
│  │ Ease In Out (Quad)    ▼  │  │
│  └───────────────────────────┘  │
│                                 │
│  Easing Curve Preview           │
│  ┌───────────────────────────┐  │
│  │         ╱‾‾‾‾│            │  │
│  │        ╱     │            │  │
│  │    ╱‾‾       │            │  │
│  │ ╱‾‾          │            │  │
│  │──────────────┘            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Keyframe Diamond Tooltip

When hovering over a keyframe:

```
     ┌─────────────────┐
     │  00:01.500s     │  ◄── Time
     │  Value: 200px   │  ◄── Value
     │  Ease In Out    │  ◄── Easing
     └────────┬────────┘
              │
              ▼
              ◆  ◄── Keyframe diamond
```

## Easing Curve Preview

Visual representation of different easing functions:

```
Linear:               Ease In:             Ease Out:
┌────────┐           ┌────────┐           ┌────────┐
│       ╱│           │      ╱ │           │  ╱‾‾‾‾‾│
│      ╱ │           │    ╱   │           │ ╱      │
│     ╱  │           │  ╱     │           │╱       │
│    ╱   │           │╱       │           │        │
│   ╱    │           │        │           │        │
└────────┘           └────────┘           └────────┘

Ease In Out:         Elastic:             Bounce:
┌────────┐           ┌────────┐           ┌────────┐
│    ╱‾‾‾│           │ ╱‾╲╱‾╲ │           │ ╱╲ ╱╲  │
│   ╱    │           │╱      ╲│           │╱  ╲  ╲ │
│  ╱     │           │        │           │       ╲│
│ ╱      │           │        │           │        │
│╱       │           │        │           │        │
└────────┘           └────────┘           └────────┘
```

## Interaction States

### Adding Keyframe
```
1. Hover over track
   Position X  │───────[+]─────────────│  ◄── Crosshair cursor
               ↑
               Click position

2. Click
   Position X  │────────◆──────────────│  ◄── New keyframe added
                        ↑
                    New keyframe
```

### Moving Keyframe
```
1. Hover over diamond
   Position X  │────────◆──────────────│
                        ↑
                   Cursor changes

2. Drag
   Position X  │────────→──◆───────────│
                          ↑
                      Dragging

3. Release
   Position X  │─────────────◆─────────│
                            ↑
                       New position
```

### Deleting Keyframe
```
1. Right-click diamond
   ┌─────────────────┐
   │ Delete Keyframe │  ◄── Context menu
   └─────────────────┘
              ▼
              ◆

2. Click delete
   Position X  │──────────────────────│  ◄── Keyframe removed
```

## Color Coding

### Timeline
- **Background**: Dark gray (#1f2937)
- **Track Background**: Lighter when has keyframes
- **Hover**: Subtle highlight
- **Selected Property**: Highlighted background

### Keyframe Diamonds
- **Normal**: Purple (#8b5cf6)
- **Selected**: Blue (#3b82f6)
- **Hover**: Slightly larger
- **Dragging**: Much larger (scale 1.5x)

### Current Time
- **Line**: Red (#ef4444)
- **Always visible**: Spans all tracks

### Buttons
- **Add Keyframe**: Purple (#7c3aed)
- **Remove Keyframe**: Red (#dc2626)

## Responsive Behavior

### Desktop (>1024px)
```
┌────────────────────────┬──────────┐
│                        │          │
│     Timeline           │  Editor  │
│     (2 columns)        │(1 column)│
│                        │          │
└────────────────────────┴──────────┘
```

### Tablet (768px - 1024px)
```
┌────────────────────────┐
│      Timeline          │
│      (full width)      │
└────────────────────────┘
┌────────────────────────┐
│       Editor           │
│      (full width)      │
└────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────┐
│   Preview    │
└──────────────┘
┌──────────────┐
│   Controls   │
└──────────────┘
┌──────────────┐
│   Timeline   │
│  (scrollable)│
└──────────────┘
┌──────────────┐
│    Editor    │
│  (collapsed) │
└──────────────┘
```

## Zoom Levels

### 0.5x Zoom (Zoomed Out)
```
Position X  │◆───◆───────◆─────────◆──│  ◄── More timeline visible
            0s  2s      4s        6s
```

### 1.0x Zoom (Normal)
```
Position X  │ ◆ ──── ◆ ───────── ◆ ────│
            0s      1s         2s
```

### 2.0x Zoom (Zoomed In)
```
Position X  │  ◆  ────────  ◆  ─────────│  ◄── More precision
            0.0s          0.5s
```

## Animation Preview

### Timeline Playback Indicator
```
Time:  0ms        500ms      1000ms      1500ms
       │           │           │           │
Track: ◆───────────◆───────────◆───────────◆
       │     ▶     │           │           │
       ↑
    Playhead
```

### Real-time Value Display
```
Playing at 750ms:

Position X Track:
◆───────────◆
│     ●     │  ◄── Interpolated position (not a keyframe)
0ms   ↑   1000ms
    750ms

Current Value: 150px (interpolated between 100px and 200px)
```

## Property Groups

### Collapsed State
```
┌─────────────────────────────┐
│ ► POSITION                  │  ◄── Click to expand
├─────────────────────────────┤
│ ► SIZE                      │
├─────────────────────────────┤
│ ► TRANSFORM                 │
└─────────────────────────────┘
```

### Expanded State
```
┌─────────────────────────────┐
│ ▼ POSITION                  │
│   Position X         ◆      │
│   Current: 200px            │
│   [Remove Keyframe]         │
│                             │
│   Position Y                │
│   Current: 100px            │
│   [Add Keyframe]            │
├─────────────────────────────┤
│ ► SIZE                      │
├─────────────────────────────┤
│ ► TRANSFORM                 │
└─────────────────────────────┘
```

## User Flow Examples

### Example 1: Create Fade In Animation
```
1. Select "Opacity" property
2. Click at 0ms    → Creates keyframe with value 0
3. Click at 1000ms → Creates keyframe with value 1
4. Select first keyframe
5. Change easing to "Ease In"
6. Play to preview

Result:
Opacity │◆─────────────◆│
        0ms          1000ms
        0%    →      100%
        (Ease In)
```

### Example 2: Create Slide In Animation
```
1. Select "Position X" property
2. Click at 0ms    → Keyframe at x=-200px
3. Click at 800ms  → Keyframe at x=0px
4. Select first keyframe
5. Change easing to "Ease Out"
6. Play to preview

Result:
Position X │◆────────◆│
          0ms      800ms
         -200px → 0px
         (Ease Out)
```

### Example 3: Bouncing Animation
```
1. Select "Scale Y" property
2. Click at 0ms    → Keyframe at 0
3. Click at 1500ms → Keyframe at 1
4. Select first keyframe
5. Change easing to "Ease Out Bounce"
6. Play to preview

Result:
Scale Y │◆─────────────◆│
        0ms          1500ms
        0x  ↗↘↗↘↗  1x
        (Bounce Out)
```

## Keyboard Shortcuts (Recommended)

```
K             Add keyframe at current time for selected property
Delete        Delete selected keyframe
Space         Play/Pause
Home          Go to start (0ms)
End           Go to end (duration)
←/→           Move playhead -100ms/+100ms
Alt+←/Alt+→   Previous/Next keyframe
```

## Tips & Tricks

### Quick Animation Setup
1. Move playhead to start
2. Set initial values
3. Press K to add keyframes
4. Move playhead to end
5. Set final values
6. Press K to add keyframes
7. Adjust easing as needed

### Precise Timing
1. Use zoom to see more detail
2. Drag keyframes for fine-tuning
3. Or edit time value directly in editor

### Preview Techniques
1. Scrub playhead for step-by-step
2. Play for real-time preview
3. Loop playback to refine

This visual guide should help you understand how the keyframe system looks and works!
