import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  tasks = [], 
  categories = [],
  loading = false,
  error = null,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onRetry,
  filter = "all",
  searchQuery = "",
  selectedCategory = null,
  className 
}) => {
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }

    // Apply status filter
    switch (filter) {
      case "active":
        filtered = filtered.filter(task => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter(task => task.completed);
        break;
      case "overdue":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.completed) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate < today;
        });
        break;
      case "all":
      default:
        // Show all tasks
        break;
    }

    // Sort tasks: incomplete first, then by priority, then by due date
    filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Priority order: high -> medium -> low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Due date: earlier dates first
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Finally sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredTasks(filtered);
  }, [tasks, filter, searchQuery, selectedCategory]);

  const getCategoryForTask = (task) => {
    return categories.find(cat => cat.Id === task.categoryId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (filteredTasks.length === 0) {
    let emptyMessage = "No tasks found";
    let emptyDescription = "Create your first task to get started";
    
    if (searchQuery) {
      emptyMessage = "No matching tasks";
      emptyDescription = `No tasks match "${searchQuery}"`;
    } else if (filter === "completed") {
      emptyMessage = "No completed tasks";
      emptyDescription = "Complete some tasks to see them here";
    } else if (filter === "overdue") {
      emptyMessage = "No overdue tasks";
      emptyDescription = "Great job staying on top of your deadlines!";
    } else if (selectedCategory) {
      const category = categories.find(cat => cat.Id === selectedCategory);
      emptyMessage = `No tasks in ${category?.name || "category"}`;
      emptyDescription = "Add tasks to this category to see them here";
    }

    return (
      <Empty 
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {filteredTasks.map((task, index) => (
        <TaskCard
          key={task.Id}
          task={task}
          category={getCategoryForTask(task)}
          onToggleComplete={onToggleComplete}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          className="animate-slide-right"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default TaskList;