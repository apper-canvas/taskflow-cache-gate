import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import PrioritySelect from "@/components/molecules/PrioritySelect";
import ApperIcon from "@/components/ApperIcon";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null,
  categories = [],
  title = "Add Task" 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        categoryId: task.categoryId || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        priority: "medium",
        dueDate: ""
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      categoryId: formData.categoryId || null,
      dueDate: formData.dueDate || null
    };
    
    onSave(taskData);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
<div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Close modal"
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border animate-scale-in">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {task ? "Edit Task" : title}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <FormField
                label="Task Title"
                required
                error={errors.title}
              >
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What needs to be done?"
                  error={errors.title}
                  autoFocus
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Add more details..."
                  rows={3}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category">
                  <Select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                  >
                    <option value="">No Category</option>
                    {categories.map((category) => (
                      <option key={category.Id} value={category.Id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Priority">
                  <PrioritySelect
                    value={formData.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Due Date">
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </FormField>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim()}
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;