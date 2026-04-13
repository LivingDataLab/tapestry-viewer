import { Suspense } from "react";
import PanoramaViewer from "@/components/PanoramaViewer";
import InfoOverlay from "@/components/InfoOverlay";
import { useCsvData, WIPE_DURATION } from "@/hooks/useCsvData";

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

const Index = () => {
  const { currentRow, showAnnotated, loading, wiping } = useCsvData();

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
      {/* Diagonal wipe from top-left to bottom-right through black */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#000",
          pointerEvents: "none",
          maskImage: wiping
            ? "linear-gradient(135deg, black 0%, black 100%)"
            : "linear-gradient(135deg, transparent 0%, transparent 100%)",
          WebkitMaskImage: wiping
            ? "linear-gradient(135deg, black 0%, black 100%)"
            : "linear-gradient(135deg, transparent 0%, transparent 100%)",
          opacity: wiping ? 1 : 0,
          transition: `opacity ${WIPE_DURATION / 2}ms ease-in-out`,
        }}
      />
      {/* Diagonal wipe overlay using clip-path polygon */}
      <div
        style={{
          position: "fixed",
          inset: "-10% -10% -10% -10%",
          zIndex: 100,
          background: "#000",
          pointerEvents: "none",
          clipPath: wiping
            ? "polygon(0% 0%, 220% 0%, 0% 220%)"
            : "polygon(0% 0%, 0% 0%, 0% 0%)",
          transition: `clip-path ${WIPE_DURATION / 2}ms ease-in-out`,
        }}
      />
    </div>
  );
};

export default Index;
