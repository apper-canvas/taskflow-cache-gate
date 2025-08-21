import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg transition-all duration-200",
        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10",
        "hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;