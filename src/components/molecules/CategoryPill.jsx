import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CategoryPill = ({ 
  category, 
  isActive = false, 
  onClick, 
  showCount = true,
  className,
  ...props 
}) => {
  if (!category) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "hover:shadow-md active:scale-95",
        isActive
          ? "shadow-lg text-white"
          : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200",
        className
      )}
      style={{
        backgroundColor: isActive ? category.color : undefined
      }}
      {...props}
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          !isActive && "opacity-60"
        )}
        style={{ backgroundColor: category.color }}
      />
      <span>{category.name}</span>
      {showCount && category.taskCount > 0 && (
        <span className={cn(
          "px-1.5 py-0.5 text-xs rounded-full",
          isActive 
            ? "bg-white/20 text-white" 
            : "bg-gray-100 text-gray-600"
        )}>
          {category.taskCount}
        </span>
      )}
    </button>
  );
};

export default CategoryPill;