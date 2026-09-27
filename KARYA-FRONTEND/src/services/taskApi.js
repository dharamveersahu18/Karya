import api from "./api";

// Get tasks of a specific project
export const getProjectTasks = async (projectId) => {
  const response = await api.get(
    `/tasks/project/${projectId}`
  );

  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const response = await api.post(
    "/tasks",
    taskData
  );

  return response.data;
};

// Update task
export const updateTask = async (taskId, taskData) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    taskData
  );

  return response.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const response = await api.delete(
    `/tasks/${taskId}`
  );

  return response.data;
};