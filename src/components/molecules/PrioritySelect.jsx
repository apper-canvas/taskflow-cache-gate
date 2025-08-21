import React from "react";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PrioritySelect = ({ value, onChange, className, ...props }) => {
  const priorities = [
    { value: "low", label: "Low Priority", icon: "ArrowDown", color: "low" },
    { value: "medium", label: "Medium Priority", icon: "Minus", color: "medium" },
    { value: "high", label: "High Priority", icon: "ArrowUp", color: "high" }
  ];

  return (
    <div className={className}>
      <Select value={value} onChange={onChange} {...props}>
        <option value="">Select Priority</option>
        {priorities.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default PrioritySelect;