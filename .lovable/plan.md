# Plan: "AI View" Synopsis Document

Deliverable: a single markdown file, `.lovable/ai-view-synopsis.md`, containing (a) a ready-to-paste prompt for another AI and (b) a technical breakdown of the AI View's graphic language. No source code changes.

## Part 1 — Reusable prompt

A self-contained prompt describing the AI View as a two-phase state machine over a 360° panorama: a raw phase and a "machine vision" phase, with the exact colors, timings, and layer stack listed below, so another AI can rebuild it in any stack.

## Part 2 — Graphic language of the AI View (verified in code)

**Recoloring / lines — the annotated look is pre-baked.** The detected-object outlines, label boxes and desaturated treatment live in the `*-annotated.jpg` panorama images pulled from the CSV feed. No client-side grayscale, hue shift, or edge-detection filter is applied. Two spheres are stacked and cross-faded, so the "AI recolor" reads as a dissolve from the color photo into the machine-vision render.

**Cross-fade.** Both spheres share one rotation value, so the two images stay pixel-aligned during the fade. Opacity is eased per animation frame (factor 0.025) rather than by a CSS transition, giving a slow ~1.5 s soft dissolve.

**Glitch shader.** `src/components/PanoramaViewer.tsx` defines a custom material (`GlitchMaterial`, lines 7–55) applied to the annotated sphere only. Its `glitchIntensity` uniform ramps 0 → 1 at 0.03 per frame in step with the fade, so the glitch arrives with the machine-vision image instead of snapping on. Three stacked artifacts:
- Horizontal tear bursts: the image is sliced into 80 horizontal bands; a random band is offset up to ±0.012 UV, re-rolled 4×/sec, firing above a 0.993 threshold (rare).
- RGB channel separation: red and blue are sampled with opposite horizontal offsets up to 0.004 UV, modulated by a sine over screen height so the fringe ripples; gated by a 0.985 threshold re-rolled 1.5×/sec, so it appears as short chromatic bursts, not constant.
- Scanlines: alternating rows darkened 4%, scrolling upward at 2 units/sec.

**Blue frame.** `src/pages/Index.tsx` line 63 draws an 8 px `#0000ff` inset border on the whole frame while annotated view is active, with a 1 s ease-in-out transition.

**Blue HUD accents.** The "Machine Vision View" bar (`#2424e6`, Ubuntu Mono) slides down from behind the top HUD over 1.5 s via animated negative margin plus opacity. Simultaneously the bottom red Demographics header and green Linguistic Diversity header both transition to `#0000ff`, so the whole interface shifts to a single machine-vision blue.

**Persistence rules.** The blue bar and blue frame hide during the diagonal black wipe between rows; the "Development Preview" badge never fades.

## Part 3 — Timing table
Raw phase 45 s, annotated phase 45 s, diagonal black wipe 800 ms per half, overlays fade back in 500 ms after the wipe.

## Out of scope
No changes to the panorama, shader, or HUD unless requested after review.
