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
 * All dimensions from the reference SVG (3840×2160, 16:9).
 * We use vw for everything so the layout scales uniformly.
 * 2160/3840 = 0.5625, so 1 SVG-Y-px = (px / 3840 * 100 / 0.5625) ... 
 * Simpler: just use vw for horizontal and vertical since aspect ratio is fixed.
 * Vertical SVG-px to vw: px / 3840 * 100 * (3840/2160) = px / 2160 * 100 ... 
 * Actually let's just convert everything to % of 3840 width using vw.
 * For vertical: svgPx(height_in_svg * 3840/2160) ... no.
 * 
 * Cleanest: everything in vw. 
 * Horizontal: px / 3840 * 100 vw
 * Vertical: px / 2160 * 100 * (9/16) ... no.
 * 
 * On a 16:9 screen: 100vw = 3840 SVG-px, 56.25vw = 2160 SVG-px.
 * So vertical SVG-px to vw = px / 2160 * 56.25 = px * 0.02604vw
 * Horizontal SVG-px to vw = px / 3840 * 100 = px * 0.02604vw
 * They're the same! 1 SVG-px = 0.02604vw in both axes. Perfect.
 */
const s = (px: number) => `${(px / 3840) * 100}vw`;

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
      {/* Top info bar – centered at x=1920 */}
      <div
        style={{
          position: "absolute",
          top: s(30),
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: s(1134), // ~566*2
        }}
      >
        {/* City name rounded-top box: y≈29 to y≈160, ~131px tall */}
        <div
          style={{
            width: "100%",
            background: "#000",
            borderRadius: `${s(20)} ${s(20)} 0 0`,
            height: s(160), // from top of viewport to bottom of city box
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: s(20),
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: s(78.54),
              color: "hsl(var(--foreground))",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {data.city}
          </span>
        </div>

        {/* Bottom tabs row: y=160 to y=215, height=55 */}
        <div style={{ display: "flex", width: "100%" }}>
          {/* Left tab - coordinates */}
          <div
            style={{
              background: "var(--info-bar-left)",
              height: s(55),
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: s(29),
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
              height: s(55),
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: s(29),
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

      {/* Development Preview badge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "red",
          width: s(733.45),
          height: s(107.85),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: s(45),
            color: "hsl(var(--foreground))",
            whiteSpace: "nowrap",
          }}
        >
          DEVELOPMENT PREVIEW
        </span>
      </div>

      {/* Bottom fade: y=1802.27 to y=2160, height=357.73 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: s(357.73),
          background: "var(--bottom-fade)",
        }}
      />
    </div>
  );
};

export default InfoOverlay;
export type { LocationData };
