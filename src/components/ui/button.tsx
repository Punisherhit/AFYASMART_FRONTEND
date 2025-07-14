import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-medical hover:shadow-hover transform hover:scale-[1.02]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-medical",
        outline:
          "border border-primary text-primary bg-background hover:bg-primary-light hover:border-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-card",
        ghost: "hover:bg-accent-light hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        medical: "bg-gradient-medical text-primary-foreground hover:opacity-90 shadow-medical hover:shadow-hover transform hover:scale-[1.02]",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-medical hover:shadow-hover transform hover:scale-[1.02]",
        hero: "bg-gradient-hero text-white hover:opacity-90 shadow-hover transform hover:scale-105 font-semibold"
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4",
        lg: "h-13 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
        hero: "h-14 px-8 text-lg"
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
