import { useState, useEffect } from "react";

const s = (px: number) => `${(px / 3840) * 100}vw`;

const BOX_WIDTH = 875;

interface BottomInfoBoxesProps {
  overlaysVisible: boolean;
  showAnnotated: boolean;
  topNonEnglish: string[];
  englishPct: number;
  nonEnglishPct: number;
}

const headerFont = {
  fontFamily: "'Ubuntu Mono', monospace",
  fontWeight: 700,
  fontSize: s(29),
  color: "#fff",
  lineHeight: 1,
} as const;

const STAGGER_DELAY = 400; // ms between each bar appearing

const BottomInfoBoxes = ({
  overlaysVisible,
  showAnnotated,
  topNonEnglish,
  englishPct,
  nonEnglishPct,
}: BottomInfoBoxesProps) => {
  const [visibleBars, setVisibleBars] = useState(0);

  // Reset bars immediately when overlays disappear (wipe starting)
  useEffect(() => {
    if (!overlaysVisible) {
      setVisibleBars(0);
    }
  }, [overlaysVisible]);

  // Stagger bars in after overlays become visible again (wipe done)
  useEffect(() => {
    if (!overlaysVisible || topNonEnglish.length === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    topNonEnglish.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleBars((v) => Math.max(v, i + 1)), (i + 1) * STAGGER_DELAY)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [overlaysVisible, topNonEnglish]);

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
        <div
          style={{
            background: showAnnotated ? "#0000ff" : "#e60000",
            transition: "background 1s ease-in-out",
            borderRadius: `0 ${s(20)} 0 0`,
            height: s(50),
            padding: `0 ${s(24)}`,
            display: "flex",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <span style={headerFont}>Area Demographics</span>
        </div>
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
        <div
          style={{
            background: showAnnotated ? "#0000ff" : "#2ecc71",
            transition: "background 1s ease-in-out",
            borderRadius: `${s(20)} 0 0 0`,
            height: s(50),
            padding: `0 ${s(24)}`,
            display: "flex",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <span style={headerFont}>Area Linguistic Diversity</span>
        </div>
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            flex: 1,
            minHeight: s(320),
            borderRadius: `0 0 0 ${s(20)}`,
            padding: `${s(24)} ${s(32)}`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: s(40),
          }}
        >
          {/* Left side – half-donut placeholder area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {/* Donut chart placeholder — will be filled later */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: s(28),
                color: "rgba(255,255,255,0.9)",
                textAlign: "center",
              }}
            >
              Proportion of Languages Identified
            </div>
          </div>

          {/* Right side – language bars */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: s(12), justifyContent: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: s(22),
                color: "rgba(255,255,255,0.7)",
                marginBottom: s(8),
              }}
            >
              Most Identified Non-English Languages
            </div>
            {topNonEnglish.map((lang, i) => (
              <div
                key={lang}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  height: s(55),
                  opacity: i < visibleBars ? 1 : 0,
                  transform: i < visibleBars ? "translateX(0)" : "translateX(20px)",
                  transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                }}
              >
                {/* White accent bar */}
                <div
                  style={{
                    width: s(8),
                    background: "#fff",
                    flexShrink: 0,
                  }}
                />
                {/* Label block */}
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: `0 ${s(16)}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: s(30),
                      color: "#000",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lang}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomInfoBoxes;
