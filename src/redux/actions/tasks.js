let nextId = 7;

export const addTask = task => ({
  type: "ADD_TODO",
  payload: {
    id: ++nextId,
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
      id: ++nextId,
      isCompleted: false,
      ...subtask
    },
    parentId
  }
});
