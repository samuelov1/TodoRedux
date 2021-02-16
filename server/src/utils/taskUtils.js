import DB from "../DB";
import { ObjectId } from "mongodb";

export const findAllTasks = async () => {
  const parentTasks = await DB.find("tasks", { parentId: { $exists: false } });
  return Promise.all(parentTasks.map(populateTask));
};

export const populateTask = async (task) => {
  const subtasks = await DB.find("tasks", { parentId: ObjectId(task._id) });
  const populatedSubtasks = await Promise.all(subtasks.map(populateTask));
  return { ...task, subtasks: populatedSubtasks };
};

export const findById = async (id) => {
  const task = await DB.findOne("tasks", { _id: ObjectId(id) });
  return task ? populateTask(task) : null;
};
