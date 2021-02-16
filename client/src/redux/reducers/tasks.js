const initialState = {
  tasks: [],
  isLoading: false,
  isError: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_STARTED": {
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    }
    case "FETCH_COMPLETED": {
      return {
        tasks: action.payload,
        isLoading: false,
        isError: false
      };
    }
    case "FETCH_FAILED": {
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    }
    case "ADD_TODO": {
      return {
        tasks: [...state.tasks, action.payload]
      };
    }
    case "TOGGLE_TASK_COMPLETED": {
      const id = action.payload;

      const setCompletedRecursivly = (task, isCompleted) => {
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map(task =>
            setCompletedRecursivly(task, isCompleted)
          );
          return { ...task, isCompleted, subtasks: updatedSubtasks };
        }
        return { ...task, isCompleted };
      };

      const updateTasks = tasks => {
        return tasks.map(task => {
          if (task.id === id) {
            return setCompletedRecursivly(task, !task.isCompleted);
          }

          if (task.subtasks) {
            const updatedSubtasks = updateTasks(task.subtasks);
            const subtasksCompleted = updatedSubtasks.every(
              task => task.isCompleted
            );
            return {
              ...task,
              subtasks: updatedSubtasks,
              isCompleted: subtasksCompleted
            };
          }

          return task;
        });
      };

      return {
        tasks: updateTasks(state.tasks)
      };
    }
    case "EDIT_TASK": {
      const editedTask = action.payload;

      const updateTasks = tasks => {
        return tasks.map(task => {
          if (task.id === editedTask.id) {
            return editedTask;
          }

          if (task.subtasks) {
            return { ...task, subtasks: updateTasks(task.subtasks) };
          }

          return task;
        });
      };

      return {
        tasks: updateTasks(state.tasks)
      };
    }
    case "DELETE_TASK": {
      const id = action.payload;

      const filterTasks = tasks => {
        const filteredTasks = tasks.filter(task => task.id !== id);

        return filteredTasks.map(task => {
          if (task.subtasks) {
            const filteredSubtasks = filterTasks(task.subtasks);

            if (filteredSubtasks.length > 0) {
              return { ...task, subtasks: filteredSubtasks };
            }

            delete task.subtasks;
            return { ...task };
          }

          return task;
        });
      };

      return {
        tasks: filterTasks(state.tasks)
      };
    }
    case "ADD_SUBTASK": {
      const { subtask, parentId } = action.payload;

      const addSubtask = tasks => {
        return tasks.map(task => {
          if (task.id === parentId) {
            if (task.subtasks === undefined) task.subtasks = [];
            const updatedSubtasks = [...task.subtasks, subtask];
            return { ...task, subtasks: updatedSubtasks };
          }

          if (task.subtasks) {
            return { ...task, subtasks: addSubtask(task.subtasks) };
          }

          return task;
        });
      };

      return {
        tasks: addSubtask(state.tasks)
      };
    }
    default:
      return state;
  }
};

export default reducer;
