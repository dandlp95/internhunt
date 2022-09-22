const UserModel = require("../models/user");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");

const getAllUsers = (req, res, next) => {};

const getUserById = (req, res, next) => {};

const editUser = (req, res, next) => {};

const deleteUser = (req, res, next) => {};

const addUser = (req, res, next) => {};

const login = (req, res, next) => {};

const strikeUser = (req, res, next) => {};

const suspendUser = (req, res, next) => {};

module.exports = {
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
  addUser,
  login,
  strikeUser,
  suspendUser
};
