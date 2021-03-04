import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import mongoUnit from "mongo-unit";
import { ObjectId } from "mongodb";

import generateTestData from "../testData";
import {
  findAllTasks,
  findById,
  setCompletedRecursively,
  updateParentTask,
  setCompletedAndUpdateAncestor,
  deleteTaskRecursively,
  deleteTaskAndUpdateAncestor,
  insertTask
} from "../../src/utils/taskUtils";
import NotFoundError from "../../src/errors/NotFoundError";
import * as testUtils from "../testUtils";

chai.use(chaiAsPromised);

const expectedTasks = testUtils.generateExpectedTasks();

describe("Task utils", () => {
  beforeEach(() => mongoUnit.load(generateTestData()));

  afterEach(() => mongoUnit.drop());

  describe("Get all tasks", () => {
    it("Should return all tasks", async () => {
      const tasks = await findAllTasks();

      expect(tasks).to.deep.have.same.members(expectedTasks);
    });
  });

  describe("Get task by Id", () => {
    it("Should return task with given Id", async () => {
      const expected = expectedTasks[0];
      const task = await findById(expected._id);

      expect(task).to.deep.equal(expected);
    });

    it("Should throw error if no tasks where found", async () => {
      const id = ObjectId();

      expect(findById(id)).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("Set completed recursively", () => {
    it("Should return updated task", async () => {
      const isCompleted = true;
      const task = testUtils.getLongestPath(expectedTasks).ancestor;
      const idToUpdate = task._id;

      const updatedTask = await setCompletedRecursively(
        idToUpdate,
        isCompleted
      );

      const isCompletedRecursively = testUtils.isCompletedRecursively(
        updatedTask,
        isCompleted
      );

      expect(isCompletedRecursively).to.be.true;
    });

    it("Should throw error if no task was found", async () => {
      const id = ObjectId();

      expect(setCompletedRecursively(id, true)).to.be.rejectedWith(
        NotFoundError
      );
    });
  });

  describe("Update parent task", () => {
    it("Should set task completed if all subtasks are completed", async () => {
      const task = testUtils.getLongestPath(expectedTasks).ancestor;

      await setCompletedRecursively(task._id, false);
      await Promise.all(
        task.subtasks.map((subtask) =>
          setCompletedRecursively(subtask._id, true)
        )
      );
      const updatedTask = await updateParentTask(task._id);
      expect(updatedTask.isCompleted).to.be.true;
    });

    it("Should set task not completed if not all subtasks are completed", async () => {
      const task = testUtils.getLongestPath(expectedTasks).ancestor;
      const subtasks = task.subtasks.slice(0, -1);

      await setCompletedRecursively(task._id, true);
      await Promise.all(
        subtasks.map((subtask) => setCompletedRecursively(subtask._id, false))
      );
      const updatedTask = await updateParentTask(task._id);
      expect(updatedTask.isCompleted).to.be.false;
    });

    it("Should throw error if no task was found", async () => {
      const id = ObjectId();
      expect(updateParentTask(id)).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("Set completed and update ancestor", () => {
    it("Should set task completed and return updated ancestor", async () => {
      const longestPath = testUtils.getLongestPath(expectedTasks);
      const task = longestPath.leaf;
      const ancestor = longestPath.ancestor;
      const isCompleted = false;

      await setCompletedRecursively(ancestor._id, true);

      const updatedAncestor = await setCompletedAndUpdateAncestor(
        task._id,
        isCompleted
      );

      expect(updatedAncestor.isCompleted).to.equal(isCompleted);
    });

    it("Should throw error if no task was found", async () => {
      const id = ObjectId();

      expect(setCompletedAndUpdateAncestor(id, true)).to.be.rejectedWith(
        NotFoundError
      );
    });
  });

  describe("Delete task recursively", () => {
    it("Should return deleted task", async () => {
      const longestPath = testUtils.getLongestPath(expectedTasks);
      const task = longestPath.ancestor;
      const subtask = longestPath.leaf;

      const deletedTask = await deleteTaskRecursively(task._id);

      expect(deletedTask._id).to.deep.equal(task._id);
      expect(findById(subtask._id)).to.be.rejectedWith(NotFoundError);
    });

    it("Should throw error if no task was found", async () => {
      const id = ObjectId();

      expect(deleteTaskRecursively(id)).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("Delete task and update ancestor", () => {
    it("Should set task completed and return updated ancestor", async () => {
      const longestPath = testUtils.getLongestPath(expectedTasks);
      const ancestor = longestPath.ancestor;
      const subtask = ancestor.subtasks[0];

      await setCompletedRecursively(ancestor._id, true);
      await setCompletedAndUpdateAncestor(subtask._id, false);

      const updatedAncestor = await deleteTaskAndUpdateAncestor(subtask._id);

      expect(updatedAncestor.isCompleted).to.be.true;
      expect(updatedAncestor.subtasks.length).to.equal(
        ancestor.subtasks.length - 1
      );
    });

    it("Should throw error if no task was found", async () => {
      const id = ObjectId();

      expect(deleteTaskAndUpdateAncestor(id)).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("Insert task", () => {
    it("Should return inserted task", async () => {
      const taskToInsert = {
        content: "New task"
      };
      const insertedTask = await insertTask(taskToInsert);

      expect(insertedTask._id).to.exist;
    });

    it("Should return updated ancestor if task caused a change in the parent ", async () => {
      const { ancestor } = testUtils.getLongestPath(expectedTasks);
      const taskToInsert = {
        content: "New task",
        parentId: ancestor._id
      };

      await setCompletedRecursively(ancestor._id, true);

      const updatedAncestor = await insertTask(taskToInsert);

      expect(updatedAncestor._id).to.deep.equal(ancestor._id);
      expect(updatedAncestor.isCompleted).to.be.false;
      expect(updatedAncestor.subtasks).to.have.lengthOf.above(
        ancestor.subtasks.length
      );
    });

    it("Should throw error if task has non-existant parent", async () => {
      const taskToInsert = {
        content: "New task",
        parentId: ObjectId()
      };

      await expect(insertTask(taskToInsert)).to.be.rejectedWith(NotFoundError);
    });
  });
});
