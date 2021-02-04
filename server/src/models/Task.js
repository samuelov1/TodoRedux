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
}

Task.collectionName = "tasks";

export default Task;
