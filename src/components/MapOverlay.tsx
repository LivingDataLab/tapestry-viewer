import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlYXZjbHViIiwiYSI6ImNpaTloZWN1ZDAwNjZ1ZWx6YzFqbXU2b2kifQ.Wy1iiOH6_dap7-ItvpZAvg";

interface MapOverlayProps {
  latitude: number;
  longitude: number;
  showAnnotated: boolean;
}

const MASK =
  "radial-gradient(ellipse 750px 290px at center 52%, black 0%, black 96%, transparent 100%)";
const MASK_RAW =
  "radial-gradient(ellipse 750px 290px at center 52%, black 0%, black 91%, transparent 100%)";

const MapOverlay = ({ latitude, longitude, showAnnotated }: MapOverlayProps) => {
  const rawContainerRef = useRef<HTMLDivElement>(null);
  const annContainerRef = useRef<HTMLDivElement>(null);
  const rawMapRef = useRef<mapboxgl.Map | null>(null);
  const annMapRef = useRef<mapboxgl.Map | null>(null);

  const detroitCenter: [number, number] = [-83.0458, 42.3314];

  const cacheBust = `?fresh=${Date.now()}`;

  // Shared map options
  const sharedOpts = {
    center: detroitCenter as [number, number],
    zoom: 10.15,
    pitch: 65,
    bearing: 0,
    interactive: false,
    attributionControl: false,
  };

  useEffect(() => {
    if (!rawContainerRef.current || !annContainerRef.current) return;

    // --- Raw map (shown during raw_image) ---
    const rawMap = new mapboxgl.Map({
      container: rawContainerRef.current,
      style: `mapbox://styles/theavclub/cmnwlu0fm001601qvamstaa1w${cacheBust}`,
      ...sharedOpts,
    });
    rawMapRef.current = rawMap;

    // --- Annotated map (shown during annotated_image) ---
    const annMap = new mapboxgl.Map({
      container: annContainerRef.current,
      style: "mapbox://styles/theavclub/cmnv31zrk00cf01qt5k8x2pj5",
      ...sharedOpts,
    });
    annMapRef.current = annMap;

    // Pulsing dot on annotated map
    const dot = document.createElement("div");
    dot.className = "pulsing-dot";
    const innerDot = document.createElement("div");
    innerDot.className = "pulse-dot";
    dot.appendChild(innerDot);
    new mapboxgl.Marker({ element: dot })
      .setLngLat([longitude, latitude])
      .addTo(annMap);

    // Also add dot to raw map (red)
    const dot2 = document.createElement("div");
    dot2.className = "pulsing-dot";
    const innerDot2 = document.createElement("div");
    innerDot2.className = "pulse-dot pulse-dot-red";
    dot2.appendChild(innerDot2);
    new mapboxgl.Marker({ element: dot2 })
      .setLngLat([longitude, latitude])
      .addTo(rawMap);

    // Annotated map: make land/water translucent
    annMap.on("load", () => {
      const style = annMap.getStyle();
      if (style?.layers) {
        for (const layer of style.layers) {
          if (layer.type === "background") {
            annMap.setPaintProperty(layer.id, "background-opacity", 0);
          } else if (layer.type === "fill" && layer.id !== "road") {
            try {
              annMap.setPaintProperty(layer.id, "fill-opacity", 0.85);
            } catch {}
          }
        }
      }
    });

    // Zoom sequence on annotated map after 5s
    annMap.on("load", () => {
      setTimeout(() => {
        annMap.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          duration: 5000,
          easing: (t) => t,
        });
      }, 5000);
    });

    // Same zoom on raw map so they stay in sync
    rawMap.on("load", () => {
      setTimeout(() => {
        rawMap.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          duration: 5000,
          easing: (t) => t,
        });
      }, 5000);
    });

    return () => {
      rawMap.remove();
      annMap.remove();
      rawMapRef.current = null;
      annMapRef.current = null;
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
      {/* Translucent black circle backdrop */}
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
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 60%, transparent 70%)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -45%)",
          }}
        />
      </div>

      {/* Raw map layer (66% opacity, visible during raw_image) */}
      <div
        ref={rawContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          maskImage: MASK_RAW,
          WebkitMaskImage: MASK_RAW,
          opacity: showAnnotated ? 0 : 0.66,
          transition: "opacity 1s ease-in-out",
        }}
      />

      {/* Annotated map layer (100% opacity, visible during annotated_image) */}
      <div
        ref={annContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          maskImage: MASK,
          WebkitMaskImage: MASK,
          opacity: showAnnotated ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      />

      <style>{`
        .pulsing-dot {
          position: relative;
          width: 27px;
          height: 27px;
        }
        .pulse-dot {
          width: 27px;
          height: 27px;
          background-color: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
        }
        .pulse-dot-red {
          background-color: #ff0000;
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
        .pulse-dot-red::before {
          background-color: #ff0000;
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
