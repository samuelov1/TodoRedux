const getFiltersState = store => store.filters;

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

export const getShowCompletedTasks = store => {
  return getFiltersState(store).showCompletedTasks;
};
