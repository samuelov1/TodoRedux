import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";
import { ObjectId } from "mongodb";

import generateTestData from "../testData";
import { app } from "../../src/server";
import * as testUtils from "../testUtils";

const expectedTasks = testUtils.generateExpectedTasks(true);

chai.use(chaiHttp);

describe("Tasks route", () => {
  beforeEach(() => mongoUnit.load(generateTestData()));

  afterEach(() => mongoUnit.drop());

  describe("GET: /tasks", () => {
    it("Should return a list of tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.deep.have.same.members(expectedTasks);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET: /tasks/:id", () => {
    it("Should return task with given id", (done) => {
      const expected = expectedTasks[0];

      chai
        .request(app)
        .get(`/tasks/${expected._id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.deep.equal(expected);
          expect(res).to.have.status(200);
          done();
        });
    });

    it("Should return error if no task was found", (done) => {
      const id = ObjectId();

      chai
        .request(app)
        .get(`/tasks/${id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("PATCH: /tasks/:id/completed", () => {
    it("Should set task completed and return updated ancestor", (done) => {
      const task = testUtils.getLongestPath(expectedTasks).ancestor;
      const patch = { isCompleted: true };

      chai
        .request(app)
        .patch(`/tasks/${task._id}/completed`)
        .send(patch)
        .end((err, res) => {
          const updatedAncestor = res.body;
          expect(updatedAncestor.isCompleted).to.equal(patch.isCompleted);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("Should return error if no task was found", (done) => {
      const id = ObjectId();
      const patch = { isCompleted: true };

      chai
        .request(app)
        .patch(`/tasks/${id}/completed`)
        .send(patch)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });

    it("Should return error if invalid id is given", (done) => {
      const id = "123 123*";
      const patch = { isCompleted: true };

      chai
        .request(app)
        .patch(`/tasks/${id}/completed`)
        .send(patch)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });

    it("Should return error if invalid isCompleted is given", (done) => {
      const id = ObjectId();
      const patch = { isComplete: "invalidBoolean" };

      chai
        .request(app)
        .patch(`/tasks/${id}/completed`)
        .send(patch)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });
  });

  describe("DELETE: /tasks/:id", () => {
    it("Should delete task and return it", (done) => {
      const task = testUtils.getLongestPath(expectedTasks).ancestor;

      chai
        .request(app)
        .delete(`/tasks/${task._id}`)
        .end((err, res) => {
          const deleteTask = res.body;
          expect(deleteTask._id).to.deep.equal(task._id);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("Should return updated parent task if deletion has affected it", async () => {
      const requester = chai.request(app).keepOpen();
      const longestPath = testUtils.getLongestPath(expectedTasks);
      const ancestor = longestPath.ancestor;
      const subtask = ancestor.subtasks[0];

      await requester
        .patch(`/tasks/${ancestor._id}/completed`)
        .send({ isCompleted: true });

      await requester
        .patch(`/tasks/${subtask._id}/completed`)
        .send({ isCompleted: false });

      const response = await requester.delete(`/tasks/${subtask._id}`);
      const updatedAncestor = response.body;

      expect(response).to.have.status(200);
      expect(updatedAncestor.isCompleted).to.be.true;
      expect(updatedAncestor.subtasks.length).to.equal(
        ancestor.subtasks.length - 1
      );

      requester.close();
    });

    it("Should return error if invalid id is given", (done) => {
      const id = "123 123*";

      chai
        .request(app)
        .delete(`/tasks/${id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });

    it("Should return error if no task with given Id was found", (done) => {
      const id = ObjectId();

      chai
        .request(app)
        .delete(`/tasks/${id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("POST: /tasks", () => {
    it("Should return inserted task if it has not parentId", (done) => {
      const taskToInsert = {
        content: "New task"
      };

      chai
        .request(app)
        .post(`/tasks`)
        .send(taskToInsert)
        .end((err, res) => {
          const insertedTask = res.body;
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(insertedTask._id).to.exist;
          expect(insertedTask.isCompleted).to.be.false;
          expect(insertedTask.subtasks).to.be.empty;
          done();
        });
    });

    it("Should return updated ancestor if task caused a change in the parent", async () => {
      const requester = chai.request(app).keepOpen();
      const { ancestor } = testUtils.getLongestPath(expectedTasks);
      const taskToInsert = {
        content: "New task",
        parentId: ancestor._id
      };

      await requester
        .patch(`/tasks/${ancestor._id}/completed`)
        .send({ isCompleted: true });

      const response = await requester.post(`/tasks`).send(taskToInsert);
      const updatedAncestor = response.body;

      expect(response).to.have.status(201);
      expect(updatedAncestor._id).to.equal(ancestor._id);
      expect(updatedAncestor.isCompleted).to.be.false;
      expect(updatedAncestor.subtasks).to.have.lengthOf.above(
        ancestor.subtasks.length
      );

      requester.close();
    });

    it("Should return error if given task is with invalid format", (done) => {
      const invalidTask = {
        isCompleted: false,
        parentId: "123"
      };

      chai
        .request(app)
        .post(`/tasks`)
        .send(invalidTask)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });

    it("Should return error if given task is with invalid format", (done) => {
      const invalidTask = {
        isCompleted: false,
        parentId: "123"
      };

      chai
        .request(app)
        .post(`/tasks`)
        .send(invalidTask)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });
  });

  describe("PUT: /tasks", () => {
    it("Should return updated task", (done) => {
      const task = expectedTasks[0];
      const taskToUpdate = { ...task, content: "New content" };

      chai
        .request(app)
        .put(`/tasks`)
        .send(taskToUpdate)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.deep.equal(taskToUpdate);
          expect(res).to.have.status(201);
          done();
        });
    });

    it("Should return error if invalid task was sent", (done) => {
      const invalidTask = {
        _id: ObjectId(),
        content: 123
      };

      chai
        .request(app)
        .put(`/tasks`)
        .send(invalidTask)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });

    it("Should return error if no task was found", (done) => {
      const task = expectedTasks[0];
      const taskToUpdate = { ...task, _id: ObjectId() };

      chai
        .request(app)
        .put(`/tasks`)
        .send(taskToUpdate)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
