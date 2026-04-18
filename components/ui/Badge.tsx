import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bullish" | "bearish" | "neutral" | "high" | "medium" | "low" | "ai";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] transition-all",
        {
          "bg-white/5 text-slate-400 border border-slate-700/50": variant === "default",
          "bg-bullish-dim text-bullish border border-bullish/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]": variant === "bullish",
          "bg-bearish-dim text-bearish border border-bearish/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]": variant === "bearish",
          "bg-slate-800/20 text-slate-500 border border-slate-700/50": variant === "neutral",
          "bg-bearish-dim text-bearish border border-bearish/40": variant === "high",
          "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30": variant === "medium",
          "bg-slate-800/30 text-slate-400 border border-slate-700/50": variant === "low",
          "bg-accent/10 text-accent border border-accent/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]": variant === "ai",
        },
        className
      )}
      {...props}
    />
  );
}
