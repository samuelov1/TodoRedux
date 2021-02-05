import axios from "axios";

export const fetchTasks = async () =>
  axios.get(`http://localhost:5000/tasks`, {
    headers: { contentType: "text/plain" },
  });

export const setTaskCompleted = async (id, isCompleted) =>
  axios.patch(`http://localhost:5000/tasks/${id}/completed/${isCompleted}`);
