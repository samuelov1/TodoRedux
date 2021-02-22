import DB from "../DB";
import { ObjectId } from "mongodb";
import NotFoundError from "../errors/NotFoundError";

const collectionName = "tasks";

export const findAllTasks = async () => {
  const query = {
    parentId: { $exists: false }
  };
  const parentTasks = await DB.find(collectionName, query);
  return Promise.all(parentTasks.map(populateTask));
};

export const populateTask = async (task) => {
  if (task.subtasks.length === 0) return task;

  const query = {
    parentId: ObjectId(task._id)
  };
  const subtasks = await DB.find(collectionName, query);
  const populatedSubtasks = await Promise.all(subtasks.map(populateTask));
  const populatedTask = { ...task, subtasks: populatedSubtasks };

  return populatedTask;
};

export const findById = async (id) => {
  const task = await DB.findOne(collectionName, { _id: ObjectId(id) });

  if (!task) {
    throw new NotFoundError(`Could not find task with the given ID: ${id}`);
  }

  const populatedTask = await populateTask(task);
  return populatedTask;
};

export const setCompletedAndUpdateAncestor = async (id, isCompleted) => {
  const updatedTask = await setCompletedRecursively(id, isCompleted);
  if (!updatedTask.parentId) return updatedTask;

  const updatedAncestor = await updateParentTask(
    updatedTask.parentId,
    updatedTask
  );

  return updatedAncestor;
};

export const setCompletedRecursively = async (id, isCompleted) => {
  const filter = { _id: ObjectId(id) };
  const update = { $set: { isCompleted } };
  const options = { returnOriginal: false };

  const task = await DB.findOneAndUpdate(
    collectionName,
    filter,
    update,
    options
  );

  if (!task) throw new NotFoundError(`Could not find task with ID: ${id}`);

  task.subtasks = await Promise.all(
    task.subtasks.map((subtaskId) =>
      setCompletedRecursively(subtaskId, isCompleted)
    )
  );

  return task;
};

export const updateParentTask = async (parentId, task) => {
  const parentTask = await DB.findOne(collectionName, {
    _id: ObjectId(parentId)
  });
  if (!parentTask) {
    throw new NotFoundError(`Could not find task with ID: ${parentId}`);
  }

  const query = { parentId: ObjectId(parentId) };
  if (task) query._id = { $ne: task._id };

  const subtasks = await DB.find(collectionName, query);

  parentTask.subtasks = await Promise.all(subtasks.map(populateTask));
  if (task) parentTask.subtasks.push(task);

  const allSubtasksCompleted = parentTask.subtasks.every(
    (subtask) => subtask.isCompleted
  );

  if (parentTask.isCompleted === allSubtasksCompleted) return task;

  parentTask.isCompleted = allSubtasksCompleted;
  const filter = { _id: ObjectId(parentId) };
  const update = { $set: { isCompleted: allSubtasksCompleted } };
  const options = { returnOriginal: false };

  await DB.findOneAndUpdate(collectionName, filter, update, options);

  return parentTask.parentId
    ? updateParentTask(parentTask.parentId, parentTask)
    : parentTask;
};
