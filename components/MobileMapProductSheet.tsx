"use client";

import { useEffect } from "react";
import type { LocationProductStock, Product, RentalLocation } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/client";
import ProductQuickView from "./ProductQuickView";

type Props = {
  product: Product;
  stock: LocationProductStock;
  location: RentalLocation;
  onClose: () => void;
};

export default function MobileMapProductSheet({
  product,
  stock,
  location,
  onClose,
}: Props) {
  const t = useTranslations();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-[1px] lg:hidden"
        onClick={onClose}
        aria-label={t("common.close")}
      />
      <div
        className="fixed inset-x-0 z-50 flex max-h-[min(74vh,calc(100dvh-11rem-env(safe-area-inset-bottom,0px)))] flex-col rounded-t-2xl border border-zinc-200/80 bg-white shadow-2xl lg:hidden"
        style={{
          bottom: "calc(4rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex shrink-0 items-center justify-center py-2">
          <div className="h-1 w-10 rounded-full bg-zinc-300" aria-hidden />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pb-4">
          <ProductQuickView
            embedded
            product={product}
            stock={stock}
            location={location}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  );
}
