import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useCartStore } from "../store/use-cart-store";

export function useCart(tenantSlug: string) {

  /**
   * Custom hook to manage cart operations for a specific tenant.
   * This hook provides functions to add, remove, and clear products in the cart,
   */
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  // Get the product IDs in the cart for the given tenant slug
  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []),
  );

  // Function to toggle a product in the cart for the given tenant slug
  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [productIds, tenantSlug, addProduct, removeProduct],
  );

  // Check if a product is in the cart for the given tenant slug
  const isProductIncart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds],
  );
  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [clearCart, tenantSlug]);

  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(tenantSlug, productId);
    },
    [addProduct, tenantSlug],
  );
  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId);
    },
    [removeProduct, tenantSlug],
  );

  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductIncart,
    totalItems: productIds.length,
  };
}
