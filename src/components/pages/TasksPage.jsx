import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import ProgressStats from "@/components/organisms/ProgressStats";
import QuickAddBar from "@/components/molecules/QuickAddBar";
import TaskFilters from "@/components/molecules/TaskFilters";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TasksPage = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, categoriesData, statsData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
        taskService.getStats()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      
      // Update stats and categories
      const [statsData, categoriesData] = await Promise.all([
        taskService.getStats(),
        categoryService.getAll()
      ]);
      setStats(statsData);
      setCategories(categoriesData);
      
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(t => t.Id === updatedTask.Id ? updatedTask : t));
      
      // Update stats and categories
      const [statsData, categoriesData] = await Promise.all([
        taskService.getStats(),
        categoryService.getAll()
      ]);
      setStats(statsData);
      setCategories(categoriesData);
      
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      
      // Update stats
      const statsData = await taskService.getStats();
      setStats(statsData);
      
      toast.success(
        updatedTask.completed ? "Task completed! 🎉" : "Task marked as incomplete"
      );
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      
      // Update stats and categories
      const [statsData, categoriesData] = await Promise.all([
        taskService.getStats(),
        categoryService.getAll()
      ]);
      setStats(statsData);
      setCategories(categoriesData);
      
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Category operations
  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category created successfully!");
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  // Filter calculations
  const getFilterCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      all: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      overdue: tasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate < today;
      }).length
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
        isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
<div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileSidebarOpen(false);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Close sidebar"
        />
        <div className={cn(
          "fixed left-0 top-0 bottom-0 w-80 bg-white transform transition-transform duration-300",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={(categoryId) => {
              setSelectedCategory(categoryId);
              setIsMobileSidebarOpen(false);
            }}
            onAddCategory={handleAddCategory}
            loading={loading}
            error={error}
            onRetry={loadData}
          />
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onAddCategory={handleAddCategory}
            loading={loading}
            error={error}
            onRetry={loadData}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2"
                >
                  <ApperIcon name="Menu" size={20} />
                </Button>
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900">
                    TaskFlow
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Stay organized and productive
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <ProgressStats
              stats={stats}
              className="mb-6"
              isCollapsed={isStatsCollapsed}
              onToggle={() => setIsStatsCollapsed(!isStatsCollapsed)}
            />

            {/* Quick Add Bar */}
            <div className="mb-6">
              <QuickAddBar
                onAddTask={handleAddTask}
                placeholder="Add a new task... (try 'urgent meeting today' or 'low priority review tomorrow')"
              />
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery("")}
                  placeholder="Search tasks..."
                />
              </div>
              <TaskFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={getFilterCounts()}
                className="shrink-0"
              />
            </div>

            {/* Task List */}
            <TaskList
              tasks={tasks}
              categories={categories}
              loading={loading}
              error={error}
              onToggleComplete={handleToggleComplete}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onRetry={loadData}
              filter={activeFilter}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />

            {/* Add Task Button - Mobile */}
            <div className="fixed bottom-6 right-6 sm:hidden">
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="w-14 h-14 rounded-full shadow-xl"
              >
                <ApperIcon name="Plus" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        task={editingTask}
        categories={categories}
        title={editingTask ? "Edit Task" : "Add New Task"}
      />
    </div>
  );
};

export default TasksPage;