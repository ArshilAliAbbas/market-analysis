import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card border border-card-border rounded text-text-primary",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
