import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // tomate — el único hero CTA por pantalla
        default: "bg-tomate text-white hover:bg-tomate-dark",
        // ink — secundario fuerte (tinta sobre papel)
        ink: "bg-ink text-paper hover:bg-ink/90",
        // outline — borde rule, sin sombra
        outline: "border border-rule bg-paper-raised text-ink hover:border-ink",
        // secondary — papel elevado sobre papel base
        secondary: "bg-paper-raised text-ink border border-rule hover:border-ink",
        // ghost — sin contenedor
        ghost: "text-ink hover:bg-rule/60",
        // link — subrayado tipográfico
        link: "text-ink underline underline-offset-4 decoration-tomate hover:decoration-ink",
        // mercadona — exclusivo para acciones comerciales hacia Mercadona
        mercadona: "bg-mercadona text-white hover:bg-mercadona/90",
        // destructive
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
