import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskCard = ({ 
  task, 
  category,
  onToggleComplete, 
  onEdit, 
  onDelete,
  className,
  isDragging = false,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    if (!task.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 500);
    }
    onToggleComplete(task.Id);
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date) && !isToday(date)) return `Overdue - ${format(date, "MMM d")}`;
    
    return format(date, "MMM d");
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return "default";
    
    const date = parseISO(dateString);
    
    if (isPast(date) && !isToday(date)) return "danger";
    if (isToday(date)) return "warning";
    
    return "default";
  };

  const priorityConfig = {
    high: { icon: "ArrowUp", color: "high" },
    medium: { icon: "Minus", color: "medium" },
    low: { icon: "ArrowDown", color: "low" }
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        `priority-${task.priority}`,
        task.completed && "opacity-60",
        isDragging && "dragging",
        isHovered && !task.completed && "shadow-lg hover:shadow-primary/10",
        showConfetti && "animate-bounce-in",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 bg-gradient-to-r animate-confetti",
                i % 3 === 0 && "from-primary to-primary/80",
                i % 3 === 1 && "from-accent to-accent/80",
                i % 3 === 2 && "from-secondary to-secondary/80"
              )}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox
              checked={task.completed}
              onChange={handleComplete}
              className="transition-transform hover:scale-110"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={cn(
                "font-medium text-gray-900 transition-all duration-200",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="p-1.5 hover:bg-primary/10"
                >
                  <ApperIcon name="Edit2" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.Id)}
                  className="p-1.5 hover:bg-red-50 hover:text-red-600"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>

            {task.description && (
              <p className={cn(
                "text-sm text-gray-600 mb-3 line-clamp-2",
                task.completed && "text-gray-400"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={priority.color} size="xs" className="flex items-center gap-1">
                  <ApperIcon name={priority.icon} size={10} />
                  {task.priority}
                </Badge>
                
                {task.dueDate && (
                  <Badge variant={getDueDateColor(task.dueDate)} size="xs">
                    <ApperIcon name="Calendar" size={10} className="mr-1" />
                    {formatDueDate(task.dueDate)}
                  </Badge>
                )}
                
                {category && (
                  <Badge variant="default" size="xs" className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </Badge>
                )}
              </div>
              
              {task.completed && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ApperIcon name="CheckCircle" size={12} />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;