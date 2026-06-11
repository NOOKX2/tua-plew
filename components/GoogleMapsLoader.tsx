"use client";

import type { ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LOADER_ID,
} from "@/lib/google-maps";

type Props = {
  children: ReactNode;
  loading: ReactNode;
  error: ReactNode;
};

/** โหลด Google Maps script ที่เดียวทั้งแอป — ห้ามเรียก useJsApiLoader ที่อื่น */
export default function GoogleMapsLoader({
  children,
  loading,
  error,
}: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return error;
  }

  if (!isLoaded) {
    return loading;
  }

  return children;
}
