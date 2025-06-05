import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

export default async function page({ params }: Props) {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrationBoundary>
  );
}
