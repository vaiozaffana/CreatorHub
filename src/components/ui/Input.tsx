"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-[border-color,box-shadow] duration-200",
              "placeholder:text-gray-400",
              "hover:border-gray-300",
              "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              icon && "pl-10",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-gray-400 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
