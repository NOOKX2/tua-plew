/** อ่านครั้งเดียวตอน build/start — ห้ามอ่านซ้ำใน component เพื่อกัน loader conflict */
const raw = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export const GOOGLE_MAPS_API_KEY = raw.trim();

export const GOOGLE_MAPS_LOADER_ID = "tua-plew-google-maps";

export function hasGoogleMapsApiKey(): boolean {
  return (
    GOOGLE_MAPS_API_KEY.length > 0 &&
    GOOGLE_MAPS_API_KEY !== "your_api_key_here"
  );
}
