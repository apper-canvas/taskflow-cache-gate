import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search tasks...", 
  className,
  onClear,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        size={16} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
<Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-10 focus:ring-2 focus:ring-primary/50"
        aria-label="Search tasks"
        role="searchbox"
        {...props}
      />
{value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
          aria-label="Clear search"
          tabIndex={0}
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;