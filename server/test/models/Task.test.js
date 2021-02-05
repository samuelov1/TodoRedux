import { expect } from "chai";
import mongoUnit from "mongo-unit";

import testData from "../testData/tasks.json";
import Task from "../../src/models/task";
import TestHelper from "../TestHelper";

const testHelper = new TestHelper();

describe("Tasks model", () => {
  beforeEach(() => {
    testHelper.load(testData);
    return mongoUnit.load(testData);
  });

  afterEach(() => mongoUnit.drop());

  describe("Get all tasks", () => {
    it("Should return all tasks", async () => {
      const tasks = await Task.findAllTasks();
      const expected = testHelper.tasks;
      expect(tasks).to.deep.have.same.members(expected);
    });
  });

  describe("Get ancestor", () => {
    it("Should return task's ancestor", async () => {
      const longestPath = testHelper.getLongestPath();
      const expected = longestPath.ancestor;
      const leaf = longestPath.leaf;

      const ancestor = await Task.getAncestor(leaf._id);
      expect(ancestor).to.deep.equal(expected);
    });
  });

  describe("Set completed recursively", () => {
    it("Should recursivly set all subtasks", async () => {
      const task = testHelper.getLongestPath().ancestor;
      const isCompleted = !task.isCompleted;
      await Task.setCompletedRecursively(task, isCompleted);
      const updatedTask = await Task.findById(task._id);

      const allCompleted = TestHelper.checkAllSubtasksCompleted(
        updatedTask,
        isCompleted
      );
      expect(allCompleted).to.be.true;
    });
  });

  describe("Update parent task", () => {
    it("Should set parent as completed if all subtasks are completed", async () => {
      const parentTask = testHelper.getLongestPath().ancestor;
      parentTask.isCompleted = false;
      parentTask.subtasks.forEach((subtask) => (subtask.isCompleted = true));

      await Task.updateParentTask(parentTask);

      const updatedTask = await Task.findById(parentTask._id);
      expect(updatedTask.isCompleted).to.be.true;
    });
  });

  describe("Set completed and update ancestor", () => {
    it("Should set and update ancestor", async () => {
      const id = "601bafb50eaac592041a6940";
      await Task.setCompletedAndUpdateAncestor(id, true);
      const actual = await Task.findAllTasks();
      testHelper.setCompleted(id);

      expect(actual).to.deep.have.same.members(testHelper.tasks);
    });
  });
});
