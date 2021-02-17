import DB from "../DB";
import { ObjectId } from "mongodb";

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
    throw Error(`Could not find task with the given ID: ${id}`);
  }

  const populatedTask = await populateTask(task);
  return populatedTask;
};
