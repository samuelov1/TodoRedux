import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import mongoUnit from "mongo-unit";
import { ObjectId } from "mongodb";

import generateTestData from "../testData";
import { findAllTasks, findById } from "../../src/utils/taskUtils";
import { generateExpectedTasks } from "../helper";

chai.use(chaiAsPromised);

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

    it("Should throw error if no tasks where found", async () => {
      const id = ObjectId();

      expect(findById(id)).to.be.rejectedWith(Error);
    });
  });
});
