const PostModel = require("../models/Post");
const MajorModel = require("../models/major");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const controllers = require("./genericControllers");
const Api404Error = require("../middleware/error-handling/apiError404");

const apiAuthError = new ApiError401("Unathorized.");

const getPostById = controllers.getById(PostModel);

const editPost = async (req, res, next) => {
  try {
    if (!req.accountId) {
      throw apiAuthError;
    }
    edit = {
      title: req.body.title,
      content: req.body.content,
      city: req.body.city,
      company: req.body.company,
      type: req.body.type,
    };

    const postDoc = await PostModel.findById(req.accountId);

    if (!postDoc) {
      throw new Api404Error("No post found.");
    }

    if (postDoc.owner != req.accountId) {
      throw apiAuthError;
    }

    postDoc.updateOne(edit, (err, doc) => {
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

const deletePost = async (req, res, next) => {
  try {
    if (!req.accountId) {
      throw apiAuthError;
    }
    const postDoc = await PostModel.findById(req.params.id);
    if (!postDoc) {
      throw new Api404Error("No post found.");
    }
    if (postDoc.owner != req.accountId) {
      throw apiAuthError;
    }
    postDoc.deleteOne((err, doc) => {
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

const addPost = async (req, res, next) => {
  try {
    if (!req.accountId || req.accountId != req.body.owner) {
      throw apiAuthError;
    }

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

const getPosts = async (req, res, next) => {
  let search = req.query.search;

  let QString;

  if (search) {
    QString = search.split(" ").map((string) => new RegExp(string, "i"));
  } else {
    search = "";
    QString = search.split(" ").map((string) => new RegExp(string));
  }
  console.log(QString);

  let major = req.query.major;
  if (major) {
    const foundMajor = await MajorModel.findOne({ name: major }); // Add error handling here in case no major is returned.
    let department;
    if (foundMajor) {
      department = foundMajor.department;
    }
    PostModel.find(
      {
        $and: [
          { $or: [{ title: { $in: QString } }, { content: { $in: QString } }] },
          { departments: department },
        ],
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
  } else {
    PostModel.find(
      {
        $and: [
          { $or: [{ title: { $in: QString } }, { content: { $in: QString } }] },
        ],
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
  }
};

module.exports = {
  getPostById,
  editPost,
  deletePost,
  addPost,
  getPostByUser,
  getPostsByDepartment,
  getPosts,
};
