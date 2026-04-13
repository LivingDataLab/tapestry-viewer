interface LocationData {
  city: string;
  latitude: number;
  longitude: number;
  distanceToDetroit: number;
}

interface InfoOverlayProps {
  data: LocationData;
}

/*
 * All dimensions are derived from the reference SVG (3840×2160 viewBox).
 * We use vw units so the layout scales perfectly on any 16:9 display.
 * Conversion: 1 SVG-px = (100 / 3840) vw ≈ 0.02604vw
 */
const svgPx = (px: number) => `${(px / 3840) * 100}vw`;
const svgPxV = (px: number) => `${(px / 2160) * 100}vh`;

const InfoOverlay = ({ data }: InfoOverlayProps) => {
  const latDir = data.latitude >= 0 ? "N" : "S";
  const lonDir = data.longitude <= 0 ? "W" : "E";
  const latDisplay = Math.abs(data.latitude).toFixed(2);
  const lonDisplay = Math.abs(data.longitude).toFixed(2);
  const distDisplay = data.distanceToDetroit.toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Top info bar – centered */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: svgPx(1134.74), // 2487.37 - 1352.63
        }}
      >
        {/* City name rounded-top box */}
        <div
          style={{
            width: "100%",
            background: "#000",
            borderRadius: `${svgPx(29)} ${svgPx(29)} 0 0`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: svgPxV(131), // y=29.37 to y=160
            paddingTop: svgPxV(29), // account for the part above viewport edge
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: svgPx(78.54),
              color: "hsl(var(--foreground))",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {data.city}
          </span>
        </div>

        {/* Bottom tabs row */}
        <div style={{ display: "flex", width: "100%" }}>
          {/* Left tab - coordinates */}
          <div
            style={{
              background: "var(--info-bar-left)",
              height: svgPxV(55),
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: svgPx(29),
                color: "hsl(var(--foreground))",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {latDisplay}°{latDir}, {lonDisplay}°{lonDir}
            </span>
          </div>
          {/* Right tab - distance */}
          <div
            style={{
              background: "var(--info-bar-right)",
              height: svgPxV(55),
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: svgPx(29),
                color: "hsl(var(--foreground))",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {distDisplay} miles to Detroit
            </span>
          </div>
        </div>
      </div>

      {/* Development Preview badge - upper right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "red",
          width: svgPx(733.45),
          height: svgPxV(107.85),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: svgPx(45),
            color: "hsl(var(--foreground))",
            whiteSpace: "nowrap",
          }}
        >
          DEVELOPMENT PREVIEW
        </span>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: svgPxV(363.27),
          background: "var(--bottom-fade)",
        }}
      />
    </div>
  );
};

export default InfoOverlay;
export type { LocationData };
