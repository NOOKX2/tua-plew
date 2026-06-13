"use client";

type Props = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: Props) {
  return (
    <div
      className={`inline-flex items-center gap-0.5 ${sizeClasses[size]}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1;
        const filled = value <= Math.round(rating);

        if (interactive) {
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === rating}
              onClick={() => onChange?.(value)}
              className={`transition-colors ${
                filled ? "text-amber-400" : "text-zinc-300 hover:text-amber-300"
              }`}
            >
              ★
            </button>
          );
        }

        return (
          <span
            key={value}
            className={filled ? "text-amber-400" : "text-zinc-200"}
            aria-hidden
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
