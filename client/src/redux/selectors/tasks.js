import {
  getSelectedSortingOption,
  getShowCompletedTasks,
  getIsSortingReversed
} from "./filters";

const getTasksState = store => store.tasks;

export const getAllTasks = store => {
  return getTasksState(store).tasks;
};

export const getFilteredTasks = store => {
  let tasks = getTasksState(store).tasks;
  const selectedSortingOption = getSelectedSortingOption(store);
  const showCompletedTasks = getShowCompletedTasks(store);
  const isSortingReversed = getIsSortingReversed(store);

  tasks = tasks.filter(task => showCompletedTasks || !task.isCompleted);

  if (selectedSortingOption) {
    const sortFunction = selectedSortingOption.sortFunction;
    tasks.sort(sortFunction);
    if (isSortingReversed) tasks.reverse();
  }

  return tasks;
};

export const getIsLoading = store => {
  return getTasksState(store).isLoading;
};

export const getIsError = store => {
  return getTasksState(store).isError;
};
