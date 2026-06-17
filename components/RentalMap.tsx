"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import type { Product, RentalLocation } from "@/lib/types";
import { hasGoogleMapsApiKey } from "@/lib/google-maps";
import { getStockTotal, getTotalStock } from "@/lib/locations";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getSizeUnitLabel } from "@/lib/i18n/labels";
import { jettsBranches } from "@/lib/jetts-locations";
import {
  APPAREL_TIER_ACCENT,
  groupStocksByApparelTier,
  type TierStockItem,
} from "@/lib/apparel-tiers";
import GoogleMapsLoader from "./GoogleMapsLoader";

const BANGKOK_CENTER = { lat: 13.7563, lng: 100.5018 };

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  fullscreenControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  clickableIcons: false,
};

function markerIcon(selected: boolean): google.maps.Symbol {
  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
    fillColor: selected ? "#2b54cc" : "#3b6ef5",
    fillOpacity: 1,
    strokeColor: selected ? "#fde68a" : "#ffffff",
    strokeWeight: selected ? 3 : 2,
    scale: selected ? 1.6 : 1.4,
    anchor: new google.maps.Point(12, 22),
  };
}

function jettsMarkerIcon(): google.maps.Symbol {
  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
    fillColor: "#dc2626",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 1.2,
    anchor: new google.maps.Point(12, 22),
  };
}

type Props = {
  locations: RentalLocation[];
  products: Product[];
  selectedId: string | null;
  focusId?: string | null;
  onSelect: (id: string) => void;
  highlightProductId?: string | null;
  onProductClick?: (productId: string, locationId: string) => void;
};

function MissingApiKeyMessage() {
  return <GoogleMapsSetupHelp variant="missing-key" />;
}

function GoogleMapsSetupHelp({
  variant,
}: {
  variant: "missing-key" | "error";
}) {
  const t = useTranslations();
  const isMissingKey = variant === "missing-key";

  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-3 rounded-xl p-6 text-center ${isMissingKey ? "bg-zinc-100" : "bg-red-50"
        }`}
    >
      <p
        className={`text-sm font-semibold ${isMissingKey ? "text-zinc-800" : "text-red-800"
          }`}
      >
        {isMissingKey ? t("map.apiKeyMissing") : t("map.loadFailed")}
      </p>

      {isMissingKey ? (
        <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
          {t("map.addKeyTo")}{" "}
          <code className="rounded bg-white px-1 py-0.5">.env.local</code>{" "}
          {t("map.thenRun")}{" "}
          <code className="rounded bg-white px-1 py-0.5">bun run dev:restart</code>{" "}
          {t("map.again")}
        </p>
      ) : (
        <div className="max-w-sm space-y-2 text-left text-xs text-red-900/80">
          <p className="font-medium text-red-800">{t("map.apiHintTitle")}</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>
              {t("map.apiHint1")}{" "}
              <strong>{t("map.apiHint1Api")}</strong> {t("map.apiHint1Suffix")}
            </li>
            <li>{t("map.apiHint2")}</li>
            <li>{t("map.apiHint3")}</li>
            <li>{t("map.apiHint4")}</li>
          </ol>
        </div>
      )}

      <a
        href="https://console.cloud.google.com/apis/library/maps-javascript-api.googleapis.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-blue-600 underline hover:no-underline"
      >
        {t("map.enableApi")}
      </a>
    </div>
  );
}

function useGoogleMapRenderError() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const check = () => {
      if (document.querySelector(".gm-err-container")) {
        setHasError(true);
      }
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setTimeout(check, 1500);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return hasError;
}

function GoogleRentalMap({
  locations,
  products,
  selectedId,
  focusId = null,
  onSelect,
  highlightProductId,
  onProductClick,
}: Props) {
  const t = useTranslations();
  const { locale, messages } = useLocale();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoLocationId, setInfoLocationId] = useState<string | null>(null);
  const [jettsInfoId, setJettsInfoId] = useState<string | null>(null);
  const mapRenderError = useGoogleMapRenderError();

  const jettsInfo = useMemo(
    () => jettsBranches.find((branch) => branch.id === jettsInfoId) ?? null,
    [jettsInfoId],
  );

  const focusLocation = useMemo(
    () => locations.find((l) => l.id === focusId) ?? null,
    [locations, focusId],
  );

  const infoLocation = useMemo(
    () => locations.find((l) => l.id === infoLocationId) ?? null,
    [locations, infoLocationId],
  );

  const infoTierGroups = useMemo(
    () =>
      infoLocation
        ? groupStocksByApparelTier(infoLocation.products, products)
        : [],
    [infoLocation, products],
  );

  function renderInfoProductRow({ stock, product }: TierStockItem) {
    const qty = getStockTotal(stock.inventory);
    const highlighted = highlightProductId === stock.productId;
    const rowClass = `flex w-full items-center gap-2 rounded-lg border p-1.5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 ${
      highlighted ? "border-blue-300 bg-blue-50" : "border-zinc-100"
    }`;
    const content = (
      <>
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-0.5"
            sizes="40px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-zinc-800">
            {product.name}
          </p>
          <p
            className={`text-[10px] font-bold ${
              qty === 0 ? "text-red-500" : "text-blue-600"
            }`}
          >
            {qty === 0
              ? t("stock.out")
              : t("stock.remaining", {
                  count: qty,
                  unit: getSizeUnitLabel(
                    product.sizeUnit,
                    locale,
                    messages,
                  ),
                })}
          </p>
        </div>
      </>
    );

    if (onProductClick && infoLocation) {
      return (
        <button
          key={stock.productId}
          type="button"
          onClick={() => onProductClick(stock.productId, infoLocation.id)}
          className={rowClass}
        >
          {content}
        </button>
      );
    }

    return (
      <Link key={stock.productId} href={`/products/${product.id}`} className={rowClass}>
        {content}
      </Link>
    );
  }

  const onMapLoad = useCallback((loadedMap: google.maps.Map) => {
    setMap(loadedMap);
  }, []);

  useEffect(() => {
    if (!focusId) {
      setInfoLocationId(null);
    }
  }, [focusId]);

  useEffect(() => {
    if (!map || locations.length === 0 || focusId) return;

    const bounds = new google.maps.LatLngBounds();
    for (const loc of locations) {
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    }
    map.fitBounds(bounds, 48);
  }, [map, locations, focusId]);

  useEffect(() => {
    if (!map || !focusLocation) return;

    map.panTo({ lat: focusLocation.lat, lng: focusLocation.lng });
    map.setZoom(15);
    setInfoLocationId(focusLocation.id);
  }, [map, focusLocation]);

  useEffect(() => {
    if (!map || !selectedId || focusId) return;

    const location = locations.find((loc) => loc.id === selectedId);
    if (!location) return;

    map.panTo({ lat: location.lat, lng: location.lng });
  }, [map, selectedId, focusId, locations]);

  if (mapRenderError) {
    return <GoogleMapsSetupHelp variant="error" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={BANGKOK_CENTER}
      zoom={12}
      onLoad={onMapLoad}
      options={mapOptions}
    >
      {jettsBranches.map((branch) => (
        <Marker
          key={`jetts-${branch.id}`}
          position={{ lat: branch.lat, lng: branch.lng }}
          title={branch.name}
          icon={jettsMarkerIcon()}
          onClick={() => {
            setJettsInfoId(branch.id);
            setInfoLocationId(null);
          }}
        />
      ))}

      {jettsInfo && (
        <InfoWindow
          position={{ lat: jettsInfo.lat, lng: jettsInfo.lng }}
          onCloseClick={() => setJettsInfoId(null)}
        >
          <div className="min-w-[200px] p-1">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
              Jetts Fitness
            </p>
            <h3 className="mb-1 font-bold text-zinc-900">{jettsInfo.name}</h3>
            <p className="text-xs text-zinc-500">{jettsInfo.note}</p>
          </div>
        </InfoWindow>
      )}

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          title={loc.name}
          icon={markerIcon(loc.id === selectedId)}
          onClick={() => {
            onSelect(loc.id);
            setInfoLocationId(loc.id);
            setJettsInfoId(null);
          }}
        />
      ))}

      {infoLocation && (
        <InfoWindow
          position={{ lat: infoLocation.lat, lng: infoLocation.lng }}
          onCloseClick={() => setInfoLocationId(null)}
        >
          <div className="min-w-[220px] p-1">
            <h3 className="mb-1 font-bold text-zinc-900">{infoLocation.name}</h3>
            <p className="mb-2 text-xs text-zinc-500">{infoLocation.address}</p>
            <p className="mb-3 text-xs font-medium text-blue-600">
              {t("common.totalRemaining", {
                count: getTotalStock(infoLocation),
              })}
            </p>
            <div className="flex max-h-56 flex-col gap-3 overflow-y-auto">
              {infoTierGroups.map((group) => (
                <div key={group.tier}>
                  <div className="mb-1 flex items-center gap-1.5">
                    <span
                      className={`h-2.5 w-0.5 shrink-0 rounded-full ${APPAREL_TIER_ACCENT[group.tier]}`}
                      aria-hidden
                    />
                    <p className="truncate text-[10px] font-semibold text-zinc-600">
                      {t(`apparelTiers.tiers.${group.tier}.name`)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {group.items.map((item) => renderInfoProductRow(item))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default function RentalMap(props: Props) {
  const t = useTranslations();

  if (!hasGoogleMapsApiKey()) {
    return <MissingApiKeyMessage />;
  }

  return (
    <GoogleMapsLoader
      loading={
        <div className="flex h-full items-center justify-center rounded-xl bg-zinc-100">
          <p className="text-sm text-zinc-500">{t("map.loadingMaps")}</p>
        </div>
      }
      error={<GoogleMapsSetupHelp variant="error" />}
    >
      <GoogleRentalMap {...props} />
    </GoogleMapsLoader>
  );
}
