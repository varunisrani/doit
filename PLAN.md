# White UI Conversion - Complete Dark/Black UI Removal Plan

## Executive Summary

This plan addresses the complete removal of all dark/black UI elements from the video editor application to achieve a pure white UI theme across ALL pages. The analysis identified 40+ instances of dark styling remnants across 20+ files including backdrop overlays, shadow values, component defaults, and template settings. The implementation follows a systematic approach to convert all dark elements while maintaining accessibility and visual consistency.

---

## 1. Problem Analysis

### 1.1 Problem Statement

The application currently has residual dark/black UI elements despite having a white-first design system. These remnants include:
- Dark backdrop overlays (30% black opacity)
- Dark shadow values (0.4-0.7 opacity)
- Black background defaults in project templates and stores
- Dark badge backgrounds on media items
- Dark overlays on locked tracks and transition previews

### 1.2 Root Cause Analysis (5 Whys)

1. **Why does dark UI still appear?** → Dark values exist in multiple locations beyond CSS variables
2. **Why are dark values in multiple places?** → Default values in TypeScript constants, stores, and templates use hardcoded black colors
3. **Why are hardcoded values used?** → Initial implementation favored dark backgrounds for video editing (cinema aesthetic)
4. **Why wasn't this updated globally?** → CSS variables were updated to white, but JS/TS defaults weren't synchronized
5. **Why are there inconsistencies?** → No centralized color constant for all defaults

**ROOT CAUSE**: Design token migration was incomplete - CSS variables were updated to white theme, but TypeScript constants, component defaults, and project templates still contain legacy dark values.

### 1.3 Current Behavior

- Main UI surfaces: Already white (CSS variables properly configured)
- Project backgrounds: Default to #000000 (black)
- Badge overlays: Use bg-black/80 (80% opacity black)
- Shadow system: Uses 0.4-0.7 opacity (too dark for white theme)
- Locked track overlay: Uses rgba(0,0,0,0.4)
- Backdrop overlay: Uses rgba(0,0,0,0.3)

### 1.4 Desired Behavior

- All UI surfaces: Pure white (#ffffff) or light gray (#f8f9fa)
- All project backgrounds: Default to #ffffff (white)
- All badge overlays: Use white/light backgrounds with borders
- Shadow system: Use 0.05-0.16 opacity (subtle for white theme)
- All overlays: Use light, semi-transparent white backgrounds
- Complete elimination of any black/dark UI elements visible to users

---

## 2. Codebase Analysis

### 2.1 Architecture Overview

- **Framework**: Next.js 16.0.5 + React 19.2.0 + TypeScript
- **Styling**: Tailwind CSS v4 + CSS Custom Properties (globals.css)
- **State Management**: Zustand 4.5.7 with 5 stores
- **Component Count**: 55+ TSX components across 8 feature areas

### 2.2 Affected Systems

```
┌─────────────────────────────────────────────────────────────────┐
│                         AFFECTED FILES                           │
├─────────────────────────────────────────────────────────────────┤
│  CSS/Styling Layer (1 file)                                      │
│  ├── app/globals.css                                             │
├─────────────────────────────────────────────────────────────────┤
│  Constants/Defaults Layer (2 files)                              │
│  ├── app/constants/defaults.ts                                   │
│  └── app/constants/presets.ts                                    │
├─────────────────────────────────────────────────────────────────┤
│  Store Layer (2 files)                                           │
│  ├── app/lib/store/editorStore.ts                                │
│  └── app/lib/storage/serialization.ts                            │
├─────────────────────────────────────────────────────────────────┤
│  Component Layer (10+ files)                                     │
│  ├── app/components/panels/MediaPanel.tsx                        │
│  ├── app/components/panels/TransitionsPanel.tsx                  │
│  ├── app/components/panels/TextSection.tsx                       │
│  ├── app/components/panels/StyleSection.tsx                      │
│  ├── app/components/timeline/TimelineTrack.tsx                   │
│  ├── app/components/timeline/ClipTransition.tsx                  │
│  ├── app/components/timeline/TimeRuler.tsx                       │
│  ├── app/components/canvas/TransformControls.tsx                 │
│  ├── app/components/canvas/EditorCanvas.tsx                      │
│  ├── app/components/canvas/GridOverlay.tsx                       │
│  ├── app/components/canvas/CanvasElement.tsx                     │
│  ├── app/components/tools/TextTool.tsx                           │
│  ├── app/components/ui/ColorPicker.tsx                           │
│  └── app/components/ui/demo.tsx                                  │
├─────────────────────────────────────────────────────────────────┤
│  Library Layer (2 files)                                         │
│  ├── app/lib/canvas/elements.ts                                  │
│  └── app/lib/effects/transitions.ts                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Code Flow Analysis

**Dark Value Sources:**
1. CSS Variables (`globals.css`) → Used by all components via `var(--variable-name)`
2. TypeScript Constants (`defaults.ts`) → Used by stores and component defaults
3. Component Inline Styles → Hardcoded in className or style props
4. Store Initial State (`editorStore.ts`) → Persisted to localStorage

### 2.4 Key Findings

- **40+ dark styling instances** across 20+ files
- **4 project templates** all use black backgrounds
- **Shadow system** in defaults.ts uses 0.4-0.7 opacity (extremely dark)
- **Disabled state** incorrectly uses dark color (#404040)
- **Backdrop overlay** uses 30% black opacity
- Main CSS design system is already white-themed (variables are correct)

---

## 3. Solution Design

### 3.1 Approaches Considered

#### Approach A: Targeted Fix (Selected)
- **Description**: Fix each identified dark value individually across all files
- **Pros**:
  + Minimal risk of breaking changes
  + Clear audit trail of changes
  + Can be done incrementally
  + Preserves existing architecture
- **Cons**:
  - More files to modify
  - Risk of missing edge cases
- **Effort**: Medium
- **Risk**: Low

#### Approach B: Theme Provider Centralization
- **Description**: Create a centralized theme provider that overrides all colors
- **Pros**:
  + Single source of truth
  + Easier future theming
- **Cons**:
  - Significant architectural change
  - Higher risk of regression
  - More development time
- **Effort**: High
- **Risk**: Medium

#### Approach C: CSS Variable Override
- **Description**: Add CSS overrides at root level to force white theme
- **Pros**:
  + Quick implementation
  + Minimal file changes
- **Cons**:
  - Doesn't fix underlying defaults
  - TypeScript values still wrong
  - New projects would still have black backgrounds
- **Effort**: Low
- **Risk**: High (incomplete fix)

### 3.2 Approach Comparison

| Criteria | Approach A | Approach B | Approach C |
|----------|------------|------------|------------|
| Implementation Effort | 3/5 | 5/5 | 1/5 |
| Risk Level | 2/5 | 4/5 | 4/5 |
| Completeness | 5/5 | 5/5 | 2/5 |
| Maintainability | 4/5 | 5/5 | 2/5 |
| Future Flexibility | 3/5 | 5/5 | 1/5 |
| **WEIGHTED TOTAL** | **3.4** | **4.8** | **2.0** |

### 3.3 Recommended Approach

**RECOMMENDED: Approach A - Targeted Fix**

**Reasoning:**
1. Lowest risk of regression while ensuring complete coverage
2. Each change is isolated and verifiable
3. Maintains existing architecture that is working well
4. Can be implemented file-by-file with immediate testing
5. Creates clear documentation of all changed values

**Tradeoffs Accepted:**
- More files to modify: Acceptable because each is a simple change
- Future theme changes require multiple file updates: Acceptable for current needs

---

## 4. Implementation Plan

### 4.1 Files Requiring Changes

#### Priority 1: CRITICAL (Must Fix - Core Defaults)

| File | Issue | Change Required | Risk |
|------|-------|-----------------|------|
| `app/globals.css` (Line 62) | Dark backdrop overlay 30% opacity | Change to light overlay | Low |
| `app/globals.css` (Line 82) | Dark disabled state #404040 | Change to light gray | Low |
| `app/constants/defaults.ts` (Lines 455-459) | Shadow system 0.4-0.7 opacity | Reduce to 0.05-0.16 opacity | Low |
| `app/lib/store/editorStore.ts` (Line 98) | Black project background | Change to #ffffff | Low |
| `app/lib/storage/serialization.ts` (Line 427) | Black serialization default | Change to #ffffff | Low |
| `app/constants/presets.ts` (Lines 248, 264, 280, 296) | Black template backgrounds | Change to #ffffff | Low |

#### Priority 2: HIGH (Should Fix - Component Overlays)

| File | Issue | Change Required | Risk |
|------|-------|-----------------|------|
| `app/components/panels/MediaPanel.tsx` (Line 268) | bg-black/80 badge | Change to white badge | Low |
| `app/components/panels/TransitionsPanel.tsx` (Line 239) | bg-black/80 badge | Change to white badge | Low |
| `app/components/panels/TransitionsPanel.tsx` (Line 231) | Dark overlay gradient | Change to light gradient | Low |
| `app/components/timeline/TimelineTrack.tsx` (Line 223) | rgba(0,0,0,0.4) overlay | Change to light overlay | Low |
| `app/components/timeline/ClipTransition.tsx` (Line 415) | bg-gray-900 label | Change to light label | Low |
| `app/components/panels/TextSection.tsx` (Line 245) | rgba(0,0,0,0.8) default | Change to light background | Low |

#### Priority 3: MEDIUM (Nice to Fix - Shadows & Defaults)

| File | Issue | Change Required | Risk |
|------|-------|-----------------|------|
| `app/constants/defaults.ts` (Line 229) | Black stroke default | Change to gray | Low |
| `app/components/panels/StyleSection.tsx` (Lines 45, 150, 183) | Black shadow/border defaults | Change to gray | Low |
| `app/components/tools/TextTool.tsx` (Lines 46, 50) | Black shadow/stroke defaults | Change to gray | Low |
| `app/components/ui/ColorPicker.tsx` (Line 155) | rgba(0,0,0,0.2) overlay | Reduce opacity | Low |
| `app/components/ui/demo.tsx` (Line 37) | Black background default | Change to white | Low |

#### Priority 4: LOW (Optional - Shadow Refinements)

| File | Issue | Change Required | Risk |
|------|-------|-----------------|------|
| `app/components/canvas/TransformControls.tsx` (Lines 140-153) | 0.2-0.3 shadow opacity | Reduce to 0.08-0.12 | Low |
| `app/components/canvas/EditorCanvas.tsx` (Line 294) | 0.3 zoom shadow | Reduce to 0.1 | Low |
| `app/components/canvas/GridOverlay.tsx` (Lines 214, 262) | 0.2 label opacity | Reduce to 0.08 | Low |
| `app/components/timeline/TimeRuler.tsx` (Lines 119, 128) | 0.3 shadow opacity | Reduce to 0.1 | Low |

### 4.2 Implementation Steps

#### Step 1: Fix Global CSS Variables (CRITICAL)

**File**: `app/globals.css`
**Purpose**: Update backdrop overlay and disabled state to light values

**Current Code (Lines 62, 82):**
```css
--backdrop-overlay: rgba(0, 0, 0, 0.3);
/* ... */
--disabled: #404040;
```

**New Code:**
```css
--backdrop-overlay: rgba(255, 255, 255, 0.85);
/* ... */
--disabled: #d1d5db;
```

**Explanation**: The backdrop overlay changes from a dark semi-transparent black to a light frosted glass effect. The disabled state changes from dark gray to light gray for better white theme consistency.

**Verification**: Modal backdrops should appear as light frosted glass. Disabled elements should be subtle light gray.

---

#### Step 2: Fix Shadow System in Constants (CRITICAL)

**File**: `app/constants/defaults.ts`
**Purpose**: Reduce shadow opacity from 0.4-0.7 to subtle values appropriate for white theme

**Current Code (Lines 453-460):**
```typescript
// Shadow System
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.5)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.6)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.7)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
} as const;
```

**New Code:**
```typescript
// Shadow System - Light theme optimized
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.16)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;
```

**Explanation**: Reduces all shadow opacities to subtle values (0.05-0.16) that work well on white backgrounds without appearing too dark or harsh.

**Verification**: All component shadows should be subtle and elegant, not harsh black outlines.

---

#### Step 3: Fix Editor Store Default Background (CRITICAL)

**File**: `app/lib/store/editorStore.ts`
**Purpose**: Change default project background from black to white

**Current Code (Lines 93-99):**
```typescript
const defaultProjectSettings: ProjectSettings = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 60, // 60 seconds default
  backgroundColor: '#000000',
};
```

**New Code:**
```typescript
const defaultProjectSettings: ProjectSettings = {
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 60, // 60 seconds default
  backgroundColor: '#ffffff',
};
```

**Explanation**: New projects will now default to white background instead of black.

**Verification**: Create a new project - canvas should be white by default.

---

#### Step 4: Fix Serialization Default Background (CRITICAL)

**File**: `app/lib/storage/serialization.ts`
**Purpose**: Update serialization defaults for consistent white backgrounds

**Current Code (Lines 420-428):**
```typescript
return {
  id,
  settings: {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 60,
    backgroundColor: '#000000',
  },
```

**New Code:**
```typescript
return {
  id,
  settings: {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 60,
    backgroundColor: '#ffffff',
  },
```

**Explanation**: Ensures loaded/serialized projects default to white background.

**Verification**: Load an old project or create new project - should use white background.

---

#### Step 5: Fix Project Templates (CRITICAL)

**File**: `app/constants/presets.ts`
**Purpose**: Change all project template backgrounds from black to white

**Current Code (Lines 247-249, 263-265, 279-281, 295-297):**
```typescript
// YouTube template
backgroundColor: '#000000',
// Instagram Story template
backgroundColor: '#000000',
// Instagram Post template
backgroundColor: '#000000',
// TikTok template
backgroundColor: '#000000',
```

**New Code:**
```typescript
// All templates
backgroundColor: '#ffffff',
```

**Explanation**: All project templates now use white backgrounds.

**Verification**: Create project from any template - should have white background.

---

#### Step 6: Fix Media Panel Badge (HIGH)

**File**: `app/components/panels/MediaPanel.tsx`
**Purpose**: Convert dark badge overlay to light theme

**Current Code (Lines 267-270):**
```tsx
{asset.duration && asset.type !== 'image' && (
  <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white font-medium">
    {formatDuration(asset.duration)}
  </div>
)}
```

**New Code:**
```tsx
{asset.duration && asset.type !== 'image' && (
  <div className="absolute top-2 right-2 px-2 py-1 bg-[var(--surface-elevated)]/95 backdrop-blur-sm rounded text-xs text-[var(--text-primary)] font-medium border border-[var(--border-primary)]">
    {formatDuration(asset.duration)}
  </div>
)}
```

**Explanation**: Changes from black background with white text to white background with dark text and subtle border.

**Verification**: Media panel asset cards should have light duration badges.

---

#### Step 7: Fix Transitions Panel Badge and Overlay (HIGH)

**File**: `app/components/panels/TransitionsPanel.tsx`
**Purpose**: Convert dark elements to light theme

**Current Code (Lines 231-241):**
```tsx
{/* Overlay on hover */}
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-start p-2">
  <div className="text-white">
    <p className="text-xs font-medium">{metadata.name}</p>
    <p className="text-xs opacity-75">Click to apply</p>
  </div>
</div>

{/* Type indicator */}
<div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-white font-medium">
  {transitionDirection === 'in' ? 'In' : 'Out'}
</div>
```

**New Code:**
```tsx
{/* Overlay on hover */}
<div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-start p-2">
  <div className="text-[var(--text-primary)]">
    <p className="text-xs font-medium">{metadata.name}</p>
    <p className="text-xs opacity-75">Click to apply</p>
  </div>
</div>

{/* Type indicator */}
<div className="absolute top-2 right-2 px-2 py-1 bg-[var(--surface-elevated)]/95 backdrop-blur-sm rounded text-xs text-[var(--text-primary)] font-medium border border-[var(--border-primary)]">
  {transitionDirection === 'in' ? 'In' : 'Out'}
</div>
```

**Explanation**: Converts dark gradient overlay and badge to light theme using CSS variables.

**Verification**: Transition panel cards should have light hover overlays and badges.

---

#### Step 8: Fix Timeline Track Locked Overlay (HIGH)

**File**: `app/components/timeline/TimelineTrack.tsx`
**Purpose**: Convert dark locked overlay to light theme

**Current Code (Lines 218-226):**
```tsx
{track.locked && (
  <div
    className="absolute inset-0 pointer-events-none flex items-center justify-center"
    style={{
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'var(--backdrop-blur)'
    }}
  >
```

**New Code:**
```tsx
{track.locked && (
  <div
    className="absolute inset-0 pointer-events-none flex items-center justify-center"
    style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'var(--backdrop-blur)'
    }}
  >
```

**Explanation**: Changes locked track overlay from dark semi-transparent to light frosted glass.

**Verification**: Lock a timeline track - overlay should be light white instead of dark.

---

#### Step 9: Fix Clip Transition Label (HIGH)

**File**: `app/components/timeline/ClipTransition.tsx`
**Purpose**: Convert dark label background to light theme

**Current Code (Line 415):**
```tsx
<div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-white bg-gray-900 px-1 rounded whitespace-nowrap pointer-events-none">
  {type === 'in' ? 'In' : 'Out'}: {duration}ms
</div>
```

**New Code:**
```tsx
<div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-[var(--text-primary)] bg-[var(--surface-elevated)] px-1 rounded whitespace-nowrap pointer-events-none border border-[var(--border-primary)]">
  {type === 'in' ? 'In' : 'Out'}: {duration}ms
</div>
```

**Explanation**: Changes from dark gray background with white text to white background with dark text and border.

**Verification**: Clip transition labels should have white backgrounds.

---

#### Step 10: Fix Text Section Background Default (HIGH)

**File**: `app/components/panels/TextSection.tsx`
**Purpose**: Change default text background from dark to light

**Current Code (Lines 244-246):**
```tsx
<button
  onClick={() => onUpdate({ backgroundColor: 'rgba(0,0,0,0.8)' })}
```

**New Code:**
```tsx
<button
  onClick={() => onUpdate({ backgroundColor: 'rgba(248,249,250,0.95)' })}
```

**Explanation**: When adding background to text elements, default is now light gray instead of dark.

**Verification**: Add background to text - should be light gray, not dark.

---

#### Step 11: Fix Shape Stroke Default (MEDIUM)

**File**: `app/constants/defaults.ts`
**Purpose**: Change default stroke color from black to medium gray

**Current Code (Lines 227-231):**
```typescript
export const DEFAULT_SHAPE_PROPERTIES = {
  fillColor: '#3b82f6',
  strokeColor: '#000000',
  strokeWidth: 2,
} as const;
```

**New Code:**
```typescript
export const DEFAULT_SHAPE_PROPERTIES = {
  fillColor: '#3b82f6',
  strokeColor: '#5f6368',
  strokeWidth: 2,
} as const;
```

**Explanation**: Default stroke is now medium gray instead of black for softer appearance.

**Verification**: Create a shape - stroke should be gray by default.

---

#### Step 12: Fix Style Section Defaults (MEDIUM)

**File**: `app/components/panels/StyleSection.tsx`
**Purpose**: Update shadow and border color defaults to light gray

**Current Code (multiple lines with #000000):**
```typescript
color: style.shadow?.color || '#000000',
value={style.borderColor || '#000000'}
color: '#000000',
```

**New Code:**
```typescript
color: style.shadow?.color || '#d1d5db',
value={style.borderColor || '#e0e0e0'}
color: '#d1d5db',
```

**Explanation**: Shadow and border defaults are now light gray instead of black.

**Verification**: Open style panel - default shadow/border colors should be gray.

---

#### Step 13: Fix Text Tool Defaults (MEDIUM)

**File**: `app/components/tools/TextTool.tsx`
**Purpose**: Update default shadow and stroke colors

**Current Code (Lines 46, 50):**
```typescript
const [shadowColor, setShadowColor] = useState('#000000');
const [strokeColor, setStrokeColor] = useState('#000000');
```

**New Code:**
```typescript
const [shadowColor, setShadowColor] = useState('#9aa0a6');
const [strokeColor, setStrokeColor] = useState('#5f6368');
```

**Explanation**: Text shadow and stroke defaults are now gray instead of black.

**Verification**: Select text tool - default shadow/stroke colors should be gray.

---

#### Step 14: Fix Demo Component Background (MEDIUM)

**File**: `app/components/ui/demo.tsx`
**Purpose**: Update demo component default background

**Current Code (Line 37):**
```typescript
const [backgroundColor, setBackgroundColor] = useState('#000000');
```

**New Code:**
```typescript
const [backgroundColor, setBackgroundColor] = useState('#ffffff');
```

**Explanation**: Demo component defaults to white background.

**Verification**: Demo page should show white background by default.

---

#### Step 15: Fix Transform Controls Shadows (LOW)

**File**: `app/components/canvas/TransformControls.tsx`
**Purpose**: Reduce shadow opacity for white theme

**Current Code (Lines 140-141):**
```typescript
? '0 0 0 4px rgba(37, 99, 235, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)'
: '0 2px 8px rgba(0, 0, 0, 0.2)',
```

**New Code:**
```typescript
? '0 0 0 4px rgba(37, 99, 235, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
: '0 2px 8px rgba(0, 0, 0, 0.08)',
```

**Explanation**: Reduces shadow opacity for softer appearance on white theme.

**Verification**: Select an element - transform handles should have subtle shadows.

---

#### Step 16: Fix Editor Canvas Zoom Shadow (LOW)

**File**: `app/components/canvas/EditorCanvas.tsx`
**Purpose**: Reduce zoom shadow opacity

**Current Code (Line 294):**
```typescript
boxShadow: zoom > 1 ? '0 0 20px rgba(0, 0, 0, 0.3)' : 'none',
```

**New Code:**
```typescript
boxShadow: zoom > 1 ? '0 0 20px rgba(0, 0, 0, 0.1)' : 'none',
```

**Explanation**: Zoom shadow is now subtle instead of prominent.

**Verification**: Zoom in on canvas - shadow should be subtle.

---

#### Step 17: Fix Grid Overlay Label Colors (LOW)

**File**: `app/components/canvas/GridOverlay.tsx`
**Purpose**: Reduce label opacity for white theme

**Current Code (Lines 214, 262):**
```typescript
: 'rgba(0, 0, 0, 0.2)',
```

**New Code:**
```typescript
: 'rgba(0, 0, 0, 0.08)',
```

**Explanation**: Grid labels are now more subtle on white background.

**Verification**: Enable grid - labels should be subtle gray.

---

#### Step 18: Fix Time Ruler Shadows (LOW)

**File**: `app/components/timeline/TimeRuler.tsx`
**Purpose**: Reduce ruler shadow opacity

**Current Code (Lines 119, 128):**
```typescript
boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
textShadow: '0 1px 2px rgba(0,0,0,0.3)',
```

**New Code:**
```typescript
boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
textShadow: '0 1px 2px rgba(0,0,0,0.1)',
```

**Explanation**: Ruler shadows are now subtle.

**Verification**: Timeline ruler should have subtle shadows.

---

## 5. Testing Strategy

### 5.1 Unit Tests

**Test Case 1: Default Project Settings**
```typescript
describe('EditorStore', () => {
  it('should default project background to white', () => {
    const state = useEditorStore.getState();
    expect(state.project.backgroundColor).toBe('#ffffff');
  });
});
```

**Test Case 2: Shadow Values**
```typescript
describe('SHADOWS constant', () => {
  it('should have low opacity values', () => {
    expect(SHADOWS.sm).toContain('0.05');
    expect(SHADOWS.DEFAULT).toContain('0.08');
    expect(SHADOWS.lg).toContain('0.12');
  });
});
```

### 5.2 Integration Tests

**Scenario: Create New Project**
1. Setup: Application loaded
2. Action: Click "New Project"
3. Assertions:
   - Canvas background is white (#ffffff)
   - No dark overlays visible
   - All badges have light backgrounds

**Scenario: Apply Transition**
1. Setup: Project with clips loaded
2. Action: Apply transition between clips
3. Assertions:
   - Transition label has white background
   - Hover overlay is light gradient

### 5.3 Manual Testing Checklist

- [ ] Create new blank project - canvas should be white
- [ ] Create project from YouTube template - should be white
- [ ] Create project from Instagram template - should be white
- [ ] Create project from TikTok template - should be white
- [ ] Add media asset - duration badge should be white with dark text
- [ ] Apply transition - hover overlay should be light gradient
- [ ] Lock timeline track - overlay should be white frosted glass
- [ ] Add text element - background default should be light
- [ ] Create shape - stroke should be gray, not black
- [ ] Zoom canvas - shadow should be subtle
- [ ] Enable grid - labels should be subtle
- [ ] Open modal dialog - backdrop should be light frosted glass
- [ ] View disabled elements - should be light gray

---

## 6. Risk Assessment

### 6.1 Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Contrast issues with light badges | Low | Medium | Use borders + dark text |
| Missing dark value during search | Low | Low | Re-run grep after changes |
| User preference for dark backgrounds | Low | Low | Background is still customizable |
| localStorage has cached old values | Medium | Medium | Clear localStorage or add migration |

### 6.2 Rollback Plan

**Rollback Triggers:**
- Significant UI rendering issues
- Contrast/accessibility violations
- User reports of illegible elements

**Rollback Procedure:**
1. Git revert the commit with all changes
2. Clear localStorage in browser (for cached project settings)
3. Rebuild application
4. Verify original behavior restored

**Time to Rollback**: ~5 minutes

---

## 7. Definition of Done

- [ ] All Priority 1 (CRITICAL) changes implemented
- [ ] All Priority 2 (HIGH) changes implemented
- [ ] All Priority 3 (MEDIUM) changes implemented
- [ ] All Priority 4 (LOW) changes implemented
- [ ] Manual testing completed for all pages
- [ ] No black/dark backgrounds visible in UI
- [ ] No dark badges or overlays visible
- [ ] All shadows subtle (< 0.2 opacity)
- [ ] New projects default to white background
- [ ] All templates use white background
- [ ] Accessibility contrast maintained

---

## 8. Impact Analysis Summary

### 8.1 Files Directly Modified (18 files)

| File | Changes |
|------|---------|
| `app/globals.css` | Backdrop overlay, disabled state |
| `app/constants/defaults.ts` | Shadow system, stroke color |
| `app/constants/presets.ts` | Template backgrounds (4 templates) |
| `app/lib/store/editorStore.ts` | Project background default |
| `app/lib/storage/serialization.ts` | Serialization background default |
| `app/components/panels/MediaPanel.tsx` | Duration badge styling |
| `app/components/panels/TransitionsPanel.tsx` | Badge, overlay gradient |
| `app/components/panels/TextSection.tsx` | Background default |
| `app/components/panels/StyleSection.tsx` | Shadow/border defaults |
| `app/components/timeline/TimelineTrack.tsx` | Locked overlay |
| `app/components/timeline/ClipTransition.tsx` | Label styling |
| `app/components/timeline/TimeRuler.tsx` | Shadow values |
| `app/components/canvas/TransformControls.tsx` | Shadow values |
| `app/components/canvas/EditorCanvas.tsx` | Zoom shadow |
| `app/components/canvas/GridOverlay.tsx` | Label opacity |
| `app/components/tools/TextTool.tsx` | Default colors |
| `app/components/ui/ColorPicker.tsx` | Overlay opacity |
| `app/components/ui/demo.tsx` | Background default |

### 8.2 Files Indirectly Affected

- Any component using `SHADOWS` constant - will get lighter shadows
- Any component using CSS variables - will inherit updated values
- Persisted projects - may need localStorage clear for new defaults

### 8.3 Integration Points Changed

- **New Project Creation**: White background by default
- **Template Selection**: All templates now white
- **Project Serialization**: Defaults to white
- **Modal Backdrops**: Light frosted glass effect
- **Timeline Overlays**: Light instead of dark

---

## Appendix

### A. Files Read During Analysis

| File | Relevance |
|------|-----------|
| `app/globals.css` | CSS design system and variables |
| `app/constants/defaults.ts` | TypeScript color/shadow constants |
| `app/constants/presets.ts` | Project template definitions |
| `app/lib/store/editorStore.ts` | Default project state |
| `app/lib/storage/serialization.ts` | Data persistence defaults |
| `app/components/panels/MediaPanel.tsx` | Dark badge styling |
| `app/components/panels/TransitionsPanel.tsx` | Dark overlays and badges |
| `app/components/panels/TextSection.tsx` | Background defaults |
| `app/components/timeline/TimelineTrack.tsx` | Locked track overlay |
| `app/components/timeline/ClipTransition.tsx` | Transition labels |

### B. Sub-Agent Queries Executed

1. **Explore Agent (Phase 1)**: Project reconnaissance - Mapped complete project structure, identified Next.js 16.0.5 + React 19.2.0 architecture, Tailwind CSS v4 styling, 55+ components
2. **Explore Agent (Phase 2)**: Deep dive on dark/black styling - Found main CSS variables are already white-themed, identified need for TypeScript constant updates
3. **General-Purpose Agent (Phase 3)**: Comprehensive dark UI analysis - Identified 40+ instances across 20+ files, categorized by priority, provided exact line numbers and recommended fixes

### C. Reference Documentation

- Tailwind CSS v4 Documentation: https://tailwindcss.com/docs
- WCAG 2.1 Contrast Requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
