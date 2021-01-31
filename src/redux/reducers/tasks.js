const initialState = {
  tasks: [
    { id: 1, content: "Wash the dishes", isCompleted: false },
    { id: 2, content: "Do homework", isCompleted: true },
    { id: 3, content: "Walk the dog", isCompleted: false }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TODO": {
      return {
        tasks: [...state.tasks, action.payload]
      };
    }
    case "TOGGLE_TASK_COMPLETED": {
      const id = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === id) {
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
      });

      return {
        tasks: updatedTasks
      };
    }
    case "EDIT_TASK": {
      const editedTask = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === editedTask.id) {
          return editedTask;
        }
        return task;
      });
      return {
        tasks: updatedTasks
      };
    }
    case "DELETE_TASK": {
      const id = action.payload;
      const updatedTasks = state.tasks.filter(task => task.id !== id);
      return {
        tasks: updatedTasks
      };
    }
    default:
      return state;
  }
};

export default reducer;
