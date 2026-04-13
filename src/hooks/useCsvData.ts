import { useState, useEffect } from "react";
import Papa from "papaparse";

const CSV_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/refs/heads/main/panos/point_language_with_info.csv";
const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/main/panos/";

const DISPLAY_DURATION = 45000; // 45 seconds per image

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

  useEffect(() => {
    if (rows.length === 0) return;
    const interval = setInterval(() => {
      setShowAnnotated((prev) => {
        if (!prev) {
          // Currently showing raw -> switch to annotated
          return true;
        } else {
          // Currently showing annotated -> move to next row, show raw
          setCurrentIndex((idx) => (idx + 1) % rows.length);
          return false;
        }
      });
    }, DISPLAY_DURATION);
    return () => clearInterval(interval);
  }, [rows.length]);

  const currentRow = rows[currentIndex];
  const currentImageUrl = currentRow
    ? showAnnotated
      ? currentRow.annotatedImageUrl
      : currentRow.rawImageUrl
    : "";

  return { currentRow, currentImageUrl, showAnnotated, loading, rows, currentIndex };
}
