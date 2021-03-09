const setCompletedRecursivly = (task, isCompleted) => {
  const updatedSubtasks = task.subtasks.map((subtask) =>
    setCompletedRecursivly(subtask, isCompleted)
  );
  return { ...task, isCompleted, subtasks: updatedSubtasks };
};

export const optimisticSetCompletedById = (tasks, { id, isCompleted }) => {
  return tasks.map((task) => {
    if (task._id === id) {
      return setCompletedRecursivly(task, isCompleted);
    }

    if (task.subtasks.length > 0) {
      const updatedSubtasks = optimisticSetCompletedById(task.subtasks, {
        id,
        isCompleted
      });
      const updatedIsCompleted = updatedSubtasks.every(
        (task) => task.isCompleted
      );
      return {
        ...task,
        isCompleted: updatedIsCompleted,
        subtasks: updatedSubtasks
      };
    }

    return task;
  });
};

export const optimisticAddTask = (tasks, taskData) => {
  const taskToAdd = {
    isCompleted: false,
    subtasks: [],
    _id: "tempId",
    ...taskData
  };

  if (!taskToAdd.parentId) return [...tasks, taskToAdd];

  const insertTask = (tasks, taskToAdd) => {
    return tasks.map((task) => {
      const updatedSubtasks = insertTask(task.subtasks, taskToAdd);

      if (task._id === taskToAdd.parentId) {
        updatedSubtasks.push(taskToAdd);
      }

      if (updatedSubtasks.length > 0) {
        const updatedIsCompleted = updatedSubtasks.every(
          (task) => task.isCompleted
        );
        return {
          ...task,
          isCompleted: updatedIsCompleted,
          subtasks: updatedSubtasks
        };
      }

      return {
        ...task,
        subtasks: updatedSubtasks
      };
    });
  };

  return insertTask(tasks, taskToAdd);
};

export const optimisticRemoveTask = (tasks, id) => {
  const filteredTasks = tasks.filter((task) => task._id !== id);
  if (filteredTasks.length < tasks.length) return filteredTasks;

  return tasks.map((task) => {
    const filteredSubtasks = optimisticRemoveTask(task.subtasks, id);

    const updatedIsCompleted = filteredSubtasks.every(
      (task) => task.isCompleted
    );

    return {
      ...task,
      isCompleted: updatedIsCompleted,
      subtasks: filteredSubtasks
    };
  });
};

export const optimisticUpdateTask = (tasks, taskToUpdate) => {
  return tasks.map((task) => {
    if (task._id === taskToUpdate._id) return taskToUpdate;

    const updatedSubtasks = optimisticUpdateTask(task.subtasks, taskToUpdate);
    return { ...task, subtasks: updatedSubtasks };
  });
};
