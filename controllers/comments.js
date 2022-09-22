const UserModel = require("../models/user");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");

const getAllComments = (req, res, next) => {};

const getCommentById = (req, res, next) => {};

const getCommentByUser = (req, res, next) => {};

const getCommentByPost = (req, res, next) => {};

const editComment = (req, res, next) => {};

const deleteComment = (req, res, next) => {};

const addComment = (req, res, next) => {};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentByPost,
  getCommentByUser,
  editComment,
  deleteComment,
  addComment,
};
