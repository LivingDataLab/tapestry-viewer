import { useState, useEffect } from "react";
import Papa from "papaparse";

const CSV_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/refs/heads/main/panos/point_language_with_info.csv";
const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/LivingDataLab/tapestries/main/panos/";

export interface PanoRow {
  city: string;
  latitude: number;
  longitude: number;
  distanceToDetroit: number;
  rawImageUrl: string;
}

export function useCsvData() {
  const [rows, setRows] = useState<PanoRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
          }))
          .filter((r: PanoRow) => r.rawImageUrl !== BASE_IMAGE_URL);
        setRows(parsed);
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    if (rows.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rows.length);
    }, 30000); // 30 seconds per panorama
    return () => clearInterval(interval);
  }, [rows.length]);

  return { currentRow: rows[currentIndex], loading, rows, currentIndex };
}
