const PostModel = require("../models/Post");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const controllers = require("./genericControllers");

const getAllPosts = controllers.getAll(PostModel);

const getPostById = controllers.getById(PostModel);

const editPost = (req, res, next) => {
  edit = {
    title: req.body.title,
    content: req.body.content,
    city: req.body.city,
    company: req.body.company,
    type: req.body.type,
  };

  PostModel.findByIdAndUpdate(req.params.id, edit, (err, doc) => {
    if (err) {
      const apiError400 = new ApiError400(err.message);
      next(apiError400);
    } else if (!doc) {
      const apiError404 = new ApiError404("Post not found.");
      next(apiError404);
    } else {
      res.status(200).send(doc);
    }
  });
};

const deletePost = (req, res, next) => {
  PostModel.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      const apiError400 = new ApiError400(err.message);
      next(apiError400);
    } else if (!doc) {
      const apiError404 = new ApiError404("Post not found.");
      next(apiError404);
    } else {
      res.status(200).send(doc);
    }
  });
};

const addPost = (req, res, next) => {
  const post = {
    title: req.body.title,
    content: req.body.content,
    // date: new Date(), Its added by default in the db
    owner: req.body.owner,
    city: req.body.city,
    company: req.body.company,
    type: req.body.type,
  };
  PostModel.create(post, (err, doc) => {
    if (err) {
      const apiError400 = new ApiError400();
      next(apiError400);
    } else {
      res.status(200).send(doc);
    }
  });
};

const getPostByUser = (req, res, next) => {
  PostModel.find({ owner: req.body.owner }, (err, docs) => {
    if (err) {
      const apiError400 = new ApiError400();
      next(apiError400);
    } else {
      res.status(200).send(docs);
    }
  });
};

module.exports = {
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
  addPost,
  getPostByUser,
};
