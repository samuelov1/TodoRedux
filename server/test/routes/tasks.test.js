import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";
import { ObjectId } from "mongodb";

import generateTestData from "../testData";
import { generateExpectedTasks } from "../helper";
import server from "../../src/server";
const expectedTasks = generateExpectedTasks(true);

chai.use(chaiHttp);

describe("Tasks route", () => {
  beforeEach(() => mongoUnit.load(generateTestData()));

  afterEach(() => mongoUnit.drop());

  describe("GET: /tasks", () => {
    it("Should return a list of tasks", (done) => {
      chai
        .request(server)
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
        .request(server)
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
        .request(server)
        .get(`/tasks/${id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
