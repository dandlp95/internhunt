const UserModel = require("../models/user");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");

const getAllUsers = (req, res, next) => {
  // Doesnt need to be protected.
  UserModel.find({}, (err, docs) => {
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

const getUserById = (req, res, next) => {
  UserModel.findById(req.params.id, (err, doc) => {
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

const editUser = (req, res, next) => {
  const edits = {
    userName: req.body.userName,
  };

  UserModel.findByIdAndUpdate(edits, (err, doc) => {
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

const deleteUser = (req, res, next) => {
  UserModel.findByIdAndDelete(req.params.id, (err, doc) => {
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

const addUser = (req, res, next) => {
  const newUser = {
    userName: req.body.userName,
    password: req.body.password,
    // Check the default fields are added...
  };

  UserModel.create(newUser, (err, doc) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!doc) {
      const apiError = new ApiError404(err.message);
      next(apiError);
    } else {
      res.status(200).send(!doc);
    }
  });
};

const strikeUser = (req, res, next) => {
  try {
    if (req.params.operation == "add") {
      let strike = 1;
    } else if (req.params.operation == "remove") {
      let strike = 2;
    } else {
      throw new ApiError422("URI query not a valid parameter.");
    }

    UserModel.findById()

  } catch (err) {
    next(err);
  }
};

const suspendUser = (req, res, next) => {};

const editPassword = (req, res, next) => {};

const login = (req, res, next) => {};

module.exports = {
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
  addUser,
  login,
  strikeUser,
  suspendUser,
  editPassword,
};
