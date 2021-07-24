const fs = require("fs");
const path = require("path");

const users_file = "users.json";
const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../users/users.json")));

const UserRegistrationStatus = {
  USER_NOT_REGISTERED: 0,
  USER_INVALID_PASSWORD: 1,
  USER_IS_REGISTERED: 2,
};

function login(user) {
  let isUserRegistered = checkUserRegistration(user.email, user.password);

  let options;
  switch (isUserRegistered.status) {
    case UserRegistrationStatus.USER_NOT_REGISTERED:
      options = {
        user: null,
        message:
          "There is not a user registered with the credentials provided.",
      };
      break;
    case UserRegistrationStatus.USER_INVALID_PASSWORD:
      options = {
        user: null,
        message: "You have entered the wrong password. Please try again.",
      };
      break;
    case UserRegistrationStatus.USER_IS_REGISTERED:
      options = { user: isUserRegistered.user, message: "Login Successful." };
      break;
    default:
      options = { user: null, message: "Something went wrong." };
  }

  return options;
}

function signup(user) {
  let isUserRegistered = checkUserRegistration(user.email);

  if (isUserRegistered.status === UserRegistrationStatus.USER_NOT_REGISTERED) {
    user.data = [];
    users.push(user);

    fs.writeFile(users_file, JSON.stringify(users), (err) => {
      if (err) {
        throw err;
      }
    });

    return { user: user };
  } else {
    return {
      user: null,
      message:
        "There is already an account registered with this email. Try to login or sign up with a different e-mail address.",
    };
  }
}

function checkUserRegistration(userEmail, userPassword) {
  users.forEach((user) => {
    if (user.email === userEmail) {
      if (user.password === userPassword) {
        return {
          user,
          status: UserRegistrationStatus.USER_IS_REGISTERED,
        };
      } else {
        return {
          user: null,
          status: UserRegistrationStatus.USER_INVALID_PASSWORD,
        };
      }
    }
  });

  return { user: null, status: UserRegistrationStatus.USER_NOT_REGISTERED };
}

function getUserData(userEmail) {
  users.forEach((user) => {
    if (user.email === userEmail) {
      return { user, status: UserRegistrationStatus.USER_IS_REGISTERED };
    }
  });

  return { user: null, status: UserRegistrationStatus.USER_NOT_REGISTERED };
}

module.exports = { login, signup };
