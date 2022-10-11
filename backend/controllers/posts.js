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
    const majors = req.body.majors;
    const departments = await Promise.all(
      majors.map(async (major) => {
        const majorDoc = await MajorModel.findOne({ name: major });
        if (majorDoc) {
          return majorDoc.department;
        }
      })
    );

    if (!departments) {
      throw new ApiError404("No departments found.");
    }

    const post = {
      title: req.body.title,
      content: req.body.content,
      // date: new Date(), Its added by default in the db
      owner: req.body.owner,
      state: req.body.state,
      company: req.body.company,
      type: req.body.type,
      departments: departments,
    };
    PostModel.create(post, (err, doc) => {
      if (err) {
        const apiError400 = new ApiError400(err.message);
        next(apiError400);
      } else {
        res.status(200).send(doc);
      }
    });
  } catch (err) {
    next(err);
  }
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
  const department = req.body.department;
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
  const major = decodeURI(req.params.major);
  const foundMajor = await MajorModel.findOne({ name: major }); // Add error handling here in case no major is returned.
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

const getPostsByQuery = async (req, res, next) => {
  const query = decodeURI(req.params.query);
  let QString = query.split(" ").map((string) => new RegExp(string));
  PostModel.find(
    {
      $or: [{ title: { $in: QString } }, { content: { $in: QString } }],
    },
    (err, docs) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!docs) {
        const apiError404 = new ApiError404("No documents found");
        next(apiError404);
      } else {
        res.status(200).send(docs);
      }
    }
  );
};

module.exports = {
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
  addPost,
  getPostByUser,
  getPostsByDepartment,
  getPostsByMajor,
  getPostsByQuery,
};
