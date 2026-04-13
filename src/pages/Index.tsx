import { Suspense } from "react";
import PanoramaViewer from "@/components/PanoramaViewer";
import InfoOverlay from "@/components/InfoOverlay";
import MapOverlay from "@/components/MapOverlay";
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

function getWipeClipPath(phase: WipePhase): string {
  switch (phase) {
    case "none":
      return "polygon(0% 0%, 0% 0%, 0% 0%)";
    case "covering":
      return "polygon(-10% -10%, 250% -10%, -10% 250%)";
    case "revealing":
      return "polygon(110% 110%, 110% 110%, 110% 110%)";
  }
}

function getWipeTransition(phase: WipePhase): string {
  if (phase === "none") return "none";
  return `clip-path ${WIPE_HALF}ms ease-in-out`;
}

const Index = () => {
  const { currentRow, showAnnotated, loading, wipePhase, overlaysVisible } = useCsvData();

  if (loading || !currentRow) return <LoadingScreen />;

  const isWiping = wipePhase !== "none";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      border: showAnnotated ? "8px solid #0000ff" : "none",
      transition: "border 1s ease-in-out",
      boxSizing: "border-box",
    }}>
      <Suspense fallback={<LoadingScreen />}>
        <PanoramaViewer
          key={currentRow.rawImageUrl}
          rawImageUrl={currentRow.rawImageUrl}
          annotatedImageUrl={currentRow.annotatedImageUrl}
          showAnnotated={showAnnotated}
        />
      </Suspense>
      <div
        style={{
          opacity: overlaysVisible ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <MapOverlay
          key={`map-${currentRow.rawImageUrl}`}
          latitude={currentRow.latitude}
          longitude={currentRow.longitude}
          showAnnotated={showAnnotated}
        />
      </div>
      <InfoOverlay
        data={{
          city: currentRow.city,
          latitude: currentRow.latitude,
          longitude: currentRow.longitude,
          distanceToDetroit: currentRow.distanceToDetroit,
        }}
        showAnnotated={showAnnotated}
        isWiping={isWiping}
        overlaysVisible={overlaysVisible}
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
