import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

export const dynamic = "force-dynamic"; // Force dynamic rendering for this page

export default async function page({ params }: Props) {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
