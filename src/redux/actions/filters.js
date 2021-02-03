export const toggleShowCompleted = () => ({
  type: "TOGGLE_SHOW_COMPLETED"
});

export const setSelectedSortingOption = id => ({
  type: "SET_SELECTED_SORTING_OPTION",
  payload: id
});

export const toggleSortReversed = () => ({
  type: "TOGGLE_SORT_REVERSED"
});
