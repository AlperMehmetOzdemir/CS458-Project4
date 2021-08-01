// const request = require("supertest");
// const session = require("supertest-session");
// const jsdom = require("jsdom");
// const chai = require("chai");
// const chaiHttp = require("chai-http");

// chai.use(chaiHttp);
// const expect = chai.expect;

// const server = require("../../src/server");

// describe("Logged in users can access the Home page.", function () {
//   // beforeEach(function (done) {

//   // });

//   // after(function () {
//   // });

//   it("should allow logged in users to access it.", function (done) {
//     chai
//       .request(server)
//       .post("/login")
//       .type("form")
//       .send({
//         email: "test@dm.com",
//         password: "12345678",
//       })
//       .end((err, res) => {
//         // console.log("res is : ", res);
//         console.log("res headers: ", res.session);
//         expect(res.status).to.be.equal(200);
//         expect(res).to.redirectTo("http://localhost:5000/home");
//         done();
//       });
//   });

//   // it("should have a correct title.", function (done) {});
// });
