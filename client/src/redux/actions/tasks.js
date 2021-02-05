import * as api from "../../api/tasks";

export const fetchTasks = () => async (dispatch) => {
  dispatch({ type: "FETCH_STARTED" });

  try {
    const response = await api.fetchTasks();
    dispatch({
      type: "FETCH_COMPLETED",
      payload: response.data,
    });
  } catch (error) {
    dispatch({ type: "FETCH_FAILED" });
  }
};

export const setTaskCompleted = (id, isCompleted) => async (dispatch) => {
  try {
    const response = await api.setTaskCompleted(id, isCompleted);
    dispatch({ type: "REPLACE_TASK", payload: response.data });
  } catch (error) {
    console.error(error);
  }
};

export const addTask = (task) => ({
  type: "ADD_TODO",
  payload: {
    id: Math.random() * 1000,
    isCompleted: false,
    ...task,
  },
});

export const editTask = (task) => ({
  type: "EDIT_TASK",
  payload: task,
});

export const deleteTask = (id) => ({
  type: "DELETE_TASK",
  payload: id,
});

export const addSubtask = (subtask, parentId) => ({
  type: "ADD_SUBTASK",
  payload: {
    subtask: {
      id: Math.random() * 1000,
      isCompleted: false,
      ...subtask,
    },
    parentId,
  },
});
