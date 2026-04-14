import { useState, useEffect } from "react";
import type { PopSegment } from "@/hooks/useCsvData";

const s = (px: number) => `${(px / 3840) * 100}vw`;

const BOX_WIDTH = 875;

interface BottomInfoBoxesProps {
  overlaysVisible: boolean;
  showAnnotated: boolean;
  topNonEnglish: string[];
  englishPct: number;
  nonEnglishPct: number;
  fastestEthnicities: { name: string; growthPct: number }[];
  populationShare: PopSegment[];
}

const ETHNICITY_COLORS: Record<string, string> = {
  "Arab/Middle Eastern": "#4cd97b",
  "Middle Eastern": "#4cd97b",
  "Hispanic or Latino": "#f5a623",
  "Hispanic/Latino": "#f5a623",
  "East Asian": "#e63b2e",
  "South Asian": "#f5d638",
};

const getEthnicityColor = (name: string): string => {
  return ETHNICITY_COLORS[name] || "#fff";
};

const headerFont = {
  fontFamily: "'Ubuntu Mono', monospace",
  fontWeight: 700,
  fontSize: s(29),
  color: "#fff",
  lineHeight: 1,
} as const;

const STAGGER_DELAY = 400;

const HalfDonut = ({ englishPct, nonEnglishPct }: { englishPct: number; nonEnglishPct: number }) => {
  const size = 280;
  const stroke = 40;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const engAngleEnd = 180 + (englishPct / 100) * 180;
  const toRad = (a: number) => (a * Math.PI) / 180;

  const describeArc = (startAngle: number, endAngle: number) => {
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const labelR = r * 0.55;
  const engMid = 180 + (englishPct / 100) * 90;
  const nonEngMid = engAngleEnd + (nonEnglishPct / 100) * 90;

  return (
    <svg viewBox={`0 0 ${size} ${size * 0.58}`} style={{ width: s(280), height: s(162) }}>
      <path d={describeArc(180, engAngleEnd)} fill="none" stroke="#ffffff" strokeWidth={stroke} strokeLinecap="butt" />
      <path d={describeArc(engAngleEnd + 0.5, 360)} fill="none" stroke="#8f8f8f" strokeWidth={stroke} strokeLinecap="butt" />
      {/* English label */}
      <text x={cx + labelR * Math.cos(toRad(engMid))} y={cy + labelR * Math.sin(toRad(engMid))} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="20" fontFamily="'Ubuntu Mono', monospace" fontWeight="700">{englishPct.toFixed(2)}%</text>
      <text x={cx + labelR * Math.cos(toRad(engMid))} y={cy + labelR * Math.sin(toRad(engMid)) + 18} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="var(--font-display)">English</text>
      {/* Non-English label */}
      <text x={cx + labelR * Math.cos(toRad(nonEngMid))} y={cy + labelR * Math.sin(toRad(nonEngMid))} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="20" fontFamily="'Ubuntu Mono', monospace" fontWeight="700">{nonEnglishPct.toFixed(2)}%</text>
      <text x={cx + labelR * Math.cos(toRad(nonEngMid))} y={cy + labelR * Math.sin(toRad(nonEngMid)) + 18} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="var(--font-display)">Non-English</text>
    </svg>
  );
};

const PopDonut = ({ segments }: { segments: PopSegment[] }) => {
  const size = 280;
  const stroke = 36;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const toRad = (a: number) => (a * Math.PI) / 180;

  const describeArc = (startAngle: number, endAngle: number) => {
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  let angle = -90; // start from top
  const arcs = segments.map((seg) => {
    const sweep = (seg.pct / 100) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { ...seg, start, end };
  });

  // label radius
  const labelR = r * 0.6;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: s(260), height: s(260) }}>
      {arcs.map((arc, i) => (
        <path key={i} d={describeArc(arc.start, arc.end - 0.3)} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="butt" />
      ))}
      {arcs.map((arc, i) => {
        const mid = (arc.start + arc.end) / 2;
        const x = cx + labelR * Math.cos(toRad(mid));
        const y = cy + labelR * Math.sin(toRad(mid));
        if (arc.pct < 3) return null; // skip tiny labels
        return (
          <g key={`label-${i}`}>
            <text x={x} y={y - 6} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="13" fontFamily="'Ubuntu Mono', monospace" fontWeight="700">
              {arc.pct.toFixed(2)}%
            </text>
            <text x={x} y={y + 8} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.8)" fontSize="9" fontFamily="var(--font-display)">
              {arc.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const BottomInfoBoxes = ({
  overlaysVisible,
  showAnnotated,
  topNonEnglish,
  englishPct,
  nonEnglishPct,
  fastestEthnicities,
  populationShare,
}: BottomInfoBoxesProps) => {
  const [visibleBars, setVisibleBars] = useState(0);
  const [visibleEthBars, setVisibleEthBars] = useState(0);

  // Reset bars immediately when overlays disappear (wipe starting)
  useEffect(() => {
    if (!overlaysVisible) {
      setVisibleBars(0);
      setVisibleEthBars(0);
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

  // Stagger ethnicity bars
  useEffect(() => {
    if (!overlaysVisible || fastestEthnicities.length === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    fastestEthnicities.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleEthBars((v) => Math.max(v, i + 1)), (i + 1) * STAGGER_DELAY)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [overlaysVisible, fastestEthnicities]);

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
            height: "auto",
            padding: `${s(10)} ${s(24)}`,
            display: "flex",
            alignItems: "baseline",
            gap: s(16),
          }}
        >
          <span style={headerFont}>Demographics</span>
          <span style={{ ...headerFont, fontWeight: 300, fontSize: s(19) }}>within 20 minutes of this location</span>
        </div>
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            flex: 1,
            minHeight: s(320),
            borderRadius: `0 0 ${s(20)} 0`,
            padding: `${s(16)} ${s(32)}`,
            display: "flex",
            flexDirection: "column",
            gap: s(8),
          }}
        >
          {/* Content row */}
          <div style={{ display: "flex", gap: s(40), flex: 1, alignItems: "flex-start" }}>
            {/* Left – population donut */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: s(22), color: "rgba(255,255,255,0.7)", marginBottom: s(16) }}>
                2020 Population Share
              </span>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PopDonut segments={populationShare} />
              </div>
            </div>
            {/* Right – ethnicity bars */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: s(22), color: "rgba(255,255,255,0.7)", marginBottom: s(16) }}>
                Fastest Growing (2010 – 20)
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: s(12) }}>
              {fastestEthnicities.map((eth, i) => (
                <div
                  key={eth.name}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    height: s(55),
                    opacity: i < visibleEthBars ? 1 : 0,
                    transform: i < visibleEthBars ? "translateX(0)" : "translateX(20px)",
                    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                  }}
                >
                  <div style={{ width: s(8), background: getEthnicityColor(eth.name), flexShrink: 0 }} />
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: `0 ${s(16)}`,
                      gap: s(8),
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 400,
                        fontSize: s(29),
                        color: "#000",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {eth.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 400,
                        fontSize: s(29),
                        color: "#000",
                        whiteSpace: "nowrap",
                        opacity: 0.7,
                      }}
                    >
                      (+{eth.growthPct.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              ))}
              </div>
            </div>
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
            height: "auto",
            padding: `${s(10)} ${s(24)}`,
            display: "flex",
            alignItems: "baseline",
            gap: s(16),
          }}
        >
          <span style={headerFont}>Linguistic Diversity</span>
          <span style={{ ...headerFont, fontWeight: 300, fontSize: s(19) }}>within 20 minutes of this location</span>
        </div>
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            flex: 1,
            minHeight: s(320),
            borderRadius: `0 0 0 ${s(20)}`,
            padding: `${s(16)} ${s(32)}`,
            display: "flex",
            flexDirection: "column",
            gap: s(8),
          }}
        >
          {/* Content row: donut + bars aligned */}
          <div style={{ display: "flex", gap: s(40), flex: 1, alignItems: "flex-start" }}>
            {/* Left – donut */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: s(22), color: "rgba(255,255,255,0.7)", marginBottom: s(16) }}>
                % of Languages Identified
              </span>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <HalfDonut englishPct={englishPct} nonEnglishPct={nonEnglishPct} />
              </div>
            </div>
            {/* Right – bars (stacked vertically) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: s(22), color: "rgba(255,255,255,0.7)", marginBottom: s(16) }}>
                Top Non-Eng. Languages
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: s(12) }}>
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
                  <div style={{ width: s(8), background: "#fff", flexShrink: 0 }} />
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
                        fontWeight: 400,
                        fontSize: s(29),
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
      </div>
    </div>
  );
};

export default BottomInfoBoxes;
