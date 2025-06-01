"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface Props {
  category?: string | null;
}

export function ProductList({ category }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category }),
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
