# "AI View" / Machine Vision View — Synopsis

## Part 1 — Reusable prompt (paste into another AI)

> Build a full-screen 4K installation view that alternates between two states over a rotating 360° equirectangular panorama.
>
> **Structure.** Two panorama spheres are stacked in the same 3D scene, both textured with pre-rendered images of the same location: a normal color photo ("raw") and a machine-vision render ("annotated") that already contains detection outlines, label boxes and a desaturated/recolored treatment. Both spheres share a single rotation value so they stay pixel-aligned; the scene rotates a full 360° every 45 seconds. The camera sits at the center with a 75° field of view.
>
> **State machine.** Phase A (raw) runs 45 s. Phase B (annotated / "AI view") runs 45 s. Then a full-screen black diagonal wipe from top-left to bottom-right (800 ms to cover, 800 ms to reveal) swaps in the next location, and all overlays fade back in 500 ms after the wipe finishes.
>
> **Transition into the AI view.** Cross-fade the two spheres by easing material opacity per animation frame (lerp factor 0.025), not with a CSS transition — the result is a slow ~1.5 s dissolve where the color photo melts into the machine-vision render.
>
> **Glitch treatment.** Apply a custom fragment shader to the annotated sphere only, with a `glitchIntensity` uniform that ramps 0 → 1 at 0.03 per frame so the glitch arrives with the dissolve rather than snapping on. Three artifacts, all scaled by that uniform:
> 1. *Horizontal tear bursts* — slice the image into 80 horizontal bands; offset a random band up to ±0.012 in UV space, re-rolled 4×/sec, gated by a 0.993 random threshold so tears are rare and single-band.
> 2. *RGB channel separation* — sample red and blue with opposite horizontal offsets up to 0.004 UV, modulated by `sin(time * 6 + uv.y * 20)` so the fringe ripples vertically; gate with a 0.985 threshold re-rolled 1.5×/sec so it fires as brief chromatic bursts, never continuously.
> 3. *Scanlines* — darken alternating rows by 4%, scrolling at 2 units/sec.
>
> **Interface language.** While the AI view is active: draw an 8 px `#0000ff` inset border around the entire frame (1 s ease-in-out); slide a `#2424e6` bar reading "Machine Vision View" in Ubuntu Mono down from *behind* the top HUD over 1.5 s (animate negative margin plus opacity so it appears to emerge from under the panel); and transition the bottom-left red header and bottom-right green header to the same `#0000ff` at the same rate, so the whole interface converges on one machine-vision blue. Hide the blue bar and blue frame during the wipe. One badge ("Development Preview") never fades.

## Part 2 — Technical breakdown of the graphic language

### Lines and recoloring are pre-baked, not filtered
The detection outlines, bounding labels and desaturated palette come from the `*-annotated.jpg` images themselves, pulled per row from the CSV feed (`src/hooks/useCsvData.ts`). There is no client-side grayscale, hue-rotate, or edge-detection pass. The perceived "AI recolor" is purely the dissolve between two pre-rendered textures.

### Cross-fade
`src/components/PanoramaViewer.tsx` — `FadingSphere` eases material opacity toward its target by `(target - current) * 0.025` every frame (line 89). A shared `rotationRef` (line 115) drives both spheres, so the color and machine-vision frames never drift apart mid-fade.

### Glitch shader
`GlitchMaterial`, lines 7–55:

| Artifact | Mechanism | Rate / amplitude |
|---|---|---|
| Horizontal tear | `step(0.993, rand(floor(uv.y*80), floor(time*4)))` | ~0.7% of bands, ±0.012 UV |
| RGB separation | `step(0.985, rand(floor(time*1.5), 3.7))`, R/B offset ±chromaShift | ~1.5% of ticks, 0.004 UV, sine-rippled |
| Scanlines | `1.0 - 0.04 * step(0.5, fract(uv.y*400 + time*2))` | 4% darkening, scrolling |

`glitchIntensity` multiplies all three and ramps at 0.03/frame (line 93), tied to `glitch={showAnnotated}` (line 150).

### Blue frame
`src/pages/Index.tsx` line 63: `border: showAnnotated ? "8px solid #0000ff" : "none"` with `transition: border 1s ease-in-out` and `boxSizing: border-box`.

### Blue HUD accents
- `src/components/InfoOverlay.tsx` lines 137–165: the `#2424e6` "Machine Vision View" bar sits at a lower z-index than the HUD and animates `marginTop` from `-50` design px to `0` plus opacity 0 → 1 over 1.5 s ease-out, gated on `showAnnotated && !isWiping`.
- `src/components/BottomInfoBoxes.tsx` lines 197 and 299: header backgrounds switch from `#e60000` (Demographics) and `#2ecc71` (Linguistic Diversity) to `#0000ff` when annotated.

### Timing
| Event | Duration |
|---|---|
| Raw phase | 45 s |
| Annotated phase | 45 s |
| Diagonal wipe (each half) | 800 ms |
| Overlay fade-in after wipe | 500 ms delay, 1 s fade |
| Panorama full rotation | 45 s |
