const UserModel = require("../models/Post");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");

const getAllPosts = (req, res, next) => {};

const getPostById = (req, res, next) => {};

const editPost = (req, res, next) => {};

const deletePost = (req, res, next) => {};

const addPost = (req, res, next) => {};

const getPostByUser = (req, res, next) => {};

module.exports = {
    getAllPosts,
    getPostById,
    editPost,
    deletePost,
    addPost,
    getPostByUser
}