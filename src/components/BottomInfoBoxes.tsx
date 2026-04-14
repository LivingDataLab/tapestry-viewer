const s = (px: number) => `${(px / 3840) * 100}vw`;

const BOX_WIDTH = 875; // px in design coords

interface BottomInfoBoxesProps {
  overlaysVisible: boolean;
  showAnnotated: boolean;
}

const headerFont = {
  fontFamily: "'Ubuntu Mono', monospace",
  fontWeight: 700,
  fontSize: s(52),
  color: "#fff",
  lineHeight: 1,
} as const;

const BottomInfoBoxes = ({ overlaysVisible, showAnnotated }: BottomInfoBoxesProps) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: s(40),
        left: s(60),
        right: s(60),
        zIndex: 15,
        display: "flex",
        gap: s(40),
        opacity: overlaysVisible ? 1 : 0,
        transition: "opacity 1s ease-in-out",
        pointerEvents: "none",
      }}
    >
      {/* Left box — Area Demographics */}
      <div style={{ width: s(BOX_WIDTH), flexShrink: 0, display: "flex", flexDirection: "column" }}>
        {/* Red header with right-side rounded corners */}
        <div
          style={{
            background: "#e60000",
            borderRadius: `0 ${s(20)} 0 0`,
            height: s(50),
            padding: `0 ${s(24)}`,
            display: "flex",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <span style={headerFont}>
            Area Demographics
          </span>
        </div>
        {/* Gray body with rounded bottom-right */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            flex: 1,
            minHeight: s(320),
            borderRadius: `0 0 ${s(20)} 0`,
            padding: `${s(24)} ${s(32)}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: s(28),
                color: "rgba(255,255,255,0.9)",
              }}
            >
              2020 Population Share
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: s(28),
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Fastest Growing Ethnicities (2010 – 2020)
            </span>
          </div>
        </div>
      </div>

      {/* Right box — Area Linguistic Diversity */}
      <div style={{ width: s(BOX_WIDTH), flexShrink: 0, display: "flex", flexDirection: "column", marginLeft: "auto" }}>
        {/* Green header with left-side rounded corners */}
        <div
          style={{
            background: "#2ecc71",
            borderRadius: `${s(20)} 0 0 0`,
            height: s(50),
            padding: `0 ${s(24)}`,
            display: "flex",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <span style={headerFont}>
            Area Linguistic Diversity
          </span>
        </div>
        {/* Gray body with rounded bottom-left */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            flex: 1,
            minHeight: s(320),
            borderRadius: `0 0 0 ${s(20)}`,
            padding: `${s(24)} ${s(32)}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* Placeholder for content */}
        </div>
      </div>
    </div>
  );
};

export default BottomInfoBoxes;
