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
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleGlobalKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      document.querySelector('input[placeholder*="Add a new task"]')?.focus();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
            className="pl-10 py-3 focus:ring-2 focus:ring-primary/50"
            aria-label="Add new task"
            aria-describedby={isExpanded && title ? "quick-add-help" : undefined}
          />
        </div>
<Button 
          type="submit" 
          disabled={!title.trim()}
          className="px-6 py-3 focus:ring-2 focus:ring-primary/50"
          aria-label="Add task"
        >
          Add
        </Button>
      </form>
      
{isExpanded && title && (
        <div 
          id="quick-add-help"
          className="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-gray-600 animate-slide-right"
          role="region"
          aria-label="Smart parsing help"
        >
          <p className="font-medium mb-1">Smart parsing detected:</p>
          <ul className="space-y-1 text-gray-500">
            <li>• Use "urgent", "high", or "!!" for high priority</li>
            <li>• Use "today" or "tomorrow" for due dates</li>
            <li>• Use "low" or "later" for low priority</li>
            <li>• Press Ctrl/Cmd + Enter to quickly add</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuickAddBar;