const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const expect = chai.expect;

const server = require("../../src/server");

describe("Index Route", function () {
  let response;

  after(function () {
    server.close();
  });

  it("should allow users to access it.", function (done) {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it("should redirect users not logged in to the Login page", function (done) {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo("http://localhost:5000/login");
        done();
      });
  });

  // it("should have a correct title.", function (done) {});
});
