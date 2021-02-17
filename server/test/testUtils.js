import generateTestData from "./testData";

export const generateExpectedTasks = (parseObjectId = false) => {
  const tasks = generateTestData().tasks;

  const populateTask = (task) => {
    const subtasks = findChildren(task._id);
    const populatedTask = { ...task, subtasks };

    if (parseObjectId) {
      populatedTask._id = populatedTask._id.toString();
      if (populatedTask.parentId) {
        populatedTask.parentId = populatedTask.parentId.toString();
      }
    }
    return populatedTask;
  };

  const findChildren = (id) => {
    return tasks
      .filter(
        (subtask) =>
          subtask.parentId && subtask.parentId.toString() === id.toString()
      )
      .map((task) => populateTask(task));
  };

  const parentTasks = tasks.filter((task) => !task.parentId);
  const populatedTasks = parentTasks.map((task) => populateTask(task));

  return populatedTasks;
};

export const getLongestPath = (tasks) => {
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

  tasks.forEach((ancestor) => {
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
    leaf: longestPathLeaf
  };
};

export const isCompletedRecursively = (task, isCompleted) => {
  if (task.isCompleted !== isCompleted) return false;
  if (task.subtasks.length === 0) return true;

  return task.subtasks.every((subtask) =>
    isCompletedRecursively(subtask, isCompleted)
  );
};
