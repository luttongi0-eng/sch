---
name: Warm Sketchbook Studio
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#574140'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#8b7170'
  outline-variant: '#debfbe'
  surface-tint: '#a83639'
  primary: '#a83639'
  on-primary: '#ffffff'
  primary-container: '#ff7675'
  on-primary-container: '#720b16'
  inverse-primary: '#ffb3b0'
  secondary: '#006b54'
  on-secondary: '#ffffff'
  secondary-container: '#63fbcf'
  on-secondary-container: '#00725a'
  tertiary: '#0062a0'
  on-tertiary: '#ffffff'
  tertiary-container: '#60a6eb'
  on-tertiary-container: '#003a62'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#881d24'
  secondary-fixed: '#63fbcf'
  secondary-fixed-dim: '#3fdeb4'
  on-secondary-fixed: '#002118'
  on-secondary-fixed-variant: '#00513f'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497a'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: 3.5rem
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '800'
    lineHeight: 2.5rem
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: 1.75rem
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '500'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system blends high-precision SaaS studio tooling with the warm, nostalgic tactility of an artist's sketchbook. Designed specifically for live streamers and content creators, the interface balances two parallel layers:
1. **The Modern Workbench (Editor & Tooling):** Clean, structural, and quiet. It uses crisp borders, understated controls, and generous negative space to minimize cognitive load during schedule planning and image export.
2. **The Tangible Canvas (The Schedule Grid):** Warm, inviting, and textured. It draws inspiration from cream-toned art paper, spiral sketchbook bindings, masking tape clips, and textured crayon strokes.

The emotional tone balances professional creator productivity with handcrafted warmth. The system eliminates the sterile coldness typical of traditional productivity tools without devolving into childish kitsch.

## Colors

The palette is anchored by warm paper neutrals and punctuated by saturated, velvety crayon accents.

### Palette Architecture
- **Surface Canvas (Base Cream):** `#FBF9F5` serves as the global application ground. Card substrates and nested sheets sit on `#F5F2EB` and `#FFFFFF`, preserving an organic paper tactile feel.
- **Charcoal Typography (Neutrals):** `#2C2825` (Ink Black) provides high-legibility typographic contrast without the harshness of pure black. Secondary captions and neutral dividers utilize `#5A544F` and `#8C847D`.
- **Crayon Swatches (Day & Category Tags):**
  - **Crayon Coral (`#FF7675`):** Primary highlight, action anchors, live alerts.
  - **Mustard Butter (`#FDCB6E`):** Golden hour weekend accents, community events.
  - **Leaf Mint (`#55EFC4`):** Secondary fresh accent, gaming categories.
  - **Sky Pastel (`#74B9FF`):** Tertiary chill tag, chatting/IRL streams.
  - **Lavender Dream (`#A29BFE`):** Special events, collabs, milestone broadcasts.
  - **Warm Peach (`#FAB1A0`):** Secondary highlight for rest days and notes.

Interactive controls use subtle paper-toned tints (`#F0EAE1`) in resting states, switching to rich ink strokes (`#2C2825`) upon interaction.

## Typography

The type system pairs **Plus Jakarta Sans** with **Space Grotesk**.

- **Plus Jakarta Sans** acts as the primary voice across titles, interface labels, and stream descriptions. Its geometric baseline paired with softly curved terminals conveys friendliness without sacrificing the high readability needed in busy schedule cells.
- **Space Grotesk** serves as a counterpoint for operational indicators: time markers (`19:00 KST`), resolution tags (`1080p`), week numbers, and toolbar export parameters. It introduces a measured, technical cadence reminiscent of sketchbook measurement rules and stamp art.
- Korean text fallback uses high-legibility geometric sans fonts (e.g., Pretendard) while preserving the tracking, weight scale, and optical balance defined above.

## Layout & Spacing

The layout is built around a split operational framework: a sticky top/side control bar coupled with a responsive, export-optimized 7-day canvas.

### Layout Mechanics
- **The Weekly Canvas:** Renders a 7-column grid on desktop screens (`min-width: 1024px`), flowing seamlessly from Monday to Sunday. Each day card maintains consistent baseline vertical flow.
- **Tablet (`768px - 1023px`):** Reconfigures into a 2-to-3 column staggered card masonry, maintaining the full day-card hierarchy.
- **Mobile (`< 768px`):** Collapses into a single-column vertical timeline sheet with an optional horizontal day-tab switcher.
- **Export Framing:** Regardless of view mode, the central export canvas retains an intrinsic 16:9 / 4:5 aspect ratio toggle with fixed virtual canvas dimensions (e.g., 1920x1080 or 1080x1350) to produce print-quality PNG output.

Component padding relies strictly on the `space-sm` (8px), `space-md` (16px), and `space-lg` (24px) scale to preserve consistent internal rhythm across cells.

## Elevation & Depth

Rather than relying on heavy digital drop shadows, depth is communicated through tangible paper layering, crisp outlines, and physical stationery metaphors.

### Layering Hierarchy
1. **Canvas Desk (`#FBF9F5`):** The bottommost surface plane.
2. **Sketchbook Pad (`#FFFFFF` or `#F5F2EB`):** Elevated using a 1px solid stroke (`#2C2825` at 12% opacity) combined with an offset ambient contact shadow: `0 4px 12px -2px rgba(44, 40, 37, 0.06), 0 1px 3px rgba(44, 40, 37, 0.04)`.
3. **Weekly Day Slots & Pinned Sticky Cards:** Stacked directly onto the sketchbook sheet with an ultra-light outline (`rgba(44, 40, 37, 0.08)`) and micro-shadow (`0 2px 4px rgba(44, 40, 37, 0.04)`).
4. **Physical Accents (Washi Tape & Spring Binder):**
   - **Masking Tape Strips:** Semi-opaque (`rgba(255, 255, 255, 0.85)` or pastel-tinted) overlays with soft edges and subtle -1° to 1.5° rotational skews.
   - **Crayon Strokes & Underlines:** Direct SVG textures placed behind headline dates or broadcast highlights, remaining optically flat against paper layers.
5. **Floating Modals & Toolbars:** Lifted crisp surfaces using elevated dark offset depth (`0 12px 32px -4px rgba(44, 40, 37, 0.12)`) paired with a 1px solid neutral border (`#E5DFD5`).

## Shapes

The design uses **Rounded** geometry (`roundedness: 2`, base radius 8px / 0.5rem), providing comfortable curvature that mirrors hand-cut paper and smooth stationery corners.

- **Primary Cards & Modals:** Standardized at `rounded-lg` (16px / 1rem) for structural harmony and organic softness.
- **Interactive Buttons & Form Inputs:** Styled at base `rounded` (8px / 0.5rem) to ensure clear click targets with sharp, well-defined affordances.
- **Pills & Category Badges:** Utilizes fully rounded pill profiles (`9999px`) for day labels, live badges, and status chips, creating immediate contrast against rectangular schedule blocks.
- **Washi Tape & Sticky Notepads:** Slight asymmetrical border radii (e.g., top-left 4px, bottom-right 6px) to emulate hand-torn paper goods.

## Components

### Buttons
- **Primary Action (e.g., "Download PNG / Export"):** High-contrast filled charcoal `#2C2825` with off-white `#FBF9F5` typography, 8px corner radius, and subtle press displacement (`transform: translateY(1px)`).
- **Secondary Action (e.g., "Change Template"):** Paper surface `#F5F2EB`, 1px crisp outline `#D8D1C5`, text `#2C2825`. Hover transitions to a soft crayon tint (`#FF7675` at 8% opacity).
- **Crayon Quick-Palette Selector:** Circular swatches featuring concentric rings that display a textured crayon ring on active selection.

### Schedule Day Cards (The Core Grid)
- **Header:** Day indicator pill (e.g., "MON", "TUE") color-coded with the day's designated crayon accent, accompanied by the calendar date in `label-lg` Space Grotesk.
- **Body Area:** Blank paper canvas capable of hosting multiple stream items. Off-air days feature an illustrated or textured "REST" stamp in muted charcoal.
- **Washi Tape Pins:** Configurable decorative tape header pinned across the card's top edge with 92% opacity and subtle drop-shadow.

### Stream Time & Category Chips
- Compact pills pairing a colored crayon dot with a time stamp (`19:00`) and game/content title.
- Outlined with a fine, translucent border (`rgba(44, 40, 37, 0.1)`) against card interiors.

### Input Fields & Controls
- **Schedule Title / Time Pickers:** Flat, minimal input surfaces with `#F5F2EB` fills and zero borders at rest. On focus, they transition to a crisp 1.5px `#2C2825` stroke without neon glow rings.
- **Color Picker / Category Switcher:** Horizontal scrollable reel of pastel crayon pastilles with direct swatch previews.

### Checkboxes & Toggles
- Custom checkboxes styled with hand-drawn checkmark icons in rich charcoal `#2C2825` upon selection, avoiding generic blue system checkboxes.
- Toggles utilize smooth pill tracks in `#E5DFD5`, sliding a warm ivory handle that reveals the active crayon accent.

### Floating Export Bar
- Anchored at the bottom or top-right of the viewport. Built as a sleek floating capsule (`rounded-xl`), combining canvas dimensions, background texture toggles (Grain / Grid / Plain), and the one-click export button.