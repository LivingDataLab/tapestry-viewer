const s = (px: number) => `${(px / 3840) * 100}vw`;

interface BottomInfoBoxesProps {
  overlaysVisible: boolean;
  showAnnotated: boolean;
}

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
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Red header */}
        <div
          style={{
            background: "#e60000",
            padding: `${s(16)} ${s(24)}`,
            display: "flex",
            alignItems: "baseline",
            gap: s(16),
          }}
        >
          <span
            style={{
              fontFamily: "'Ubuntu Mono', monospace",
              fontWeight: 700,
              fontSize: s(52),
              color: "#fff",
              lineHeight: 1,
            }}
          >
            Area Demographics
          </span>
          <span
            style={{
              fontFamily: "'Ubuntu Mono', monospace",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: s(24),
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1,
            }}
          >
            *within a 20-minute drive of this point
          </span>
        </div>
        {/* Gray body */}
        <div
          style={{
            background: "rgba(80, 80, 80, 0.85)",
            flex: 1,
            minHeight: s(320),
            padding: `${s(24)} ${s(32)}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* Bottom labels */}
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

      {/* Right box — different design (placeholder) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(0, 0, 0, 0.75)",
          border: "1px solid rgba(255,255,255,0.15)",
          minHeight: s(320 + 84),
          padding: `${s(24)} ${s(32)}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: s(40),
            color: "rgba(255,255,255,0.9)",
            marginBottom: s(12),
          }}
        >
          Language Landscape
        </span>
        <span
          style={{
            fontFamily: "'Ubuntu Mono', monospace",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: s(22),
            color: "rgba(255,255,255,0.55)",
          }}
        >
          *detected from street-level signage at this point
        </span>
      </div>
    </div>
  );
};

export default BottomInfoBoxes;
