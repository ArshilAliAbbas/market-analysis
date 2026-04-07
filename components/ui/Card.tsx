import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card border border-card-border rounded text-text-primary transition-all duration-500 ease-out hover:bg-card-hover hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
