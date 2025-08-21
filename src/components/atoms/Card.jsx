import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-surface rounded-xl border transition-all duration-200";
  
  const variants = {
    default: "border-gray-200 shadow-sm",
    elevated: "border-gray-200 shadow-lg",
    outlined: "border-2 border-gray-200"
  };
  
  const hoverStyles = hover 
    ? "hover:shadow-lg hover:shadow-gray-200/20 hover:scale-[1.02] hover:-translate-y-1" 
    : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;