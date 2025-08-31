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
          "rounded-2xl border transition-all duration-500 ease-out",
          {
            // Default glass card with subtle backdrop blur
            "glass-card": variant === "default",
            
            // Premium card with enhanced shadows and borders
            "premium-card": variant === "premium",
            
            // Neon variant with glowing borders
            "glass neon-border animate-pulse-glow": variant === "neon",
            
            // Minimal variant for subtle backgrounds
            "bg-card/90 border-border/60 backdrop-blur-sm shadow-sm": variant === "minimal",
            
            // Elevated variant with stronger shadows
            "bg-card border-border shadow-elevated backdrop-blur-md": variant === "elevated",
            
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