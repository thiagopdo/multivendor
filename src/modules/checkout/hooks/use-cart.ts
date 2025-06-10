import { useCartStore } from "../store/use-cart-store";

export function useCart(tenantSlug: string) {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearCart,
    clearAllCarts,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  function toggleProduct(productId: string) {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  }

  function isProductIncart(productId: string) {
    return productIds.includes(productId);
  }

  function clearTenantCart() {
    clearCart(tenantSlug);
  }

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductIncart,
    totalItems: productIds.length,
  };
}
