import tasksData from "../mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with Id ${id} not found`);
    }
    return { ...task };
  }

  async create(taskData) {
    await this.delay();
    const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1;
    const newTask = {
      Id: newId,
      title: taskData.title,
      description: taskData.description || "",
      categoryId: taskData.categoryId ? parseInt(taskData.categoryId) : null,
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: this.tasks.length + 1
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`);
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...updates,
      Id: parseInt(id)
    };

    // Handle completion status change
    if (updates.completed !== undefined) {
      updatedTask.completedAt = updates.completed 
        ? new Date().toISOString() 
        : null;
    }

    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`);
    }
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async getStats() {
    await this.delay();
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    const activeTasks = this.tasks.filter(t => !t.completed).length;
    
    // Calculate overdue tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = this.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < today;
    }).length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate tasks completed today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayCompleted = this.tasks.filter(t => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= todayStart && completedDate <= todayEnd;
    }).length;

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      overdueTasks,
      completionRate: Math.round(completionRate),
      todayCompleted
    };
  }

  async toggleComplete(id) {
    const task = await this.getById(id);
    return this.update(id, { completed: !task.completed });
  }
}

export default new TaskService();