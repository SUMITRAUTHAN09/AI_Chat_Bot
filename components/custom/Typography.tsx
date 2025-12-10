import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      paragraph: "leading-7 text-base",
      muted: "text-sm opacity-70",
      small: "text-sm font-medium",
      label: "text-sm font-semibold tracking-wide uppercase",
    },

    textColor: {
      default: "text-black",
      primary: "text-gray-900",
      secondary: "text-gray-700",
      success: "text-gray-600",
      danger: "text-gray-500",
      muted: "text-gray-400",
    },

    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },

    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },

  defaultVariants: {
    variant: "paragraph",
    textColor: "default",
    weight: "normal",
    align: "left",
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof typographyVariants> {}

export function Typography({
  className,
  variant,
  textColor,
  weight,
  align,
  ...props
}: TypographyProps) {
  const Component =
    variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : variant === "h4"
      ? "h4"
      : "p";

  return (
    <Component
      className={cn(
        typographyVariants({
          variant,
          textColor,
          weight,
          align,
        }),
        className
      )}
      {...props}
    />
  );
}
