"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";

interface Props {
  category?: string | null;
}

const parsePrice = (price: string | null | undefined): number | undefined =>
  price != null && price !== "" ? Number(price) : undefined;

export function ProductList({ category }: Props) {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  //const { minPrice, maxPrice } = filters;

  // Memoize parsedFilters using filters as a dependency
  const parsedFilters = useMemo(() => {
    const { minPrice, maxPrice, ...restFilters } = filters; // Destructure inside useMemo
    return {
      minPrice: parsePrice(minPrice),
      maxPrice: parsePrice(maxPrice),
      ...restFilters,
    };
  }, [filters]);

  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...parsedFilters,
    }),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((product) => (
        <div key={product.id} className="border rounded-md bg-white p-4">
          <h2 className="text-xl font-medium">{product.title}</h2>
          <h2>${product.price}</h2>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton() {
  return <div>Loading...</div>;
}
