const PostModel = require("../models/Post");
const MajorModel = require("../models/major");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const controllers = require("./genericControllers");
const Api404Error = require("../middleware/error-handling/apiError404");
const { default: mongoose } = require("mongoose");
const VotingHistory = require("../models/votingHistory");

const apiAuthError = new ApiError401("Unathorized.");

const getPostById = controllers.getById(PostModel);

const votePost = controllers.voteModel(PostModel, VotingHistory);

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
    const userId = mongoose.Types.ObjectId(req.accountId);

    PostModel.findOneAndUpdate(
      { _id: req.params.id, owner: userId },
      edit,
      { new: true },
      (err, doc) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!doc) {
          const apiError = new Api404Error("No document found");
          next(apiError);
        } else {
          res.status(200).send(doc);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    if (!req.accountId) {
      throw apiAuthError;
    }
    PostModel.findOneAndDelete(
      { _id: req.params.id, owner: req.accountId },
      (err, doc) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!doc) {
          const apiError = new Api404Error("No document found");
          next(apiError);
        } else {
          res.status(200).send(doc);
        }
      }
    );
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

const getPostByUser = async (req, res, next) => {
  PostModel.find({ owner: req.params.id }, async (err, docs) => {
    if (err) {
      const apiError400 = new ApiError400();
      next(apiError400);
    } else {
      await PostModel.populate(docs, "owner");
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
  let postType = req.query.type;
  let search = req.query.search;
  let sortByParam = req.query.sort;

  if (!sortByParam || sortByParam == "null" || sortByParam == "date") {
    sortByParam = { date: -1 };
  } else if (sortByParam == "rating") {
    sortByParam = { rating: -1 };
  } else {
    sortByParam = { date: -1 };
  }

  let QString;
  if (search != "null" && search != null) {
    console.log("not null");
    QString = search.split(" ").map((string) => new RegExp(string, "i"));
  } else {
    console.log("null");
    search = "";
    QString = search.split(" ").map((string) => new RegExp(string));
  }

  let PTypeString;
  if (postType != "null" && postType != null) {
    PTypeString = postType.split(" ").map((string) => new RegExp(string, "i"));
  } else {
    postType = "";
    PTypeString = postType.split(" ").map((string) => new RegExp(string));
  }

  const major = req.query.major;
  if (major != "null" && major != null) {
    const foundMajor = await MajorModel.findOne({ name: major }); // Add error handling here in case no major is returned.
    let department;
    if (foundMajor) {
      department = foundMajor.department;
    }
    PostModel.find({
      $and: [
        { $or: [{ title: { $in: QString } }, { content: { $in: QString } }] },
        { departments: department },
        { type: { $in: PTypeString } },
      ],
    })
      .populate("owner", "firstName lastName")
      .sort(sortByParam)
      .exec((err, docs) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!docs) {
          const apiError404 = new ApiError404("No documents found");
          next(apiError404);
        } else {
          res.status(200).send(docs);
        }
      });
  } else {
    PostModel.find({
      $and: [
        { $or: [{ title: { $in: QString } }, { content: { $in: QString } }] },
        { type: { $in: PTypeString } },
      ],
    })
      .populate("owner", "lastName")
      .sort(sortByParam)
      .exec((err, docs) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!docs) {
          const apiError404 = new ApiError404("No documents found");
          next(apiError404);
        } else {
          res.status(200).send(docs);
        }
      });
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
  votePost,
};

// Ill keep these here just in case...

// PostModel.find(
//   {
//     $and: [
//       { $or: [{ title: { $in: QString } }, { content: { $in: QString } }] },
//       { departments: department },
//       { type: { $in: PTypeString } },
//     ],
//   },
//   async (err, docs) => {
//     if (err) {
//       const apiError = new ApiError400(err.message);
//       next(apiError);
//     } else if (!docs) {
//       const apiError404 = new ApiError404("No documents found");
//       next(apiError404);
//     } else {
//       await PostModel.populate(docs, {
//         path: "owner",
//         select: { firstName: 1, lastName: 1 },
//       });
//       res.status(200).send(docs);
//     }
//   }
// );

// PostModel.find(
//   {
//     $and: [
//       { $or: [{ title: { $in: QString } }, { content: { $in: QString } }] },
//       { type: { $in: PTypeString } },
//     ],
//   },
//   async (err, docs) => {
//     if (err) {
//       const apiError = new ApiError400(err.message);
//       next(apiError);
//     } else if (!docs) {
//       const apiError404 = new ApiError404("No documents found");
//       next(apiError404);
//     } else {
//       await PostModel.populate(docs, {
//         path: "owner",
//         select: { firstName: 1, lastName: 1, _id: 1 },
//       });
//       res.status(200).send(docs);
//     }
//   }
// );
