import React, { useRef, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskFilters = ({ 
  activeFilter, 
  onFilterChange, 
  className,
  showCounts = true,
  counts = {}
}) => {
const filters = [
    { key: "all", label: "All Tasks", icon: "List" },
    { key: "active", label: "Active", icon: "Circle" },
    { key: "completed", label: "Completed", icon: "CheckCircle" },
    { key: "overdue", label: "Overdue", icon: "AlertCircle" }
  ];

  const filterRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (index + 1) % filters.length;
        setFocusedIndex(nextIndex);
        filterRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = index === 0 ? filters.length - 1 : index - 1;
        setFocusedIndex(prevIndex);
        filterRefs.current[prevIndex]?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onFilterChange(filters[index].key);
        break;
    }
  };

  return (
<div className={cn("flex flex-wrap gap-2", className)} role="toolbar" aria-label="Task filters">
      {filters.map((filter) => (
<Button
          key={filter.key}
          ref={(el) => (filterRefs.current[index] = el)}
          variant={activeFilter === filter.key ? "primary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="flex items-center gap-2 focus:ring-2 focus:ring-primary/50 focus:outline-none"
          tabIndex={index === focusedIndex ? 0 : -1}
          role="button"
          aria-pressed={activeFilter === filter.key}
          aria-label={`Filter by ${filter.label}`}
        >
          <ApperIcon name={filter.icon} size={14} />
          {filter.label}
          {showCounts && counts[filter.key] !== undefined && (
            <span className={cn(
              "ml-1 px-1.5 py-0.5 text-xs rounded-full",
              activeFilter === filter.key 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600"
            )}>
              {counts[filter.key]}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default TaskFilters;