"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { useProductFilters } from "../../hooks/use-product-filters";
import { PriceFilter } from "./price-filter";

interface ProductFiltersProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

function ProductFilter({ title, className, children }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>

      {isOpen && children}
    </div>
  );
}

export function ProductFilters() {
  const [filters, setFilters] = useProductFilters();

  function onChange(key: keyof typeof filters, value: unknown) {
    setFilters({ ...filters, [key]: value });
  }

  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        <button className="underline" onClick={() => {}} type="button">
          Clear
        </button>
      </div>
      <ProductFilter title="Price" className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  );
}
