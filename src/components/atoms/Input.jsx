import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
className={cn(
        "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg transition-all duration-200",
        "placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10",
        "hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;