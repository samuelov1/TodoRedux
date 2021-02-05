import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";

import testData from "../testData/tasks.json";
import TestHelper from "../TestHelper";
import server from "../../src/server";

chai.use(chaiHttp);

const testHelper = new TestHelper();

describe("Tasks route", () => {
  beforeEach(() => {
    testHelper.load(testData);
    return mongoUnit.load(testData);
  });

  afterEach(() => mongoUnit.drop());

  describe("GET: /tasks", () => {
    it("Should return a list of tasks", (done) => {
      const expected = testHelper.tasks;
      chai
        .request(server)
        .get("/tasks")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.deep.have.same.members(expected);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("PATCH: /tasks/:id/completed/:isCompleted", () => {
    it("Should throw error if id is invalid", (done) => {
      const invalidId = "123 123";
      chai
        .request(server)
        .patch(`/tasks/${invalidId}/completed/true`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });
    });

    it("Should throw error if isCompleted is invalid", (done) => {
      const invalidCompleted = "invalidBoolean";
      chai
        .request(server)
        .patch(`/tasks/601bafb50eaac592041a6940/completed/${invalidCompleted}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });
    });

    it("Should return updated ancestor after task patched", (done) => {
      const ancestor = testHelper.getLongestPath().ancestor;
      testHelper.setCompleted(ancestor._id, true);
      const expected = testHelper.getLongestPath().ancestor;

      chai
        .request(server)
        .patch(`/tasks/${ancestor._id}/completed/true`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });
});
