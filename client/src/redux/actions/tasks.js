import axios from "axios";

export const fetchTasks = () => async dispatch => {
  dispatch({ type: "FETCH_STARTED" });

  try {
    const response = await axios.get(`http://localhost:5000/tasks`);
    dispatch({ type: "FETCH_COMPLETED", payload: response.data });
  } catch (error) {
    dispatch({ type: "FETCH_FAILED" });
  }
};

export const addTask = task => ({
  type: "ADD_TODO",
  payload: {
    id: Math.random() * 1000,
    isCompleted: false,
    ...task
  }
});

export const toggleTaskCompleted = id => ({
  type: "TOGGLE_TASK_COMPLETED",
  payload: id
});

export const editTask = task => ({
  type: "EDIT_TASK",
  payload: task
});

export const deleteTask = id => ({
  type: "DELETE_TASK",
  payload: id
});

export const addSubtask = (subtask, parentId) => ({
  type: "ADD_SUBTASK",
  payload: {
    subtask: {
      id: Math.random() * 1000,
      isCompleted: false,
      ...subtask
    },
    parentId
  }
});
