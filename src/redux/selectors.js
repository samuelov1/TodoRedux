const getTasksState = store => store.tasks;
const getFiltersState = store => store.filters;

export const getAllTasks = store => {
  return getTasksState(store).tasks;
};

export const getFilteredTasks = store => {
  const tasks = getTasksState(store).tasks;
  const showCompletedTasks = getShowCompletedTasks(store);
  return tasks.filter(task => {
    return showCompletedTasks || !task.isCompleted;
  });
};

export const getShowCompletedTasks = store => {
  return getFiltersState(store).showCompletedTasks;
};
