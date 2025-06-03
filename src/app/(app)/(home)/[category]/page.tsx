import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

// Helper function to parse price strings into numbers
const parsePrice = (price: string | null): number | undefined =>
  price != null && price !== "" ? Number(price) : undefined;

export default async function page({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  // Parse minPrice and maxPrice into numbers
  const parsedFilters = {
    ...filters,
    minPrice: parsePrice(filters.minPrice),
    maxPrice: parsePrice(filters.maxPrice),
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category, ...parsedFilters }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
}
