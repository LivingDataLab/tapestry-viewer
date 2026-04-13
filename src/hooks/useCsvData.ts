import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

const CSV_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/refs/heads/main/panos/point_language_with_info.csv";
const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/main/panos/";

const DISPLAY_DURATION = 45000; // 45 seconds per image
const WIPE_DURATION = 1200; // 1.2s wipe transition

export interface PanoRow {
  city: string;
  latitude: number;
  longitude: number;
  distanceToDetroit: number;
  rawImageUrl: string;
  annotatedImageUrl: string;
}

export function useCsvData() {
  const [rows, setRows] = useState<PanoRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: PanoRow[] = results.data
          .map((row: any) => ({
            city: row["City"] || "Unknown",
            latitude: parseFloat(row["Latitude"]) || 0,
            longitude: parseFloat(row["Longitude"]) || 0,
            distanceToDetroit:
              parseFloat(row["Distance_to_CampusMartius_mi"]) || 0,
            rawImageUrl: BASE_IMAGE_URL + (row["raw_image"] || ""),
            annotatedImageUrl: BASE_IMAGE_URL + (row["annotated_image"] || ""),
          }))
          .filter((r: PanoRow) => r.rawImageUrl !== BASE_IMAGE_URL);
        setRows(parsed);
        setLoading(false);
      },
    });
  }, []);

  const advanceRow = useCallback(() => {
    // Start wipe
    setWiping(true);
    // At midpoint of wipe (screen fully black), switch row
    setTimeout(() => {
      setCurrentIndex((idx) => (idx + 1) % rows.length);
      setShowAnnotated(false);
    }, WIPE_DURATION / 2);
    // End wipe
    setTimeout(() => {
      setWiping(false);
    }, WIPE_DURATION);
  }, [rows.length]);

  useEffect(() => {
    if (rows.length === 0) return;
    const interval = setInterval(() => {
      setShowAnnotated((prev) => {
        if (!prev) {
          return true;
        } else {
          advanceRow();
          return prev; // keep true until wipe midpoint resets it
        }
      });
    }, DISPLAY_DURATION);
    return () => clearInterval(interval);
  }, [rows.length, advanceRow]);

  const currentRow = rows[currentIndex];

  return { currentRow, showAnnotated, loading, rows, currentIndex, wiping };
}

export { WIPE_DURATION };
