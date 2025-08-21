import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

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
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
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