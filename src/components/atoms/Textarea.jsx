import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg transition-all duration-200",
        "placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10",
        "hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;