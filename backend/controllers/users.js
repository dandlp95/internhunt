const UserModel = require("../models/user");
const MajorModel = require("../models/major");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const controllers = require("./genericControllers");
const { encryptPassword } = require("../utils/encrypt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = (req, res, next) => {
  // Double checks Ids are sent...
  UserModel.find({}, "firstName lastName", (err, docs) => {
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
  UserModel.findById(req.params.id, "firstName lastName", (err, doc) => {
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

const getAllUsersPrivate = (req, res, next) => {
  // Obviously check for authentication.
  UserModel.find(
    {},
    "firstName lastName email accessLevel suspension warnings",
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
    "firstName lastName email accessLevel suspension warnings",
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
    firstName: req.body.firstName,
    lastName: req.body.lastName,
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

const addUser = async (req, res, next) => {
  try {
    const encryptedPassword = await encryptPassword(req.body.password);
    const major = await MajorModel.findOne({ name: req.body.major });

    if (!major) {
      throw new ApiError400("Invalid major");
    }
    const majorId = major._id;

    const newUser = {
      email: req.body.email,
      password: encryptedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      major: majorId,
    };

    UserModel.create(newUser, (err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!doc) {
        const apiError = new ApiError404(err.message);
        next(apiError);
      } else {
        const token = jwt.sign(
          { email: req.body.email, id: doc._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .send({ token: token, userId: doc._id, major: major.name });
      }
    });
  } catch (err) {
    next(err);
  }
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
  const encryptedPassword = encryptPassword(req.body.password);
  UserModel.findByIdAndUpdate(req.params.id, encryptedPassword, (err, doc) => {
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

const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let accountInfo;

  UserModel.findOne({ email: email })
    .then((account) => {
      if (account.currStatus == "inactive") {
        // If account doc doesn't exist will default to false too.
        const apiError = new ApiError404("Account not found.");
        throw apiError;
      }
      accountInfo = account;
      return bcrypt.compare(password, account.password);
    })
    .then(async (matches) => {
      if (!matches) {
        const apiError = new ApiError404("Wrong password.");
        throw apiError;
      }
      const token = jwt.sign(
        {
          email: accountInfo.email,
          id: accountInfo._id.toString(),
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      const major = await MajorModel.findById(accountInfo.major);
      res.status(200).send({
        token: token,
        userId: accountInfo._id.toString(),
        major: major.name,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const isLoggedIn = async (req, res, next) => {
  try {
    const accountId = req.accountId;
    if (!accountId) {
      throw new ApiError401("Not authenticated.");
    } else {
      const account = await UserModel.findById(accountId);
      if (!account || !account.active) {
        throw new ApiError404("Account not found");
      } else {
        res.status(200).send("authenticated.");
      }
    }
  } catch (err) {
    next(err);
  }
};

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
  getUserByIdPrivate,
  isLoggedIn,
};
