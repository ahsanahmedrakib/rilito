import { StarFilledIcon } from "./icons";

export function Stars({
  rating,
  size = "h-4 w-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <span className="flex text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarFilledIcon
          key={i}
          className={`${size} ${i < Math.round(rating) ? "" : "text-ink-200"}`}
        />
      ))}
    </span>
  );
}