import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";

import testData from "../testData/tasks.json";
import { generateExpectedTasks } from "../helper";
import server from "../../src/server";
const expectedTasks = generateExpectedTasks();

chai.use(chaiHttp);

describe("Tasks route", () => {
  beforeEach(() => mongoUnit.load(testData));

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
});
