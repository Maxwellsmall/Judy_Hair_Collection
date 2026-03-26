/* eslint-disable react-refresh/only-export-components */
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900",
        secondary: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 focus:ring-neutral-200",
        primary: "bg-amber-700 text-white hover:bg-amber-600 focus:ring-amber-700",
        whatsapp: "bg-whatsapp-green text-white hover:bg-whatsapp-green/90 focus:ring-whatsapp-green",
        ghost: "text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-200",
        link: "text-amber-700 hover:underline focus:ring-amber-700",
      },
      size: {
        default: "px-8 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? "span" : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
