import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { Cn } from "@/lib/utils";

const ButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "bg-transparent text-foreground hover:bg-secondary",
      },
      size: {
        default: "h-11 px-4 py-2",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className: ClassName,
  variant: Variant,
  size: Size,
  asChild: AsChild = false,
  ...Props
}: React.ComponentProps<"button"> &
  VariantProps<typeof ButtonVariants> & {
    asChild?: boolean;
  }) {
  const ComponentTag = AsChild ? Slot : "button";

  return <ComponentTag className={Cn(ButtonVariants({ variant: Variant, size: Size, className: ClassName }))} {...Props} />;
}

export { Button, ButtonVariants };
