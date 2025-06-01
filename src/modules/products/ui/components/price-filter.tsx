import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export function formatAsCurrent(value: string) {
  const numericValue = value.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");
  const formattedValue =
    parts[0] + (parts.length > 1 ? `.${parts[1]?.slice(0, 2)}` : "");

  if (!formattedValue) {
    return "";
  }

  const numberValue = Number.parseFloat(formattedValue);
  if (Number.isNaN(numberValue)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

export function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) {
  function handleMinPriceChange(event: ChangeEvent<HTMLInputElement>) {
    // Extract numeric value from input, removing non-numeric characters
    const numericValue = event.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numericValue);
  }

  function handleMaxPriceChange(event: ChangeEvent<HTMLInputElement>) {
    // Extract numeric value from input, removing non-numeric characters
    const numericValue = event.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numericValue);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum price</Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrent(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum price</Label>
        <Input
          type="text"
          placeholder="♾️"
          value={maxPrice ? formatAsCurrent(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
}
