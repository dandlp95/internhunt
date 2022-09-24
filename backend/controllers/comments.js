const UserModel = require("../models/user");
const CommentModel = require("../models/comment");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const controllers = require("./genericControllers");

const getAllComments = controllers.getAll(CommentModel);

const getCommentById = controllers.getById(CommentModel);

const getCommentByUser = (req, res, next) => {
  const userId = req.params.id;
  CommentModel.find({ owner: userId }, (err, docs) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!docs) {
      const apiError = new ApiError404(err.message);
      next(apiError);
    } else {
      res.status(200).send(docs);
    }
  });
};

const getCommentByPost = (req, res, next) => {
  const postId = req.params.id;
  CommentModel.find({ post: postId }, (err, docs) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!docs) {
      const apiError = new ApiError404(err.message);
      next(apiError);
    } else {
      res.status(200).send(docs);
    }
  });
};

const editComment = (req, res, next) => {
  const edit = {
    content: req.body.content,
  };
  CommentModel.findByIdAndUpdate(req.body.id, edit, (err, doc) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!doc) {
      const apiError = new ApiError404(err.message);
      next(apiError);
    } else {
      res.status(200).send(doc);
    }
  });
};

const deleteComment = (req, res, next) => {
  CommentModel.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!doc) {
      const apiError = new ApiError404(err.message);
      next(apiError);
    } else {
      res.status(200).send(doc);
    }
  });
};

const addComment = (req, res, next) => {
  const comment = {
    content: req.body.content,
    owner: req.body.owner,
    
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentByPost,
  getCommentByUser,
  editComment,
  deleteComment,
  addComment,
};
