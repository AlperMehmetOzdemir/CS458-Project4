const chai = require("chai");

const expect = chai.expect;
const should = chai.should();

const utils = require("../src/utils/utils");

describe("Utility functions", function () {
  const registeredUser = {
    email: "test@dm.com",
    name: "John",
    lastName: "Doe",
    age: "24",
    gender: "male",
    password: "12345678",
    vaccination: "Moderna",
    data: [
      {
        date: "01/08/2021",
        fever: false,
        dryCough: false,
        fatigue: true,
        lossOfTasteOrSmell: false,
        achesAndPains: false,
        breathingDifficulties: false,
        chestPainOrPressure: false,
      },
      {
        date: "02/08/2021",
        fever: false,
        dryCough: true,
        fatigue: true,
        lossOfTasteOrSmell: false,
        achesAndPains: false,
        breathingDifficulties: false,
        chestPainOrPressure: false,
      },
      {
        date: "03/08/2021",
        fever: false,
        dryCough: true,
        fatigue: true,
        lossOfTasteOrSmell: false,
        achesAndPains: false,
        breathingDifficulties: false,
        chestPainOrPressure: false,
      },
      {
        date: "04/08/2021",
        fever: false,
        dryCough: true,
        fatigue: true,
        lossOfTasteOrSmell: true,
        achesAndPains: false,
        breathingDifficulties: false,
        chestPainOrPressure: false,
      },
      {
        date: "1/8/2021",
        fever: false,
        dryCough: true,
        fatigue: false,
        lossOfTasteOrSmell: false,
        achesAndPains: false,
        breathingDifficulties: false,
        chestPainOrPressure: true,
      },
    ],
    id: 1,
  };

  const wrongPassUser = {
    email: "test3@email.com",
    name: "Jane",
    lastName: "Doe",
    age: "24",
    gender: "male",
    password: "123456789",
    data: [],
    id: 3,
  };

  const unregisteredUser = {
    email: "test" + Math.floor(Math.random() * 10000) + "@email.com",
    name: "Jane",
    lastName: "Doe",
    age: "24",
    gender: "male",
    password: "12345678",
    data: [],
    id: 3,
  };

  const UserRegistrationStatus = {
    USER_NOT_REGISTERED: 0,
    USER_INVALID_PASSWORD: 1,
    USER_IS_REGISTERED: 2,
  };

  describe("checkUserRegistration function", function () {
    it("should return a null user if the user is not registered.", function (done) {
      const options = utils.checkUserRegistration(
        unregisteredUser.email,
        unregisteredUser.password
      );
      expect(options.user).to.be.null;
      done();
    });

    it("should return a status that the user is not registered if so.", function (done) {
      const options = utils.checkUserRegistration(
        unregisteredUser.email,
        unregisteredUser.password
      );

      expect(options.status).to.be.eql(
        UserRegistrationStatus.USER_NOT_REGISTERED
      );
      done();
    });

    it("should return a null user if the password is not valid.", function (done) {
      const options = utils.checkUserRegistration(
        wrongPassUser.email,
        wrongPassUser.password
      );

      expect(options.user).to.be.null;
      done();
    });

    it("should return a status that the password is wrong if so.", function (done) {
      const options = utils.checkUserRegistration(
        wrongPassUser.email,
        wrongPassUser.password
      );

      expect(options.status).to.be.eql(
        UserRegistrationStatus.USER_INVALID_PASSWORD
      );
      done();
    });

    it("should return a user if the user is registered.", function (done) {
      const options = utils.checkUserRegistration(
        registeredUser.email,
        registeredUser.password
      );

      expect(options.user).to.not.be.null;
      done();
    });

    it("should return a succes status if so.", function (done) {
      const options = utils.checkUserRegistration(
        registeredUser.email,
        registeredUser.password
      );

      expect(options.status).to.be.eql(
        UserRegistrationStatus.USER_IS_REGISTERED
      );
      done();
    });
  });

  describe("login function", function () {
    it("should return a null user if the user is not registered.", function (done) {
      const options = utils.login(unregisteredUser);
      expect(options.user).to.be.null;
      done();
    });

    it("should return a message that the user is not registered if so.", function (done) {
      const options = utils.login(unregisteredUser);

      expect(options.message).to.have.string(
        "There is not a user registered with the credentials provided"
      );
      done();
    });

    it("should return a null user if the password is not valid.", function (done) {
      const options = utils.login(wrongPassUser);

      expect(options.user).to.be.null;
      done();
    });

    it("should return a message that the password is wrong if so.", function (done) {
      const options = utils.login(wrongPassUser);

      expect(options.message).to.have.string(
        "You have entered the wrong password. Please try again"
      );
      done();
    });

    it("should return a user if the user is registered.", function (done) {
      const options = utils.login(registeredUser);

      expect(options.user).to.not.be.null;
      done();
    });

    it("should return a succes message if so.", function (done) {
      const options = utils.login(registeredUser);

      expect(options.message).to.have.string("Login Successful");
      done();
    });
  });

  describe("signup function", function () {
    it("should return a null user if the email is already in use.", function (done) {
      const signupResult = utils.signup(registeredUser);

      expect(signupResult.user).to.be.null;
      done();
    });

    it("should return a message informing that the email is already used if so.", function (done) {
      const signupResult = utils.signup(registeredUser);

      expect(signupResult.message).to.have.string(
        "There is already an account registered with this email. Try to login or sign up with a different e-mail address"
      );
      done();
    });

    it("it should register and return the user if the user was not registered", function (done) {
      const signupResult = utils.signup(unregisteredUser);

      console.log("singupResult: ", signupResult);

      expect(signupResult.user.name).to.eql(unregisteredUser.name);
      expect(signupResult.user.lastName).to.eql(unregisteredUser.lastName);
      expect(signupResult.user.age).to.eql(unregisteredUser.age);
      expect(signupResult.user.gender).to.eql(unregisteredUser.gender);
      expect(signupResult.user.email).to.eql(unregisteredUser.email);

      done();
    });
  });

  describe("updateUserProfile function", function () {
    it("should return the user with the symptoms added", function (done) {
      const id = 2;
      const newEmail = 22;
      const newAge = 42

      const result = utils.updateUserProfile(id, newEmail, newAge);

      expect(result.user).to.have.deep.property("id", 2);
      expect(result.user).to.have.deep.property("email", 22);
      expect(result.user).to.have.deep.property("newAge", 42);
      done();
    });
  });

  describe("addUserSymptoms function", function () {
    const symptoms = {
      date: "01/08/2021",
      fever: true,
      dryCough: false,
      fatigue: true,
      lossOfTasteOrSmell: false,
      achesAndPains: true,
      breathingDifficulties: false,
      chestPainOrPressure: true,
    };

    it("should return the user with the symptoms added", function (done) {
      const result = utils.addUserSymptoms(1, symptoms);

      console.log("addsymptoms: ", result)
      expect(result.user).to.deep.include(symptoms);
      done();
    });
  });

  describe("updateUserVaccination function", function (done) {
    it("should return the user with the symptoms added", function (done) {
      const result = utils.updateUserVaccination(1, "Biontech");

      console.log("updateVax: ", result)

      expect(result.user).to.have.deep.property("vaccination", "Biontech");
      done();
    });
  });
});
