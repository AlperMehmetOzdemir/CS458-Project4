const request = require("supertest");
const jsdom = require("jsdom");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiDom = require("chai-dom");

chai.use(chaiHttp);
chai.use(chaiDom);
const expect = chai.expect;

const server = require("../../src/server");

describe("Profile Page", function () {
  let htmlDOM;
  let response;

  after(function () {
    server.close();
  });

  it("should allow users to access it.", function (done) {
    chai
      .request(server)
      .get("/profile/1")
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it("should have appropriate metadata", function (done) {
    chai
      .request(server)
      .get("/profile/1")
      .end((err, res) => {
        expect(err).to.be.null;
        htmlDOM = new jsdom.JSDOM(res.text);
        const title = htmlDOM.window.document.querySelector("title");
        expect(title.innerHTML).to.have.string("Covid Monitoring | Profile");
        done();
      });
  });

  // it("should have a correct title.", function (done) {});
});
