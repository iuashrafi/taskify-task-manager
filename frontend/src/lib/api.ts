import axios from "axios";
import { Column, Task } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchColumns = async () => {
  try {
    const response = await api.get("/column");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch columns");
  }
};

export const createColumn = async (column: any) => {
  try {
    const response = await api.post("/column", column);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create column");
  }
};

export const updateColumn = async (
  columnId: string,
  updates: { title: string }
) => {
  try {
    const response = await api.patch(`/column/${columnId}`, updates);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update column");
  }
};

export const updateColumnOrder = async (columns: Column[]) => {
  const updates = columns.map((column, index) => ({
    id: column._id,
    order: index,
  }));

  try {
    const response = await api.patch("/column/reorder", updates);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update column order";
    console.error("API Error:", message);
    throw new Error(message);
  }
};

export const createTask = async (task: any) => {
  try {
    const response = await api.post("/task", {
      ...task,
      column: task.columnId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create task");
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const response = await api.patch(`/task/${taskId}`, updates);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update task");
  }
};

export const reorderTasks = async (columnId: string, taskIds: string[]) => {
  try {
    const response = await api.patch(`/task/reorder/${columnId}`, {
      tasks: taskIds,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to reorder tasks");
  }
};

export const reorderTasksInColumn = async (
  columnId: string,
  taskIds: string[]
) => {
  try {
    const response = await api.patch(`/task/reorder/${columnId}`, {
      tasks: taskIds,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to reorder tasks";
    console.error("Error reordering tasks:", message);
    throw new Error(message);
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await api.delete(`/task/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete task");
  }
};

export const deleteColumn = async (columnId: string) => {
  try {
    const response = await api.delete(`/column/${columnId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete column");
  }
};

export const updateProjectName = async (projectName: string) => {
  try {
    const response = await api.patch(`/task/projectName`, {
      projectName,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
