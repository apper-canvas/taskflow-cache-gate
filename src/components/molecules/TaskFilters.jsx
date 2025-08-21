import React from "react";
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

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "primary" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="flex items-center gap-2"
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