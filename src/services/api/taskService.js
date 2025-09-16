class TaskService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'task_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        throw new Error(response.message || "Failed to fetch tasks");
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.initClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch task ${id}:`, response.message);
        throw new Error(response.message || "Failed to fetch task");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const client = this.initClient();
      
      // Only include Updateable fields
      const recordData = {
        title_c: taskData.title || "",
        description_c: taskData.description || "",
        priority_c: taskData.priority || "medium",
        completed_c: false,
        created_at_c: new Date().toISOString(),
        order_c: Date.now() // Simple ordering mechanism
      };
      
      // Handle optional fields
      if (taskData.category_id_c) {
        recordData.category_id_c = parseInt(taskData.category_id_c);
      }
      if (taskData.due_date_c) {
        recordData.due_date_c = taskData.due_date_c;
      }
      
      const params = {
        records: [recordData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create task:", response.message);
        throw new Error(response.message || "Failed to create task");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to create task:", result.message);
          throw new Error(result.message || "Failed to create task");
        }
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
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
      if (updates.title !== undefined) recordData.title_c = updates.title;
      if (updates.description !== undefined) recordData.description_c = updates.description;
      if (updates.category_id_c !== undefined) recordData.category_id_c = updates.category_id_c ? parseInt(updates.category_id_c) : null;
      if (updates.priority !== undefined) recordData.priority_c = updates.priority;
      if (updates.due_date_c !== undefined) recordData.due_date_c = updates.due_date_c;
      if (updates.completed !== undefined) {
        recordData.completed_c = updates.completed;
        recordData.completed_at_c = updates.completed ? new Date().toISOString() : null;
      }
      if (updates.order !== undefined) recordData.order_c = updates.order;
      
      const params = {
        records: [recordData]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update task ${id}:`, response.message);
        throw new Error(response.message || "Failed to update task");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to update task ${id}:`, result.message);
          throw new Error(result.message || "Failed to update task");
        }
      }
      
      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error(`Error updating task ${id}:`, error?.response?.data?.message || error);
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
        console.error(`Failed to delete task ${id}:`, response.message);
        throw new Error(response.message || "Failed to delete task");
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          console.error(`Failed to delete task ${id}:`, result.message);
          throw new Error(result.message || "Failed to delete task");
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getStats() {
    try {
      const tasks = await this.getAll();
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.completed_c).length;
      const activeTasks = tasks.filter(t => !t.completed_c).length;
      
      // Calculate overdue tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdueTasks = tasks.filter(t => {
        if (!t.due_date_c || t.completed_c) return false;
        const dueDate = new Date(t.due_date_c);
        return dueDate < today;
      }).length;

      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      // Calculate tasks completed today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      const todayCompleted = tasks.filter(t => {
        if (!t.completed_at_c) return false;
        const completedDate = new Date(t.completed_at_c);
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
    } catch (error) {
      console.error("Error getting task stats:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      return this.update(id, { completed: !task.completed_c });
    } catch (error) {
      console.error(`Error toggling completion for task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new TaskService();