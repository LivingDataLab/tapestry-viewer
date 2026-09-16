# Plan: "AI View" Synopsis Prompt

## Goal
Produce a reusable prompt (plus a concise technical summary) that explains how the current "AI View" / "Machine Vision View" effect is implemented, so it can be handed to another AI to recreate or extend it.

## Current implementation to document
Verified from `src/hooks/useCsvData.ts`, `src/pages/Index.tsx`, `src/components/PanoramaViewer.tsx`, `src/components/InfoOverlay.tsx`, and `src/components/MapOverlay.tsx`:

1. **Data source**
   - CSV is parsed with Papa Parse.
   - Each row has `raw_image` and `annotated_image` filenames.
   - The "AI View" black-and-white / annotated look is baked into the `*-annotated.jpg` source images, not generated client-side.

2. **State machine**
   - `useCsvData` holds `showAnnotated`, `wipePhase`, and `overlaysVisible`.
   - Every 45 s `showAnnotated` flips from `false` (raw) to `true` (annotated).
   - Every 90 s `advanceRow()` runs a diagonal wipe to the next CSV row.

3. **Panorama crossfade**
   - `DualPanoramaViewer` renders two react-three-fiber spheres.
   - Raw and annotated textures share a `rotationRef` so they rotate in sync.
   - `FadingSphere` lerps material opacity toward the target based on `showAnnotated`.

4. **"Machine Vision View" blue bar**
   - `InfoOverlay` shows a blue (`#2424e6`) horizontal bar that slides down/fades in when `showAnnotated && !isWiping`.
   - Transition: `margin-top` and `opacity` over 1.5 s ease-out.
   - Font: `Ubuntu Mono`.

5. **Map overlay**
   - `MapOverlay` renders two Mapbox instances (raw style + annotated translucent style).
   - They crossfade with CSS opacity transitions and stay synced with the same delayed `flyTo`.

6. **Diagonal wipe transition**
   - `Index.tsx` renders a full-screen black `div` with a `clip-path` polygon transition.

## Open discrepancy to surface
- No client-side blue outline/border around the whole frame exists in the current code; the only blue element is the slide-down "Machine Vision View" bar.
- No client-side grayscale or glitch shader exists in the current code; the B&W/annotated look comes from the pre-baked images.

## Deliverables
1. A ready-to-paste prompt for another AI that describes the above architecture, state machine, file responsibilities, and exact colors/timings, while flagging the pre-baked-image vs. client-side distinction.
2. A short technical summary with file:line references.

## Files to create
- `.lovable/ai-view-synopsis.md` (the prompt + technical summary).

## Out of scope
- No source-code changes unless you explicitly request them after reviewing the synopsis.
