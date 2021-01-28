const initialState = {
  showCompletedTasks: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_SHOW_COMPLETED": {
      return {
        ...state,
        showCompletedTasks: !state.showCompletedTasks
      };
    }
    default:
      return state;
  }
};

export default reducer;
