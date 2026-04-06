import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bullish" | "bearish" | "neutral" | "high" | "medium" | "low" | "ai";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-widest transition-colors leading-none",
        {
          "bg-white/[0.04] text-text-secondary border border-card-border": variant === "default",
          "bg-bullish/[0.08] text-bullish border border-bullish/15": variant === "bullish",
          "bg-bearish/[0.08] text-bearish border border-bearish/15": variant === "bearish",
          "bg-neutral/[0.08] text-neutral border border-neutral/15": variant === "neutral",
          "bg-bearish/[0.06] text-bearish border border-bearish/15": variant === "high",
          "bg-caution/[0.06] text-caution border border-caution/15": variant === "medium",
          "bg-text-tertiary/[0.06] text-text-secondary border border-text-tertiary/15": variant === "low",
          "bg-ai-primary/[0.06] text-ai-primary border border-ai-primary/15": variant === "ai",
        },
        className
      )}
      {...props}
    />
  );
}
