import { expect } from "chai";
import mongoUnit from "mongo-unit";

import testData from "../testData/tasks.json";
import Task from "../../src/models/task";
import { generateExpectedTasks } from "../helper";

const expectedTasks = generateExpectedTasks();

describe("Tasks model", () => {
  beforeEach(() => mongoUnit.load(testData));

  afterEach(() => mongoUnit.drop());

  describe("Get all tasks", () => {
    it("Should return all tasks", async () => {
      const tasks = await Task.findAllTasks();
      expect(tasks).to.deep.have.same.members(expectedTasks);
    });
  });
});
