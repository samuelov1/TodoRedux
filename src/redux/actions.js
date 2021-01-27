let nextId = 3;

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
