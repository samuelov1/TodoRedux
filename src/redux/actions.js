let nextId = 3;

export const addTask = task => ({
  type: "ADD_TODO",
  payload: {
    id: ++nextId,
    ...task
  }
});
