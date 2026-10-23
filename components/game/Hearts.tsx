import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hearts({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${hearts} of ${maxHearts} hearts remaining`}>
      {Array.from({ length: maxHearts }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            "h-4 w-4 md:h-5 md:w-5 transition-colors",
            i < hearts ? "fill-coral-500 text-coral-500" : "fill-transparent text-ink-700"
          )}
        />
      ))}
    </div>
  );
}
