const PostModel = require("../models/Post");
const MajorModel = require("../models/major");
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

const addPost = async (req, res, next) => {
  try {
    const departments = req.body.majors.map(async (major) => {
      const majorDoc = await MajorModel({ major: major });
      return majorDoc.department;
    });

    if (!departments) {
      throw new ApiError404("No departments found.");
    }

    const post = {
      title: req.body.title,
      content: req.body.content,
      // date: new Date(), Its added by default in the db
      owner: req.body.owner,
      city: req.body.city,
      company: req.body.company,
      type: req.body.type,
      departments: departments,
    };
  } catch (err) {
    next(err);
  }

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

const getPostsByDepartment = (req, res, next) => {
  const department = req.params.department;
  PostModel.find({ departments: department }, (err, docs) => {
    if (err) {
      const apiError400 = new ApiError400(err.message);
      next(apiError400);
    } else if (!docs) {
      const apiError404 = new ApiError404("No documents found");
      next(apiError404);
    } else {
      res.status(200).send(docs);
    }
  });
};

const getPostsByMajor = async (req, res, next) => {
  const major = req.params.major;
  const foundMajor = await MajorModel.find({ name: major });
  const department = foundMajor.department;

  PostModel.find({ departments: department }, (err, docs) => {
    if (err) {
      const apiError400 = new ApiError400(err.message);
      next(apiError400);
    } else if (!docs) {
      const apiError404 = new ApiError404("No documents found");
      next(apiError404);
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
  getPostsByDepartment,
  getPostsByMajor
};
