import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ProgressStats = ({ 
  stats = {}, 
  className,
  isCollapsed = false,
  onToggle
}) => {
  const {
    totalTasks = 0,
    completedTasks = 0,
    activeTasks = 0,
    overdueTasks = 0,
    completionRate = 0,
    todayCompleted = 0
  } = stats;

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card className="p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={cn(
            "text-2xl font-bold font-display",
            `text-${color}-600`
          )}>
            {value}
          </p>
        </div>
        <div className={cn(
          "p-2 rounded-lg",
          `bg-${color}-100`
        )}>
          <ApperIcon 
            name={icon} 
            size={20} 
            className={`text-${color}-600`}
          />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <ApperIcon 
            name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
            size={12}
            className={trend > 0 ? "text-green-500" : "text-red-500"}
          />
          <span className={cn(
            "text-xs font-medium",
            trend > 0 ? "text-green-500" : "text-red-500"
          )}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </Card>
  );

  const CircularProgress = ({ percentage, size = 80, strokeWidth = 8, color = "#5B5FDE" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <Card className={cn("p-3 bg-gradient-to-r from-primary/5 to-secondary/5", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CircularProgress percentage={completionRate} size={40} strokeWidth={4} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {completedTasks} of {totalTasks} completed
              </p>
              <p className="text-xs text-gray-600">
                {todayCompleted} completed today
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1.5"
          >
            <ApperIcon name="ChevronDown" size={16} />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6 bg-gradient-to-r from-primary/5 to-secondary/5", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-gray-900">
          Progress Overview
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-1.5"
        >
          <ApperIcon name="ChevronUp" size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon="List"
          color="blue"
        />
        <StatCard
          title="Active"
          value={activeTasks}
          icon="Circle"
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon="CheckCircle"
          color="green"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          icon="AlertCircle"
          color="red"
        />
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <CircularProgress percentage={completionRate} />
          <p className="mt-2 text-sm text-gray-600">Overall Progress</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent to-accent/90 rounded-full">
            <span className="text-2xl font-bold text-white">
              {todayCompleted}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Completed Today</p>
        </div>
      </div>
    </Card>
  );
};

export default ProgressStats;