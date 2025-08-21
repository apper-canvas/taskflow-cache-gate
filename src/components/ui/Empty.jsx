import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  icon = "Inbox",
  action,
  className 
}) => {
  return (
    <Card className={cn("p-12 text-center bg-gradient-to-b from-gray-50/50 to-white", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-gray-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {description}
          </p>
        </div>
        
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Empty;