const initialState = {
  showCompletedTasks: false,
  sortingOptions: [
    {
      id: 1,
      name: "name",
      sortFunction: (a, b) => a.content.localeCompare(b.content)
    }
  ],
  selectedSortingOption: null,
  isReversed: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_SHOW_COMPLETED": {
      return {
        ...state,
        showCompletedTasks: !state.showCompletedTasks
      };
    }
    case "SET_SELECTED_SORTING_OPTION": {
      return {
        ...state,
        selectedSortingOption: action.payload,
        isReversed: false
      };
    }
    case "TOGGLE_SORT_REVERSED": {
      return {
        ...state,
        isReversed: !state.isReversed
      };
    }
    default:
      return state;
  }
};

export default reducer;
