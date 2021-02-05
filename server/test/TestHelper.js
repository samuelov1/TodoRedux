const loadTasksFromTestData = (testData) => {
  const tasks = testData.tasks;

  const createModel = (task) => {
    const subtasks = findChildren(task._id);
    return { ...task, subtasks };
  };

  const findChildren = (id) => {
    return tasks
      .filter((subtask) => subtask.parentId === id)
      .map((task) => createModel(task));
  };

  const parentTasks = tasks.filter((task) => !task.parentId);

  return parentTasks.map((task) => createModel(task));
};

class TestHelper {
  constructor() {
    this.tasks = null;
  }

  load(testData) {
    this.tasks = loadTasksFromTestData(testData);
  }

  getLongestPath() {
    let longestPath = 0;
    let longestPathAncestor = null;
    let longestPathLeaf = null;

    const findDeepestChild = (task, depth = 0) => {
      let deepest = { task, depth };

      task.subtasks.forEach((task) => {
        const temp = findDeepestChild(task, depth + 1);
        if (temp.depth > deepest.depth) {
          deepest = temp;
        }
      });

      return deepest;
    };

    this.tasks.forEach((ancestor) => {
      const { task, depth } = findDeepestChild(ancestor);
      if (depth > longestPath) {
        longestPath = depth;
        longestPathAncestor = ancestor;
        longestPathLeaf = task;
      }
    });

    return {
      length: longestPath,
      ancestor: longestPathAncestor,
      leaf: longestPathLeaf,
    };
  }

  static checkAllSubtasksCompleted(task, isCompleted) {
    if (task.subtasks.length > 0) {
      return task.subtasks.every((subtask) =>
        this.checkAllSubtasksCompleted(subtask, isCompleted)
      );
    }

    return task.isCompleted === isCompleted;
  }

  setCompleted(id) {
    const setCompletedRecursivly = (task, isCompleted) => {
      if (task.subtasks) {
        const updatedSubtasks = task.subtasks.map((task) =>
          setCompletedRecursivly(task, isCompleted)
        );
        return { ...task, isCompleted, subtasks: updatedSubtasks };
      }
      return { ...task, isCompleted };
    };

    const updateTasks = (tasks) => {
      return tasks.map((task) => {
        if (task._id === id) {
          return setCompletedRecursivly(task, !task.isCompleted);
        }

        if (task.subtasks.length > 0) {
          const updatedSubtasks = updateTasks(task.subtasks);
          const subtasksCompleted = updatedSubtasks.every(
            (task) => task.isCompleted
          );
          return {
            ...task,
            subtasks: updatedSubtasks,
            isCompleted: subtasksCompleted,
          };
        }

        return task;
      });
    };

    this.tasks = updateTasks(this.tasks);
  }
}

export default TestHelper;
