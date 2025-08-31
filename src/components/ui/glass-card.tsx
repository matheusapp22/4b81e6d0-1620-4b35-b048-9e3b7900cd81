import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "neon" | "minimal" | "elevated";
  hover?: boolean;
  glow?: boolean;
  interactive?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, glow = false, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border transition-all duration-500 ease-out relative overflow-hidden",
          {
            // Default glass card with subtle backdrop blur
            "glass-card": variant === "default",
            
            // Premium card with enhanced shadows and borders
            "glass-premium": variant === "premium",
            
            // Neon variant with glowing borders and pulse animation
            "glass-neon animate-neon-pulse": variant === "neon",
            
            // Minimal variant for subtle backgrounds
            "glass-surface border-border/40 shadow-subtle": variant === "minimal",
            
            // Elevated variant with stronger shadows and cosmic drift
            "glass-premium shadow-elevated animate-cosmic-drift": variant === "elevated",
            
            // Hover effects
            "hover-glow cursor-pointer": hover,
            "interactive-card": interactive,
            
            // Glow effect
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