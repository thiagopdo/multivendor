import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

import { loadProductFilters } from "@/modules/products/search-params";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { ProductSort } from "@/modules/products/ui/components/products-sort";
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
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="font-medium text-2xl">Curated for you</p>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
