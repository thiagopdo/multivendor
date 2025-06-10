"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface Props {
  tenantSlug: string;
}
export function CheckoutView({ tenantSlug }: Props) {
  const router = useRouter(); // Hook to handle navigation within the application.

  const [states, setStates] = useCheckoutStates(); // Custom hook to manage checkout states (e.g., success or cancel).
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug); // Custom hook to manage cart operations for the tenant.

  const trpc = useTRPC(); // Hook to access TRPC queries and mutations.

  // Fetch product details based on the product IDs in the cart.
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds }),
  );

  // Mutation to handle the purchase process.
  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      // Reset checkout states before initiating the purchase.
      onMutate() {
        setStates({
          success: false,
          cancel: false,
        });
      },
      // Redirect the user to the payment URL on successful purchase.
      onSuccess(data) {
        window.location.href = data.url;
      },
      // Handle errors during the purchase process.
      onError(error) {
        if (error?.data?.code === "UNAUTHORIZED") {
          // Redirect the user to the sign-in page if unauthorized.
          router.push("/sign-in");
        }
        // Display an error message using a toast notification.
        toast.error(error.message);
      },
    }),
  );

  // Effect to clear the cart and redirect to the products page if the purchase is successful.
  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false }); // Reset the success state after handling it.
      clearCart(); // Clear all items from the cart.
      router.push("/products"); // Redirect to the products page.
    }
  }, [states.success, clearCart, router, setStates]);

  // Effect to handle errors during product fetching.
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart(); // Clear the cart if invalid products are found.
      toast.warning("Invalid products in cart. All carts have been cleared."); // Show a warning message.
    }
  }, [error, clearCart]);

  // Render a loading spinner while product data is being fetched.
  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-5 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  // Render a message if no products are found in the cart.
  if (data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-5 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }

  // Render the checkout interface when product data is successfully fetched.
  return (
    <div className="lg:pt-16 pt-4 px-5 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        {/* Product list section */}
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id} // Unique key for each product.
                isLast={index === data.docs.length - 1} // Check if this is the last product in the list.
                imageUrl={product.image?.url} // Product image URL.
                name={product.title} // Product name.
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`} // URL to the product page.
                tenantUrl={generateTenantURL(product.tenant.slug)} // URL to the tenant's page.
                tenantName={product.tenant.name} // Tenant name.
                price={product.price} // Product price.
                onRemove={() => removeProduct(product.id)} // Callback to remove the product from the cart.
              />
            ))}
          </div>
        </div>

        {/* Sidebar section */}
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0} // Total price of the products in the cart.
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })} // Callback to initiate the purchase.
            isCancelled={states.cancel} // Indicates if the purchase was canceled.
            disabled={purchase.isPending} // Disable the purchase button if the mutation is pending.
          />
        </div>
      </div>
    </div>
  );
}
