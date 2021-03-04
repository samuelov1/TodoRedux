import DB from "../DB";
import { ObjectId } from "mongodb";
import NotFoundError from "../errors/NotFoundError";

const collectionName = "tasks";

export const findAllTasks = async () => {
  try {
    const query = {
      parentId: { $exists: false }
    };
    const parentTasks = await DB.find(collectionName, query);
    return Promise.all(parentTasks.map(populateTask));
  } catch (err) {
    throw err;
  }
};

export const populateTask = async (task) => {
  try {
    if (task.subtasks.length === 0) return task;

    const query = {
      parentId: ObjectId(task._id)
    };
    const subtasks = await DB.find(collectionName, query);
    const populatedSubtasks = await Promise.all(subtasks.map(populateTask));
    const populatedTask = { ...task, subtasks: populatedSubtasks };

    return populatedTask;
  } catch (err) {
    throw err;
  }
};

export const findById = async (id) => {
  try {
    const task = await DB.findOne(collectionName, { _id: ObjectId(id) });

    if (!task) {
      throw new NotFoundError(`Could not find task with the given ID: ${id}`);
    }

    const populatedTask = await populateTask(task);
    return populatedTask;
  } catch (err) {
    throw err;
  }
};

export const setCompletedAndUpdateAncestor = async (id, isCompleted) => {
  try {
    const updatedTask = await setCompletedRecursively(id, isCompleted);
    if (!updatedTask.parentId) return updatedTask;

    const updatedAncestor = await updateParentTask(
      updatedTask.parentId,
      updatedTask
    );

    return updatedAncestor;
  } catch (err) {
    throw err;
  }
};

export const setTaskCompleted = async (id, isCompleted) => {
  try {
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

    return task;
  } catch (err) {
    throw err;
  }
};

export const setCompletedRecursively = async (id, isCompleted) => {
  try {
    const task = await setTaskCompleted(id, isCompleted);

    task.subtasks = await Promise.all(
      task.subtasks.map((subtaskId) =>
        setCompletedRecursively(subtaskId, isCompleted)
      )
    );

    return task;
  } catch (err) {
    throw err;
  }
};

export const updateParentTask = async (parentId, task) => {
  try {
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
    await setTaskCompleted(parentTask._id, allSubtasksCompleted);

    return parentTask.parentId
      ? updateParentTask(parentTask.parentId, parentTask)
      : parentTask;
  } catch (err) {
    throw err;
  }
};

export const deleteTaskAndUpdateAncestor = async (id) => {
  try {
    const deletedTask = await deleteTaskRecursively(id);
    if (!deletedTask.parentId) return deletedTask;

    const filter = { _id: deletedTask.parentId };
    const update = { $pull: { subtasks: deletedTask._id } };
    const options = { returnOriginal: false };

    const updatedParent = await DB.findOneAndUpdate(
      collectionName,
      filter,
      update,
      options
    );

    if (!updatedParent) {
      throw new NotFoundError(
        `Could not find task with ID: ${deletedTask.parentId}`
      );
    }

    const updatedAncestor = await updateParentTask(deletedTask.parentId);

    return updatedAncestor;
  } catch (err) {
    throw err;
  }
};

export const deleteTaskRecursively = async (id) => {
  try {
    const task = await DB.findOneAndDelete(collectionName, {
      _id: ObjectId(id)
    });
    if (!task) {
      throw new NotFoundError(`Could not find task with the given ID: ${id}`);
    }

    await Promise.all(task.subtasks.map(deleteTaskRecursively));

    return task;
  } catch (err) {
    throw err;
  }
};

export const insertTask = async (task) => {
  try {
    task._id = ObjectId();
    if (task.parentId) {
      task.parentId = ObjectId(task.parentId);

      const filter = { _id: ObjectId(task.parentId) };
      const update = { $push: { subtasks: task._id } };
      const options = { returnOriginal: false };

      const updatedParent = await DB.findOneAndUpdate(
        collectionName,
        filter,
        update,
        options
      );

      if (!updatedParent) {
        throw new NotFoundError(
          `Could not find task with the given ID: ${task.parentId}`
        );
      }
    }

    const insertedTask = await DB.insertOne(collectionName, task);
    if (!task.parentId) return insertedTask;

    const updatedAncestor = await updateParentTask(task.parentId, insertedTask);
    return updatedAncestor;
  } catch (err) {
    throw err;
  }
};
