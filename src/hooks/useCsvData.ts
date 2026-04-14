import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

const CSV_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/main/panos/point_language_with_info_census.csv";
const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/main/panos/";

const DISPLAY_DURATION = 45000;
const WIPE_HALF = 800; // time for each half of the wipe
const OVERLAY_FADE_DELAY = 500; // delay before overlays fade in after wipe

export interface PopSegment {
  label: string;
  pct: number;
  color: string;
}

export interface PanoRow {
  city: string;
  latitude: number;
  longitude: number;
  distanceToDetroit: number;
  rawImageUrl: string;
  annotatedImageUrl: string;
  englishPct: number;
  nonEnglishPct: number;
  topNonEnglish: string[];
  fastestEthnicities: { name: string; growthPct: number }[];
  populationShare: PopSegment[];
}

export type WipePhase = "none" | "covering" | "revealing";

export function useCsvData() {
  const [rows, setRows] = useState<PanoRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wipePhase, setWipePhase] = useState<WipePhase>("none");
  const [overlaysVisible, setOverlaysVisible] = useState(true);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: PanoRow[] = results.data
          .map((row: any) => {
            const engCount = parseFloat(row["English Count"]) || 0;
            const nonEngCount = parseFloat(row["Non-English Count"]) || 0;
            const total = engCount + nonEngCount;
            const topLangs = (row["Top 3 Non-English"] || "")
              .split(",")
              .map((l: string) => l.trim())
              .filter(Boolean);
            const popFields = [
              { key: "pop_2023_white_nh", label: "White", color: "#3b82f6" },
              { key: "pop_2023_black", label: "Black", color: "#555555" },
              { key: "pop_2023_hispanic", label: "Hispanic/Latino", color: "#f5a623" },
              { key: "pop_2023_east_asian", label: "E. Asian", color: "#e63b2e" },
              { key: "pop_2023_south_asian", label: "S. Asian", color: "#f5d638" },
              { key: "pop_2023_middle_eastern", label: "Middle Eastern", color: "#4cd97b" },
              { key: "pop_2023_other", label: "Other", color: "#a855f7" },
            ];
            const popRaw = popFields.map(f => ({ ...f, val: parseFloat(row[f.key]) || 0 }));
            const popTotal = popRaw.reduce((sum, p) => sum + p.val, 0);
            const populationShare: PopSegment[] = popRaw
              .filter(p => p.val > 0)
              .map(p => ({
                label: p.label,
                pct: popTotal > 0 ? parseFloat(((p.val / popTotal) * 100).toFixed(2)) : 0,
                color: p.color,
              }));

            return {
              city: row["City"] || "Unknown",
              latitude: parseFloat(row["Latitude"]) || 0,
              longitude: parseFloat(row["Longitude"]) || 0,
              distanceToDetroit:
                parseFloat(row["Distance_to_CampusMartius_mi"]) || 0,
              rawImageUrl: BASE_IMAGE_URL + (row["raw_image"] || ""),
              annotatedImageUrl: BASE_IMAGE_URL + (row["annotated_image"] || ""),
              englishPct: total > 0 ? parseFloat(((engCount / total) * 100).toFixed(2)) : 0,
              nonEnglishPct: total > 0 ? parseFloat(((nonEngCount / total) * 100).toFixed(2)) : 0,
              topNonEnglish: topLangs,
              fastestEthnicities: [
                { name: row["fastest_prop_1"] || "", growthPct: parseFloat(row["fastest_prop_1_pp"]) || 0 },
                { name: row["fastest_prop_2"] || "", growthPct: parseFloat(row["fastest_prop_2_pp"]) || 0 },
                { name: row["fastest_prop_3"] || "", growthPct: parseFloat(row["fastest_prop_3_pp"]) || 0 },
              ].filter(e => e.name),
              populationShare,
            };
          })
          .filter((r: PanoRow) => r.rawImageUrl !== BASE_IMAGE_URL);
        setRows(parsed);
        setLoading(false);
      },
    });
  }, []);

  const advanceRow = useCallback(() => {
    setOverlaysVisible(false);
    // Phase 1: cover screen with black from top-left
    setWipePhase("covering");
    // At full coverage, switch content and start reveal
    setTimeout(() => {
      setCurrentIndex((idx) => (idx + 1) % rows.length);
      setShowAnnotated(false);
      setWipePhase("revealing");
    }, WIPE_HALF);
    // Phase 2 complete: reveal done, then fade in overlays
    setTimeout(() => {
      setWipePhase("none");
    }, WIPE_HALF * 2);
    setTimeout(() => {
      setOverlaysVisible(true);
    }, WIPE_HALF * 2 + OVERLAY_FADE_DELAY);
  }, [rows.length]);

  // Preload next row's images so Suspense doesn't flash "Loading"
  useEffect(() => {
    if (rows.length < 2) return;
    const nextIndex = (currentIndex + 1) % rows.length;
    const next = rows[nextIndex];
    const img1 = new Image();
    const img2 = new Image();
    img1.src = next.rawImageUrl;
    img2.src = next.annotatedImageUrl;
  }, [rows, currentIndex]);

  useEffect(() => {
    if (rows.length === 0) return;
    const interval = setInterval(() => {
      setShowAnnotated((prev) => {
        if (!prev) {
          return true;
        } else {
          advanceRow();
          return prev;
        }
      });
    }, DISPLAY_DURATION);
    return () => clearInterval(interval);
  }, [rows.length, advanceRow]);

  const currentRow = rows[currentIndex];

  return { currentRow, showAnnotated, loading, rows, currentIndex, wipePhase, overlaysVisible };
}

export { WIPE_HALF };
