"use client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { ProductCard, ProductCardSkeleton } from "./product.card";

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

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...parsedFilters,
          category,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.title}
              imageUrl={product.image?.url}
              authorUsername="thiago"
              authorImageUrl={undefined}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant="elevated"
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
