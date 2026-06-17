import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import RentalReservePaymentView from "@/components/RentalReservePaymentView";
import { auth } from "@/auth";
import { getProductByIdAsync } from "@/lib/products.server";
import { getRentalLocations } from "@/lib/locations.server";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  searchParams: Promise<{
    productId?: string;
    locationId?: string;
    size?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("rental.payment.metaTitle"),
  };
}

export default async function RentalReservePaymentPage({ searchParams }: Props) {
  const { productId, locationId, size } = await searchParams;

  if (!productId || !locationId || !size) {
    notFound();
  }

  const session = await auth();
  const payUrl = `/rentals/reserve/pay?productId=${encodeURIComponent(productId)}&locationId=${encodeURIComponent(locationId)}&size=${encodeURIComponent(size)}`;

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(payUrl)}`);
  }

  const [product, locations] = await Promise.all([
    getProductByIdAsync(productId),
    getRentalLocations(),
  ]);

  if (!product || !product.sizes.includes(size)) {
    notFound();
  }

  const location = locations.find((item) => item.id === locationId);
  if (!location) {
    notFound();
  }

  const stock = location.products.find((item) => item.productId === productId);
  if (!stock || (stock.inventory[size] ?? 0) < 1) {
    notFound();
  }

  return (
    <main className="relative flex-1 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-blue-50/80 to-transparent" />
      <div className="relative mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <RentalReservePaymentView
          productId={productId}
          productName={product.name}
          locationId={locationId}
          locationName={location.name}
          size={size}
          amount={product.pricePerRental}
        />
      </div>
    </main>
  );
}
