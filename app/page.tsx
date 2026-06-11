import RentalApp from "@/components/RentalApp";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { product } = await searchParams;

  return <RentalApp initialProductId={product ?? null} />;
}
