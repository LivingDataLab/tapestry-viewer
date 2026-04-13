import { Suspense } from "react";
import PanoramaViewer from "@/components/PanoramaViewer";
import InfoOverlay from "@/components/InfoOverlay";
import { useCsvData } from "@/hooks/useCsvData";

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
  const { currentRow, loading } = useCsvData();

  if (loading || !currentRow) return <LoadingScreen />;

  return (
    <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<LoadingScreen />}>
        <PanoramaViewer key={currentRow.rawImageUrl} imageUrl={currentRow.rawImageUrl} />
      </Suspense>
      <InfoOverlay
        data={{
          city: currentRow.city,
          latitude: currentRow.latitude,
          longitude: currentRow.longitude,
          distanceToDetroit: currentRow.distanceToDetroit,
        }}
      />
    </div>
  );
};

export default Index;
