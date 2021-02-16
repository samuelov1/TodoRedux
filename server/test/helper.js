import generateTestData from "./testData";

export const generateExpectedTasks = (parseObjectId = false) => {
  const tasks = generateTestData().tasks;

  const createModel = (task) => {
    const subtasks = findChildren(task._id);
    if (parseObjectId) {
      task._id = task._id.toString();
      if (task.parentId) task.parentId = task.parentId.toString();
    }
    return { ...task, subtasks };
  };

  const findChildren = (id) => {
    return tasks
      .filter(
        (subtask) =>
          subtask.parentId && subtask.parentId.toString() === id.toString()
      )
      .map((task) => createModel(task));
  };

  const parentTasks = tasks.filter((task) => !task.parentId);

  return parentTasks.map((task) => createModel(task));
};
