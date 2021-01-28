const getTasksState = store => store.tasks;
const getFiltersState = store => store.filters;

export const getAllTasks = store => {
  return getTasksState(store).tasks;
};

export const getFilteredTasks = store => {
  let tasks = getTasksState(store).tasks;
  const selectedSortingOption = getSelectedSortingOption(store);
  const showCompletedTasks = getShowCompletedTasks(store);

  if (selectedSortingOption) {
    const sortFunction = selectedSortingOption.sortFunction;
    tasks = tasks.sort(sortFunction);
  }

  return tasks.filter(task => {
    return showCompletedTasks || !task.isCompleted;
  });
};

export const getShowCompletedTasks = store => {
  return getFiltersState(store).showCompletedTasks;
};

export const getSortingOptions = store => {
  return getFiltersState(store).sortingOptions;
};

export const getSelectedSortingOption = store => {
  const selectedOptionId = getFiltersState(store).selectedSortingOption;
  if (selectedOptionId) {
    return (
      selectedOptionId &&
      getSortingOptions(store).find(options => options.id === selectedOptionId)
    );
  }
  return null;
};
