import { createLoader, parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

export function useProductFilters() {
  return useQueryStates({
    minPrice: parseAsString.withOptions({
      clearOnDefault: true,
    }),
    maxPrice: parseAsString.withOptions({
      clearOnDefault: true,
    }),
    
  });
}

export const loadProductFilters = createLoader(params);
