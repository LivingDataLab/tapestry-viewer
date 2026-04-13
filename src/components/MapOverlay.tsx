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
    const innerDot = document.createElement("div");
    innerDot.className = "pulse-dot";
    dot.appendChild(innerDot);

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

      // Animate zoom after 3s delay
      setTimeout(() => {
        map.easeTo({
          zoom: 12.5,
          duration: 3000,
          easing: (t) => t,
        });
      }, 3000);
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
        left: "50%",
        transform: "translateX(-50%) translateY(calc(50% - 250px))",
        width: "1950px",
        height: "870px",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {/* Translucent black circle with feathered edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "1700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 60%, transparent 70%)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -45%)",
          }}
        />
      </div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 750px 340px at center 42%, black 0%, black 50%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 750px 340px at center 42%, black 0%, black 50%, transparent 70%)",
          opacity: 0.85,
        }}
      />
      <style>{`
        .pulsing-dot {
          position: relative;
          width: 18px;
          height: 18px;
        }
        .pulse-dot {
          width: 18px;
          height: 18px;
          background-color: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
        }
        .pulse-dot::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #ffffff;
          transform: translate(-50%, -50%);
          animation: pulse-ring 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .mapboxgl-canvas { pointer-events: none !important; }
      `}</style>
    </div>
  );
};

export default MapOverlay;
