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

  describe("PATCH: /tasks/:id/completed/:isCompleted", () => {
    it("Should set task completed and return updated ancestor", (done) => {
      const task = testUtils.getLongestPath(expectedTasks).ancestor;
      const isCompleted = true;

      chai
        .request(app)
        .patch(`/tasks/${task._id}/completed/${isCompleted}`)
        .end((err, res) => {
          const updatedAncestor = res.body;
          expect(updatedAncestor.isCompleted).to.equal(isCompleted);
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("Should return error if no task was found", (done) => {
      const id = ObjectId();

      chai
        .request(app)
        .patch(`/tasks/${id}/completed/true`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });

    it("Should return error if invalid id is given", (done) => {
      const id = "123 123*";

      chai
        .request(app)
        .patch(`/tasks/${id}/completed/true`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });

    it("Should return error if invalid isCompleted is given", (done) => {
      const id = ObjectId();
      const isCompleted = "invalidBoolean";

      chai
        .request(app)
        .patch(`/tasks/${id}/completed/${isCompleted}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          done();
        });
    });
  });
});
