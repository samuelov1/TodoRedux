import BaseModel from "./BaseModel";

class Task extends BaseModel {
  static async createModel(data) {
    const id = data._id;
    const subtasks = await this.findSubtasks(id);

    return new Task({ ...data, subtasks });
  }

  static async findAllTasks() {
    return this.find({ parentId: { $exists: false } });
  }

  static async findSubtasks(parentId) {
    return this.find({ parentId });
  }

  static async getAncestor(id) {
    const current = await this.findById(id);
    if (!current.parentId) {
      return current;
    }

    return this.getAncestor(current.parentId);
  }

  static async setCompleted(id, isCompleted) {
    return this.findOneAndUpdate(
      { _id: id },
      { $set: { isCompleted } },
      { returnOriginal: false }
    );
  }

  static async setCompletedAndUpdateAncestor(id, isCompleted) {
    const task = await this.findById(id);
    await this.setCompletedRecursively(task, isCompleted);

    const ancestor = await this.getAncestor(id);
    return await this.updateParentTask(ancestor);
  }

  static async updateParentTask(parentTask) {
    if (parentTask.subtasks.length > 0) {
      const updatedTasksPromises = parentTask.subtasks.map((subtask) =>
        this.updateParentTask(subtask)
      );
      parentTask.subtasks = await Promise.all(updatedTasksPromises);

      if (parentTask.subtasks.every((subtask) => subtask.isCompleted)) {
        return this.setCompleted(parentTask._id, true);
      }
    }

    return parentTask;
  }

  static async setCompletedRecursively(task, isCompleted) {
    if (task.subtasks.length > 0) {
      const updatedTasksPromises = task.subtasks.map((subtask) =>
        this.setCompletedRecursively(subtask, isCompleted)
      );
      await Promise.all(updatedTasksPromises);
    }
    return this.setCompleted(task._id, isCompleted);
  }
}

Task.collectionName = "tasks";

export default Task;
