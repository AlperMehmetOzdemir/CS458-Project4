const fs = require("fs");
const path = require("path");

let users = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../users/users.json"))
);

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
    user.id = users.length + 1;
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
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === userEmail) {
      if (users[i].password == userPassword) {
        return {
          user: users[i],
          status: UserRegistrationStatus.USER_IS_REGISTERED,
        };
      } else {
        return {
          user: null,
          status: UserRegistrationStatus.USER_INVALID_PASSWORD,
        };
      }
    }
  }

  return { user: null, status: UserRegistrationStatus.USER_NOT_REGISTERED };
}

function updateUserProfile(userId, newEmail, newAge) {
  const user = users.filter((user) => user.id == userId)[0];
  const otherUsers = users.filter((user) => user.id != userId);

  user.email = newEmail;
  user.age = newAge;

  otherUsers.push(user);

  users = [...otherUsers];

  try {
    fs.writeFile(
      path.resolve(__dirname, "../users/users.json"),
      JSON.stringify(users),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
    return user;
  } catch (err) {
    console.error(err);
  }
}

function addUserSymptoms(userId, symptoms) {
  const user = users.filter((user) => user.id == userId)[0];
  const otherUsers = users.filter((user) => user.id != userId);

  user.data.push(symptoms);

  otherUsers.push(user);

  users = [...otherUsers];

  try {
    fs.writeFile(
      path.resolve(__dirname, "../users/users.json"),
      JSON.stringify(users),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
    return user;
  } catch (err) {
    console.error(err);
  }
}

function getUserData(userEmail) {
  users.forEach((user) => {
    if (user.email === userEmail) {
      return { user, status: UserRegistrationStatus.USER_IS_REGISTERED };
    }
  });

  return { user: null, status: UserRegistrationStatus.USER_NOT_REGISTERED };
}

module.exports = { login, signup, updateUserProfile, addUserSymptoms };
