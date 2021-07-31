const fs = require("fs");
const path = require("path");

const users_file = "users.json";
const users = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../users/users.json"))
);

const UserRegistrationStatus = {
  USER_NOT_REGISTERED: 0,
  USER_INVALID_PASSWORD: 1,
  USER_IS_REGISTERED: 2,
};

function login(user) {
  console.log("user email is: ", user.email);
  console.log("user password is: ", user.password);
  let isUserRegistered = checkUserRegistration(user.email, user.password);

  console.log(isUserRegistered);

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

    fs.writeFile(
      path.resolve(__dirname, "../users/users.json"),
      JSON.stringify(users),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

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
  console.log("checked Email is: ", userEmail);
  console.log("checked password is: ", userPassword);

  for (let i = 0; i < users.length; i++) {
    console.log("User being compared is: ", users[i]);
    if (users[i].email === userEmail) {
      console.log("emails equal");
      if (users[i].password == userPassword) {
        console.log("passwords equal");
        return {
          user: users[i],
          status: UserRegistrationStatus.USER_IS_REGISTERED,
        };
      } else {
        console.log("passwords are not eqaul");
        return {
          user: null,
          status: UserRegistrationStatus.USER_INVALID_PASSWORD,
        };
      }
    }
  }

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
