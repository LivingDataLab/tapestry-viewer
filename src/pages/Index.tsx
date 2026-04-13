import { Suspense } from "react";
import PanoramaViewer from "@/components/PanoramaViewer";
import InfoOverlay from "@/components/InfoOverlay";
import { useCsvData, WIPE_HALF } from "@/hooks/useCsvData";
import type { WipePhase } from "@/hooks/useCsvData";

const LoadingScreen = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "hsl(var(--background))",
    }}
  >
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontSize: "32px",
        color: "hsl(var(--muted-foreground))",
      }}
    >
      Loading…
    </span>
  </div>
);

/*
 * Two-layer wipe: 
 * Layer 1 (cover): grows from top-left to cover screen during "covering" phase, stays full during "revealing"
 * Layer 2 (reveal): placed ON TOP of layer 1, reveals content by growing from top-left during "revealing" phase
 * 
 * Actually simpler: single black overlay.
 * - "none": fully transparent (polygon collapsed)
 * - "covering": polygon expands from top-left to cover everything
 * - "revealing": polygon shrinks from top-left, revealing new content underneath
 * 
 * But user wants the reveal to also move from top-left to bottom-right.
 * So: cover = black slides in from TL. Reveal = black slides OUT toward BR.
 * 
 * Cover: polygon grows: 0,0 → 0,0 → 0,0  ====>  0,0 → 200%,0 → 0,200%
 * Reveal: polygon shrinks from the opposite side:
 *   Full coverage: 0,0 → 100%,0 → 100%,100% → 0,100%  
 *   Then moves away toward BR: 100%,100% → 200%,100% → 100%,200% → 100%,100% (collapsed at BR)
 * 
 * Simplest approach: 
 * Cover phase: clip-path goes from nothing to full screen (triangle from TL)
 * Reveal phase: clip-path goes from full screen to nothing (triangle collapsing toward BR)
 */
function getWipeClipPath(phase: WipePhase): string {
  switch (phase) {
    case "none":
      // Collapsed at top-left
      return "polygon(0% 0%, 0% 0%, 0% 0%)";
    case "covering":
      // Full coverage triangle from top-left
      return "polygon(-10% -10%, 250% -10%, -10% 250%)";
    case "revealing":
      // Collapsed at bottom-right
      return "polygon(110% 110%, 110% 110%, 110% 110%)";
  }
}

function getWipeTransition(phase: WipePhase): string {
  if (phase === "none") return "none"; // instant reset, no animation
  return `clip-path ${WIPE_HALF}ms ease-in-out`;
}

const Index = () => {
  const { currentRow, showAnnotated, loading, wipePhase } = useCsvData();

  if (loading || !currentRow) return <LoadingScreen />;

  return (
    <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<LoadingScreen />}>
        <PanoramaViewer
          key={currentRow.rawImageUrl}
          rawImageUrl={currentRow.rawImageUrl}
          annotatedImageUrl={currentRow.annotatedImageUrl}
          showAnnotated={showAnnotated}
        />
      </Suspense>
      <InfoOverlay
        data={{
          city: currentRow.city,
          latitude: currentRow.latitude,
          longitude: currentRow.longitude,
          distanceToDetroit: currentRow.distanceToDetroit,
        }}
      />
      {/* Diagonal wipe overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#000",
          pointerEvents: "none",
          clipPath: getWipeClipPath(wipePhase),
          transition: getWipeTransition(wipePhase),
        }}
      />
    </div>
  );
};

export default Index;
