const {
  validateLogin,
  validateRegistration,
  validateUserUpdate,
} = require("../validations/userValidationService");
const { register, login, update, find, findOne,remove } = require("../models/usersDataService");
const { generateUserPassword } = require("../helpers/bcrypt");
const normalizeUser = require("../helpers/normalizeUser");

const registerUser = async (rawUser) => {
  try {
    const { error } = validateRegistration(rawUser);
    if (error)  throw new Error(error.details[0].message);

    let user = normalizeUser(rawUser);
    user.password = generateUserPassword(user.password);
    user = await register(user);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};


const loginUser = async (rawUser) => {
  try {
    const { error } = validateLogin(rawUser);
if (error) throw new Error(error.details[0].message);

let user = { ...rawUser };
    user = await login(user);
   return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUsers = async () => {
  try {
    const users = await find();
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserID = async (userId) => {
  try {
    const user = await findOne(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateUser = async (userId, rawUser) => {
  try {
        const { error } = validateUserUpdate(rawUser);
        if (error) throw new Error(error.details[0].message);
    let user = { ...rawUser };
    user = await update(userId, user);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await remove(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};


module.exports = {registerUser, loginUser , updateUser , getUsers , getUserID , deleteUser};
