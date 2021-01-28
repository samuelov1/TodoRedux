const getTasksState = store => store.tasks;
const getFiltersState = store => store.filters;

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

export const getIsSortingReversed = store => {
  return getFiltersState(store).isReversed;
};
