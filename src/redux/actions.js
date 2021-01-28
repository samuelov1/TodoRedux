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
