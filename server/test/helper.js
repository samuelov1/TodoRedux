import testData from "./testData/tasks.json";

export const generateExpectedTasks = () => {
  const tasks = testData.tasks;

  const createModel = task => {
    const subtasks = findChildren(task._id);
    return { ...task, subtasks };
  };

  const findChildren = id => {
    return tasks
      .filter(subtask => subtask.parentId === id)
      .map(task => createModel(task));
  };

  const parentTasks = tasks.filter(task => !task.parentId);

  return parentTasks.map(task => createModel(task));
};
