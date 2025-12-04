# Keyboard Shortcuts Reference Card

## 🎹 Quick Reference for Video Editor

---

## Tool Switching

| Key | Tool | Description |
|-----|------|-------------|
| `V` | **Select Tool** | Select and move objects |
| `T` | **Text Tool** | Add and edit text |
| `S` | **Shape Tool** | Draw shapes |
| `H` | **Hand Tool** | Pan around canvas |
| `C` | **Crop Tool** | Crop video or images |
| `Z` | **Zoom Tool** | Zoom controls |

---

## Playback Control

| Shortcut | Action |
|----------|--------|
| `Space` | Play / Pause |

---

## Edit Operations

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Delete` | Delete | Remove selected element |
| `Backspace` | Delete | Remove selected element (alternative) |
| `Ctrl + C` | Copy | Copy selected element |
| `Ctrl + V` | Paste | Paste copied element |
| `Ctrl + X` | Cut | Cut selected element |
| `Escape` | Deselect | Clear selection |
| `Ctrl + A` | Select All | Select all elements |

---

## Undo / Redo

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + Y` | Redo (alternative) |

---

## File Operations

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save |

---

## Zoom Controls

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + +` | Zoom In | Increase zoom level |
| `Ctrl + -` | Zoom Out | Decrease zoom level |
| `Ctrl + 0` | Actual Size | Reset to 100% zoom |
| `Ctrl + 9` | Fit to Screen | Fit canvas to viewport |

---

## Pro Tips 💡

### 1. Tool Switching
Hold the tool key temporarily to use it, release to go back:
- Hold `Space` for Hand tool (pan)
- Hold `Z` for Zoom tool

### 2. Precision Editing
- Use `Ctrl + 0` to zoom to 100% for pixel-perfect editing
- Use arrow keys to nudge selected elements (when implemented)

### 3. Workflow
```
1. Press V to select
2. Press T to add text
3. Press S to add shapes
4. Press Ctrl+C to duplicate
5. Press Ctrl+S to save
```

### 4. Quick Canvas Navigation
```
1. Press H for Hand tool
2. Click and drag to pan
3. Press Ctrl+9 to fit to screen
4. Press V to go back to Select
```

---

## Smart Features

### Input Field Detection
Shortcuts are automatically disabled when typing in text fields, so you can:
- Type "V" in a text input without switching tools
- Use Ctrl+C in text fields to copy text (not elements)

### Modifier Keys
- `Ctrl` (Windows/Linux) or `Cmd` (Mac) for commands
- `Shift` with Ctrl+Z for Redo
- All shortcuts respect your OS conventions

---

## Customization

You can customize shortcuts by modifying `app/hooks/useKeyboard.ts`:

```typescript
useKeyboard({
  onToolChange: (tool) => setActiveTool(tool),
  onPlayPause: () => togglePlay(),
  onDelete: () => deleteSelected(),
  // Add your custom shortcuts here
});
```

---

## Cheat Sheet for Printing

```
┌─────────────────────────────────────────┐
│         VIDEO EDITOR SHORTCUTS          │
├─────────────────────────────────────────┤
│ TOOLS                                   │
│  V = Select   T = Text    S = Shape     │
│  H = Hand     C = Crop    Z = Zoom      │
├─────────────────────────────────────────┤
│ EDIT                                    │
│  Ctrl+C = Copy      Ctrl+V = Paste      │
│  Ctrl+X = Cut       Delete = Delete     │
│  Ctrl+Z = Undo      Ctrl+Y = Redo       │
│  Ctrl+A = All       Esc = Deselect      │
├─────────────────────────────────────────┤
│ ZOOM                                    │
│  Ctrl++ = In        Ctrl+- = Out        │
│  Ctrl+0 = 100%      Ctrl+9 = Fit        │
├─────────────────────────────────────────┤
│ PLAYBACK                                │
│  Space = Play/Pause                     │
└─────────────────────────────────────────┘
```

---

## Full Shortcut List by Category

### By Frequency of Use

#### Most Used
1. `V` - Select Tool
2. `Space` - Play/Pause
3. `Ctrl + Z` - Undo
4. `Delete` - Delete

#### Often Used
1. `T` - Text Tool
2. `S` - Shape Tool
3. `Ctrl + C` - Copy
4. `Ctrl + V` - Paste

#### Occasionally Used
1. `H` - Hand Tool
2. `C` - Crop Tool
3. `Z` - Zoom Tool
4. `Ctrl + S` - Save

#### Power User
1. `Ctrl + 9` - Fit to Screen
2. `Ctrl + 0` - Actual Size
3. `Ctrl + Shift + Z` - Redo
4. `Ctrl + A` - Select All

---

## Learning Path

### Day 1: Essential
```
V - Select
T - Text
S - Shape
Space - Play/Pause
```

### Day 2: Editing
```
Delete - Remove
Ctrl+C - Copy
Ctrl+V - Paste
Ctrl+Z - Undo
```

### Day 3: Navigation
```
Z - Zoom
H - Hand
Ctrl+0 - Actual Size
Ctrl+9 - Fit to Screen
```

### Week 2: Advanced
```
C - Crop
Ctrl+X - Cut
Ctrl+Y - Redo
Ctrl+A - Select All
Escape - Deselect
```

---

## Keyboard Layout Reference

```
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───────┐
│Esc│   │   │   │   │   │   │   │   │ 9 │ 0 │ - │ + │ Back  │
│   │   │   │   │   │   │   │   │   │Fit│100│Out│ In│ space │
├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─────┤
│     │   │   │   │   │ T │ Y │   │   │   │   │   │   │     │
│     │   │   │   │   │Txt│Rdo│   │   │   │   │   │   │     │
├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤
│ Caps │ A │ S │   │   │   │ H │   │   │   │   │   │        │
│      │All│Shp│   │   │   │Hnd│   │   │   │   │   │        │
├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────────┤
│        │ Z │ X │ C │ V │   │   │   │   │   │   │          │
│        │Undo│Cut│Crp│Sel│   │   │   │   │   │   │          │
├────┬───┴┬──┴─┬─┴───┴───┴───┴───┴───┴──┬┴───┼───┴┬────┬────┤
│Ctrl│Win │ Alt│                        │AltG│ Win│Menu│Ctrl│
└────┴────┴────┴────────────────────────┴────┴────┴────┴────┘
                     Space = Play/Pause
```

---

## Platform-Specific Notes

### Windows / Linux
- Use `Ctrl` for all shortcuts
- Use `Delete` or `Backspace` to delete

### macOS
- Use `Cmd` instead of `Ctrl`
- Use `Delete` (fn + Backspace on some keyboards)

---

## Accessibility

### For Users with Disabilities
- All features accessible via mouse
- Tooltips provide visual feedback
- Large click targets
- High contrast dark theme

### For Touchscreen Users
- Tap to select tools
- Long press for context menus (when implemented)
- Pinch to zoom (when implemented)

---

## Troubleshooting

### Shortcuts Not Working?
1. ✅ Make sure you're not typing in a text field
2. ✅ Check if shortcuts are disabled in settings
3. ✅ Verify your keyboard layout matches (QWERTY assumed)
4. ✅ Try clicking the canvas first to focus it

### Wrong Tool Activating?
1. ✅ Check keyboard layout (AZERTY users: V becomes W, etc.)
2. ✅ Disable browser extensions that may intercept keys
3. ✅ Use toolbar buttons as alternative

---

## Print-Friendly Version

Cut along the dotted line:

```
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄

    VIDEO EDITOR - QUICK REFERENCE

    TOOLS            EDIT
    V = Select       Ctrl+C = Copy
    T = Text         Ctrl+V = Paste
    S = Shape        Ctrl+X = Cut
    H = Hand         Ctrl+Z = Undo
    C = Crop         Delete = Delete
    Z = Zoom
                     ZOOM
    PLAYBACK         Ctrl++ = In
    Space = Play     Ctrl+- = Out
                     Ctrl+0 = 100%

┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
```

---

## Export This Reference

Save this file for offline use:
```bash
# Print to PDF
# Open this file in browser and print to PDF

# Or save as text
cat KEYBOARD_SHORTCUTS_REFERENCE.md > shortcuts.txt
```

---

## Updates

This reference is for **Phase 6** implementation.

Last updated: 2024
Version: 1.0

For the latest version, check the project documentation.

---

**Remember:** Shortcuts make you faster! Practice daily to build muscle memory. 🚀
