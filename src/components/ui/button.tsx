import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98]",
        outline: "border-2 border-border bg-card hover:bg-muted hover:text-accent-foreground hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-muted hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "btn-premium hover:scale-[1.02] active:scale-[0.98]",
        neon: "bg-gradient-neon text-white hover:scale-[1.02] animate-pulse-glow border-2 border-primary/30 shadow-neon active:scale-[0.98]",
        glass: "glass text-foreground hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]",
        hero: "bg-gradient-primary text-white hover:scale-[1.05] hover:shadow-focus-glow border-2 border-primary/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 active:scale-[1.02]",
        minimal: "bg-card border border-border hover:bg-muted hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]",
        futuristic: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 hover:scale-[1.02] shadow-lg hover:shadow-xl border border-primary/20 active:scale-[0.98]",
        elegant: "bg-card border-2 border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] transition-all duration-400 active:scale-[0.98]",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-16 rounded-2xl px-10 text-base",
        icon: "h-12 w-12",
        hero: "h-20 px-16 text-lg rounded-3xl",
        minimal: "h-11 px-6 text-sm",
        micro: "h-8 px-3 text-xs rounded-lg",
        xl: "h-18 px-12 text-lg rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }