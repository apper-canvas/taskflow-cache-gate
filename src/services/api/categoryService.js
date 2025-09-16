import taskService from "./taskService.js";

class CategoryService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'category_c';
  }

  initClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const client = this.initClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "order_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch categories:", response.message);
        throw new Error(response.message || "Failed to fetch categories");
      }
      
      const categories = response.data || [];
      
      // Get current tasks to calculate task counts
      try {
        const tasks = await taskService.getAll();
        return categories.map(category => ({
          ...category,
          task_count_c: tasks.filter(task => task.category_id_c === category.Id).length
        }));
      } catch (taskError) {
        // If task service fails, return categories without updated counts
        console.error("Failed to fetch tasks for count calculation:", taskError);
        return categories;
      }
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.initClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "order_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch category ${id}:`, response.message);
        throw new Error(response.message || "Failed to fetch category");
      }
      
      const category = response.data;
      
      // Get current tasks to calculate task count
      try {
        const tasks = await taskService.getAll();
        const task_count_c = tasks.filter(task => task.category_id_c === category.Id).length;
        return { ...category, task_count_c };
      } catch (taskError) {
        console.error("Failed to fetch tasks for count calculation:", taskError);
        return category;
      }
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(categoryData) {
    try {
      const client = this.initClient();
      
      // Only include Updateable fields
      const recordData = {
        Name: categoryData.name || "New Category",
        name_c: categoryData.name || "New Category",
        color_c: categoryData.color || "#5B5FDE",
        task_count_c: 0,
        order_c: Date.now() // Simple ordering mechanism
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create category:", response.message);
        throw new Error(response.message || "Failed to create category");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to create category:", result.message);
          throw new Error(result.message || "Failed to create category");
        }
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const client = this.initClient();
      
      // Only include Updateable fields
      const recordData = {
        Id: parseInt(id)
      };
      
      // Map updates to database fields
      if (updates.name !== undefined) {
        recordData.Name = updates.name;
        recordData.name_c = updates.name;
      }
      if (updates.color !== undefined) recordData.color_c = updates.color;
      if (updates.task_count_c !== undefined) recordData.task_count_c = updates.task_count_c;
      if (updates.order !== undefined) recordData.order_c = updates.order;
      
      const params = {
        records: [recordData]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update category ${id}:`, response.message);
        throw new Error(response.message || "Failed to update category");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Recalculate task count
          try {
            const tasks = await taskService.getAll();
            const updatedCategory = result.data;
            updatedCategory.task_count_c = tasks.filter(task => task.category_id_c === updatedCategory.Id).length;
            return updatedCategory;
          } catch (taskError) {
            console.error("Failed to recalculate task count:", taskError);
            return result.data;
          }
        } else {
          console.error(`Failed to update category ${id}:`, result.message);
          throw new Error(result.message || "Failed to update category");
        }
      }
      
      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error(`Error updating category ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.initClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete category ${id}:`, response.message);
        throw new Error(response.message || "Failed to delete category");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          console.error(`Failed to delete category ${id}:`, result.message);
          throw new Error(result.message || "Failed to delete category");
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new CategoryService();