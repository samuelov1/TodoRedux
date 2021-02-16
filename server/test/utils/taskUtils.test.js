import { expect } from "chai";
import mongoUnit from "mongo-unit";

import generateTestData from "../testData";
import { findAllTasks, findById } from "../../src/utils/taskUtils";
import { generateExpectedTasks } from "../helper";

const expectedTasks = generateExpectedTasks();

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
  });
});
