interface LocationData {
  city: string;
  latitude: number;
  longitude: number;
  distanceToDetroit: number;
}

interface InfoOverlayProps {
  data: LocationData;
  showAnnotated: boolean;
  isWiping?: boolean;
  overlaysVisible?: boolean;
}

const s = (px: number) => `${(px / 3840) * 100}vw`;

const InfoOverlay = ({ data, showAnnotated, isWiping, overlaysVisible = true }: InfoOverlayProps) => {
  const latDir = data.latitude >= 0 ? "N" : "S";
  const lonDir = data.longitude <= 0 ? "W" : "E";
  const latDisplay = Math.abs(data.latitude).toFixed(2);
  const lonDisplay = Math.abs(data.longitude).toFixed(2);
  const distDisplay = data.distanceToDetroit.toFixed(2);

  const showMachineVision = showAnnotated && !isWiping;

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
          top: s(30),
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: s(1134),
        }}
      >
        {/* City name rounded-top box */}
        <div
          style={{
            width: "100%",
            background: "#000",
            borderRadius: `${s(20)} ${s(20)} 0 0`,
            height: s(160),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: s(20),
            boxSizing: "border-box",
            position: "relative",
            zIndex: 2,
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

        {/* Bottom tabs row */}
        <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 2 }}>
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

        {/* Machine Vision View bar – slides from behind the tabs */}
        <div
          style={{
            width: "100%",
            height: s(50),
            background: "#2424e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            marginTop: showMachineVision ? 0 : `calc(-1 * ${s(50)})`,
            opacity: showMachineVision ? 1 : 0,
            transition: "margin-top 1.5s ease-out, opacity 1.5s ease-out",
          }}
        >
          <span
            style={{
              fontFamily: "'Ubuntu Mono', monospace",
              fontWeight: 400,
              fontSize: s(29),
              color: "hsl(var(--foreground))",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            Machine Vision View
          </span>
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

      {/* Bottom fade */}
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
