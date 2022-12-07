const CommentModel = require("../models/comment");
const UserModel = require("../models/user");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const controllers = require("./genericControllers");

const getAllComments = controllers.getAll(CommentModel);

const getCommentById = controllers.getById(CommentModel);

const voteComment = controllers.voteModel(CommentModel);

const getCommentByUser = (req, res, next) => {
  CommentModel.find({ owner: req.params.id }, async (err, docs) => {
    if (err) {
      next(new ApiError400(err.message));
    } else if (!docs) {
      next(new ApiError404("No comments found."));
    } else {
      await CommentModel.populate(docs, "post");
      await CommentModel.populate(docs, "owner");
      res.status(200).send(docs);
    }
  });
};

const getCommentByPost = (req, res, next) => {
  const postId = req.params.id;
  CommentModel.find({ post: postId }, async (err, docs) => {
    if (err) {
      next(new ApiError400(err.message));
    } else if (!docs) {
      next(new ApiError404("No comments found."));
    } else {
      await CommentModel.populate(docs, "post");
      await CommentModel.populate(docs, "owner");
      res.status(200).send(docs);
    }
  });
};

const editComment = async (req, res, next) => {
  try {
    if (!req.accountId) throw new ApiError401("Unauthorized user.");

    const edit = {
      content: req.body.content,
      rating: req.body.rating,
    };
    CommentModel.findOneAndUpdate(
      { _id: req.params.id, owner: req.accountId },
      edit,
      { new: true },
      (err, doc) => {
        if (err) {
          next(new ApiError400(err.message));
        } else if (!doc) {
          next(new ApiError404("No comment found"));
        } else {
          res.status(200).send(doc);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    if (!req.accountId) throw new ApiError401("Unauthorized user.");
    
    const user = await UserModel.findById(req.accountId);
    if (user.accessLevel === 1) {
      CommentModel.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
        if (err) {
          next(new ApiError400(err.message));
        } else if (!doc) {
          next(new ApiError404("No comment found"));
        } else {
          res.status(200).send(doc);
        }
      });
    } else {
      CommentModel.findOneAndDelete(
        { _id: req.params.id, owner: req.accountId },
        (err, doc) => {
          if (err) {
            next(new ApiError400(err.message));
          } else if (!doc) {
            next(new ApiError404("No comment found"));
          } else {
            res.status(200).send(doc);
          }
        }
      );
    }
  } catch (err) {
    next(err);
  }
};

const addComment = (req, res, next) => {
  try {
    if (!req.accountId || req.accountId != req.body.owner) {
      throw new ApiError400("Unauthorized.");
    }
    const comment = {
      content: req.body.content,
      owner: req.body.owner,
      post: req.body.post,
    };

    CommentModel.create(comment, (err, doc) => {
      if (err) {
        next(new ApiError400(err.message));
      } else {
        res.status(200).send(doc);
      }
    });
  } catch (err) {
    next(err);
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
  voteComment,
};
