import axios from "axios";

export const fetchAllTasks = async () => {
  const { data } = await axios.get(`/tasks`);
  return data;
};

export const setCompletedById = async ({ id, isCompleted }) => {
  const { data } = await axios.patch(`/tasks/${id}/completed`, { isCompleted });
  return data;
};

export const addTask = async (task) => {
  const { data } = await axios.post("/tasks", task);
  return data;
};

export const removeTask = async (id) => {
  const { data } = await axios.delete(`/tasks/${id}`);
  return data;
};

export const updateTask = async (task) => {
  const { data } = await axios.put("/tasks", task);
  return data;
};
