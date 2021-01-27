const initialState = {
  tasks: [
    { id: 1, content: "Wash the dishes" },
    { id: 2, content: "Do homework" },
    { id: 3, content: "Walk the dog" }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TODO": {
      return {
        tasks: [...state.tasks, action.payload]
      };
    }
    default:
      return state;
  }
};

export default reducer;
