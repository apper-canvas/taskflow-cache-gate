import categoriesData from "../mockData/categories.json";
import taskService from "./taskService.js";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    
    // Get current tasks to calculate task counts
    const tasks = await taskService.getAll();
    
    return this.categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.Id).length
    }));
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with Id ${id} not found`);
    }
    
    // Get current tasks to calculate task count
    const tasks = await taskService.getAll();
    const taskCount = tasks.filter(task => task.categoryId === category.Id).length;
    
    return { ...category, taskCount };
  }

  async create(categoryData) {
    await this.delay();
    const newId = Math.max(...this.categories.map(c => c.Id), 0) + 1;
    const newCategory = {
      Id: newId,
      name: categoryData.name,
      color: categoryData.color || "#5B5FDE",
      taskCount: 0,
      order: this.categories.length + 1
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with Id ${id} not found`);
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...updates,
      Id: parseInt(id)
    };
    
    this.categories[index] = updatedCategory;
    
    // Recalculate task count
    const tasks = await taskService.getAll();
    updatedCategory.taskCount = tasks.filter(task => task.categoryId === updatedCategory.Id).length;
    
    return { ...updatedCategory };
  }

  async delete(id) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with Id ${id} not found`);
    }
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
}

export default new CategoryService();