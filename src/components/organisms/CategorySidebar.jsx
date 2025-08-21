import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CategoryPill from "@/components/molecules/CategoryPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const CategorySidebar = ({
  categories = [],
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  loading = false,
  error = null,
  onRetry,
  className
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#5B5FDE");

  const predefinedColors = [
    "#5B5FDE", "#8B5CF6", "#F59E0B", "#10B981", 
    "#EF4444", "#3B82F6", "#F97316", "#8B5A2B",
    "#EC4899", "#06B6D4", "#84CC16", "#6366F1"
  ];

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    onAddCategory({
      name: newCategoryName.trim(),
      color: selectedColor
    });

    setNewCategoryName("");
    setSelectedColor("#5B5FDE");
    setIsAddingCategory(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddCategory();
    } else if (e.key === "Escape") {
      setIsAddingCategory(false);
      setNewCategoryName("");
      setSelectedColor("#5B5FDE");
    }
  };

  if (loading) {
    return (
      <div className={cn("w-full lg:w-64 bg-white border-r border-gray-200", className)}>
        <div className="p-4">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full lg:w-64 bg-white border-r border-gray-200", className)}>
        <div className="p-4">
          <Error message={error} onRetry={onRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col", className)}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-gray-900">Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingCategory(true)}
            className="p-1.5"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        {/* All Tasks */}
        <button
          onClick={() => onCategorySelect(null)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-gray-50 active:scale-95",
            !selectedCategory
              ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
              : "text-gray-700"
          )}
        >
          <ApperIcon name="Inbox" size={16} />
          <span>All Tasks</span>
          <span className={cn(
            "ml-auto px-1.5 py-0.5 text-xs rounded-full",
            !selectedCategory
              ? "bg-white/20 text-white"
              : "bg-gray-100 text-gray-600"
          )}>
            {categories.reduce((total, cat) => total + cat.taskCount, 0)}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-2">
          {categories.map((category) => (
            <button
              key={category.Id}
              onClick={() => onCategorySelect(category.Id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-gray-50 active:scale-95",
                selectedCategory === category.Id
                  ? "shadow-lg text-white"
                  : "text-gray-700"
              )}
              style={{
                backgroundColor: selectedCategory === category.Id ? category.color : undefined
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="flex-1 text-left truncate">{category.name}</span>
              <span className={cn(
                "px-1.5 py-0.5 text-xs rounded-full",
                selectedCategory === category.Id
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              )}>
                {category.taskCount}
              </span>
            </button>
          ))}

          {isAddingCategory && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-3 animate-scale-in">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Category name..."
                className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:border-primary"
                autoFocus
              />
              
              <div className="space-y-2">
                <label className="text-xs text-gray-600 font-medium">Color:</label>
                <div className="grid grid-cols-4 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all duration-200 hover:scale-110",
                        selectedColor === color && "ring-2 ring-gray-300 ring-offset-1"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 text-xs py-1.5"
                >
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName("");
                    setSelectedColor("#5B5FDE");
                  }}
                  className="text-xs py-1.5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;