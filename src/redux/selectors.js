const getTasksState = store => store.tasks;

export const getAllTasks = store => {
  return getTasksState(store).tasks;
};
