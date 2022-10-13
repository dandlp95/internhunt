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

const editComment = async (req, res, next) => {
  try {
    if (!req.accountId) {
      throw new ApiError401("Unauthorized user.");
    }
    const edit = {
      content: req.body.content,
    };
    const commentDoc = await CommentModel.findById(req.params.id);
    if (!commentDoc) {
      throw new ApiError404("Comment not found");
    }
    if (req.accountId != commentDoc.owner) {
      throw new ApiError401("Unauthorized user.");
    }
    await commentDoc.updateOne(edit);
    await commentDoc.save();
    res.status(200).send(commentDoc);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    if (!req.accountId) {
      throw new ApiError401("Unauthorized user.");
    }
    const commentDoc = await CommentModel.findById(req.params.id);
    if (!commentDoc) {
      throw new ApiError404("Comment not found.");
    }
    if (req.accountId != commentDoc.owner) {
      throw new ApiError401("Unauthorized user.");
    }

    commentDoc.deleteOne((err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else {
        res.status(200).send(doc);
      }
    });
  } catch (err) {
    next(err);
  }
};

const addComment = (req, res, next) => {
  try {
    if(!req.accountId){
      throw new ApiError400("Unauthorized.")
    }
    const comment = {
      content: req.body.content,
      owner: req.body.owner,
      post: req.body.post,
    };

    CommentModel.create(comment, (err, doc) => {
      if (err) {
        const apiError400 = new ApiError400();
        next(apiError400);
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
};
