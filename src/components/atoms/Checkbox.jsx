import React, { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
<label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onChange) onChange(!checked);
            }
          }}
          className="sr-only focus:ring-2 focus:ring-primary/50"
          {...props}
/>
        <div
          className={cn(
            "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
            "focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-1",
            checked 
              ? "bg-gradient-to-r from-primary to-primary/90 border-primary shadow-lg" 
              : "bg-white border-gray-300 hover:border-primary/50",
            className
          )}
        >
          {checked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="text-white checkmark-animation" 
            />
          )}
        </div>
      </div>
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;