import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickAddBar = ({ onAddTask, className, placeholder = "Add a new task..." }) => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Simple natural language parsing for priority and due date
    let priority = "medium";
    let parsedTitle = title.trim();

    // Check for priority keywords
    if (/\b(urgent|important|high|!!)\b/i.test(title)) {
      priority = "high";
      parsedTitle = parsedTitle.replace(/\b(urgent|important|high|!!)\b/gi, "").trim();
    } else if (/\b(low|later|someday)\b/i.test(title)) {
      priority = "low";
      parsedTitle = parsedTitle.replace(/\b(low|later|someday)\b/gi, "").trim();
    }

    // Check for due date keywords
    let dueDate = null;
    const today = new Date();
    
    if (/\b(today)\b/i.test(title)) {
      dueDate = today.toISOString().split("T")[0];
      parsedTitle = parsedTitle.replace(/\b(today)\b/gi, "").trim();
    } else if (/\b(tomorrow)\b/i.test(title)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString().split("T")[0];
      parsedTitle = parsedTitle.replace(/\b(tomorrow)\b/gi, "").trim();
    }

    onAddTask({
      title: parsedTitle,
      priority,
      dueDate
    });

    setTitle("");
    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setTitle("");
      setIsExpanded(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <ApperIcon 
            name="Plus" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 py-3"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!title.trim()}
          className="px-6 py-3"
        >
          Add
        </Button>
      </form>
      
      {isExpanded && title && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-gray-600 animate-slide-right">
          <p className="font-medium mb-1">Smart parsing detected:</p>
          <ul className="space-y-1 text-gray-500">
            <li>• Use "urgent", "high", or "!!" for high priority</li>
            <li>• Use "today" or "tomorrow" for due dates</li>
            <li>• Use "low" or "later" for low priority</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuickAddBar;