import React, { useEffect, useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

function TaskFilters({ 
  activeFilter, 
  onFilterChange, 
  className,
  ariaLabel = "Task filters"
}) {
const filterRefs = useRef({})
  const [focusedIndex, setFocusedIndex] = useState(0)

  const filters = [
    { key: 'all', label: 'All Tasks', icon: 'list' },
    { key: 'pending', label: 'Pending', icon: 'clock' },
    { key: 'completed', label: 'Completed', icon: 'check' }
  ]

  // Handle keyboard navigation
  function handleKeyDown(e, index) {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault()
        const direction = e.key === 'ArrowRight' ? 1 : -1
        const newIndex = (index + direction + filters.length) % filters.length
        
        setFocusedIndex(newIndex)
        
        // Focus the new element
        filterRefs.current[newIndex]?.focus()
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
{filters.map((filter, index) => (
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
        </Button>
      ))}
    </div>
  );
};

export default TaskFilters;