"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

    const variants = {
      primary:
        "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:shadow-lg hover:shadow-violet-500/25 hover:brightness-110 focus-visible:ring-violet-500 active:scale-[0.98]",
      secondary:
        "bg-gray-900 text-white shadow-sm hover:bg-gray-800 focus-visible:ring-gray-500 active:scale-[0.98]",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 focus-visible:ring-gray-300",
      danger:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 focus-visible:ring-red-500 active:scale-[0.98]",
      outline:
        "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-300 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-lg",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
