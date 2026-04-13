import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlYXZjbHViIiwiYSI6ImNpaTloZWN1ZDAwNjZ1ZWx6YzFqbXU2b2kifQ.Wy1iiOH6_dap7-ItvpZAvg";

interface MapOverlayProps {
  latitude: number;
  longitude: number;
}

const MapOverlay = ({ latitude, longitude }: MapOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/theavclub/cmnv31zrk00cf01qt5k8x2pj5",
      center: [longitude, latitude],
      zoom: 10.15,
      pitch: 65,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // Create pulsing dot marker
    const dot = document.createElement("div");
    dot.className = "pulsing-dot";

    new mapboxgl.Marker({ element: dot })
      .setLngLat([longitude, latitude])
      .addTo(map);

    map.on("load", () => {
      // Make land/water layers translucent
      const style = map.getStyle();
      if (style?.layers) {
        for (const layer of style.layers) {
          const type = layer.type;
          if (type === "background") {
            map.setPaintProperty(layer.id, "background-opacity", 0);
          } else if (type === "fill" && layer.id !== "road") {
            try {
              map.setPaintProperty(layer.id, "fill-opacity", 0.15);
            } catch {}
          }
        }
      }

      // Animate zoom
      map.easeTo({
        zoom: 12.5,
        duration: 44000,
        easing: (t) => t, // linear
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "55%",
        zIndex: 1,
        pointerEvents: "none",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%)",
        opacity: 0.6,
      }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      />
      <style>{`
        .pulsing-dot {
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(255,255,255,0.8);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 6px 2px rgba(255,255,255,0.8); }
          50% { transform: scale(1.6); opacity: 0.7; box-shadow: 0 0 16px 6px rgba(255,255,255,0.5); }
        }
        .mapboxgl-canvas { pointer-events: none !important; }
      `}</style>
    </div>
  );
};

export default MapOverlay;
