import React from "react";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className,
  id,
  ...props 
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={cn("space-y-2", className)} {...props}>
{label && (
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
{React.cloneElement(children, { 
        id: fieldId, 
        'aria-invalid': !!error,
        'aria-describedby': error ? `${fieldId}-error` : undefined 
      })}
{error && (
        <p 
          id={`${fieldId}-error`}
          className="text-sm text-red-600" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;