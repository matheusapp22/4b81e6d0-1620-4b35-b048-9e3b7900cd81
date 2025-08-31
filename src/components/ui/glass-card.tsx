import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "neon" | "minimal";
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border transition-all duration-300",
          {
            "glass-card": variant === "default",
            "premium-card": variant === "premium",
            "glass neon-border": variant === "neon",
            "bg-card/80 border-border/60 backdrop-blur-sm": variant === "minimal",
            "hover-glow cursor-pointer": hover,
            "neon-glow": glow,
          },
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };