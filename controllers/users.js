const UserModel = require("../models/user");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const controllers = require("./genericControllers");

const getAllUsers = (req, res, next) => {
  // Double checks Ids are sent...
  UserModel.find({}, "userName", (err, docs) => {
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
  UserModel.findById(req.params.id, "userName", (err, doc) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!docs) {
      const apiError = new ApiError404(err.message);
      next(apiError);
    } else {
      res.status(200).send(doc);
    }
  });
};

const getAllUsersPrivate = (req, res, next) => {
  // Obviously check for authentication.
  UserModel.find(
    {},
    "userName email accessLevel suspension warnings",
    (err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!doc) {
        const apiError = new ApiError404(err.message);
        next(apiError);
      } else {
        res.status(200).send(doc);
      }
    }
  );
};

const getUserByIdPrivate = (req, res, next) => {
  // Obviously check for authentication.
  UserModel.findById(
    req.params.id,
    "userName email accessLevel suspension warnings",
    (err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!doc) {
        const apiError = new ApiError404(err.message);
        next(apiError);
      } else {
        res.status(200).send(doc);
      }
    }
  );
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
      res.status(200).send("success");
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
      res.status(200).send("user deleted.");
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

const warnUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      throw new ApiError404("No user found.");
    }

    const warning = {
      warningText: req.body.warningText,
      date: req.body.date,
    };

    user.warnings.push(warning);

    if (user.warnings.length >= 3) {
      const d = new Date();
      d.setDate(d.getDate() + 14);

      const suspension = {
        isSuspended: true,
        expire: d,
      };

      user.suspension = suspension;

      await user.save(); // If doc doesn't exist, mongoose throws doc not found err.

      doc.status(200).send("success");
    }
  } catch (err) {
    next(err);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const user = UserModel.findById(req.params.id);

    const suspension = {
      isSuspended: true,
      expire: req.body.expireDate,
    };

    user.suspension = suspension;

    await user.save();
  } catch (err) {
    next(err);
  }
};

const removeSuspension = async (req, res, next) => {
  try {
    const user = UserModel.findById(req.params.id);

    const suspension = {
      isSuspended: false,
      expire: "",
    };

    user.suspension = suspension;

    await user.save();
  } catch (err) {
    next(err);
  }
};

const editPassword = async (req, res, next) => {
  // This needs to be changed so passed password is encrypted...
  UserModel.findByIdAndUpdate(req.params.id, req.body.password, (err, doc) => {
    if (err) {
      const apiError400 = new ApiError400(err.message);
      next(err);
    } else if (!doc) {
      const apiError404 = new Api404Error("Account not found.");
      next(apiError404);
    } else {
      res.status(200).send("password changed.");
    }
  });
};

const login = (req, res, next) => {};

module.exports = {
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
  addUser,
  login,
  warnUser,
  suspendUser,
  editPassword,
  removeSuspension,
  getAllUsersPrivate,
};
