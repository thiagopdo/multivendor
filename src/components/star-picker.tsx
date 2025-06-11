"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface StarPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export function StarPicker({
  value = 0,
  onChange,
  className,
  disabled = false,
}: StarPickerProps) {
  const [hoveredValue, setHoveredValue] = useState(0);

  function handleChange(value: number) {
    onChange?.(value);
  }

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 hover:scale-110 transition",
            !disabled && "cursor-pointer hover:scale-100",
          )}
          onClick={() => handleChange(star)}
          onMouseEnter={() => setHoveredValue(star)}
          onMouseLeave={() => setHoveredValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hoveredValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black",
            )}
          />
        </button>
      ))}
    </div>
  );
}
