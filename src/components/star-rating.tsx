import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StarRatingProps {
  rating: number;
  className?: string;
  iconClassname?: string;
  text?: string;
}

export function StarRating({
  rating,
  className,
  iconClassname,
  text,
}: StarRatingProps) {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-4",
            index < safeRating ? "fill-black" : "",
            iconClassname,
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
}
