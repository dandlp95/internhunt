const UserModel = require("../models/user");
const MajorModel = require("../models/major");
const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const ApiError403 = require("../middleware/error-handling/apiError403");
const { encryptPassword } = require("../utils/encrypt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authError = new ApiError401("Not authorized.");
const { emailClient } = require("../utils/emailClient");
const mongoose = require("mongoose");

const getAllUsers = (req, res, next) => {
  // Double checks Ids arent sent...
  UserModel.find({}, "firstName lastName", (err, docs) => {
    if (err) {
      const apiError = new ApiError400(err.message);
      next(apiError);
    } else if (!docs) {
      const apiError = new ApiError404("No doc found");
      next(apiError);
    } else {
      res.status(200).send(docs);
    }
  });
};

const getUserById = (req, res, next) => {
  console.log(req.params.id)
  UserModel.findById(
    req.params.id,
    "firstName lastName major",
    async (err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!doc) {
        const apiError = new ApiError404("No doc found");
        next(apiError);
      } else {
        res.status(200).send(await doc.populate("major"));
      }
    }
  );
};

const getAllUsersPrivate = async (req, res, next) => {
  try {
    if (!req.accountId) {
      throw authError;
    }
    const user = await UserModel.findById(req.accountId);
    if (!user || user.accessLevel != 1) {
      throw authError;
    }
    UserModel.find(
      {},
      "firstName lastName email accessLevel suspension warnings",
      (err, doc) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!doc) {
          const apiError = new ApiError404("No doc found");
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

const getUserByIdPrivate = async (req, res, next) => {
  try {
    if (!req.accountId || req.accountId != req.params.id) {
      throw authError;
    }
    const user = await UserModel.findById(req.accountId);
    if (!user && user.accessLevel != 1) {
      throw authError;
    }
    UserModel.findById(
      req.params.id,
      "major firstName lastName email accessLevel suspension warnings",
      async (err, doc) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!doc) {
          const apiError = new ApiError404("No doc found");
          next(apiError);
        } else {
          res.status(200).send(await doc.populate("major"));
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const editUser = (req, res, next) => {
  try {
    if (!req.accountId || req.accountId != req.params.id) {
      throw authError;
    }

    const edits = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    UserModel.findByIdAndUpdate(req.params.id, edits, (err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!doc) {
        const apiError = new ApiError404("No doc found");
        next(apiError);
      } else {
        res.status(200).send("success");
      }
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = (req, res, next) => {
  try {
    if (!req.accountId || req.accountId != req.params.id) {
      throw authError;
    }
    UserModel.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        const apiError = new ApiError400(err.message);
        next(apiError);
      } else if (!doc) {
        const apiError = new ApiError404("No doc found");
        next(apiError);
      } else {
        res.status(200).send("user deleted.");
      }
    });
  } catch (err) {
    next(err);
  }
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
        const apiError = new ApiError404("No doc found");
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
    if (!req.accountId) {
      throw authError;
    }
    const admin = await UserModel.findById(req.accountId);
    if (!admin || admin.accessLevel != 1) {
      throw authError;
    }

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
    if (!req.accountId) {
      throw authError;
    }
    const admin = await UserModel.findById(req.accountId);
    if (!admin || admin.accessLevel != 1) {
      throw authError;
    }

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
    if (!req.accountId) {
      throw authError;
    }
    const admin = await UserModel.findById(req.accountId);
    if (!admin || admin.accessLevel != 1) {
      throw authError;
    }

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
  try {
    if (!req.accountId || req.accountId != req.params.id) {
      console.log("you have no access to request changes to this account...");
      throw authError;
    }
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      throw new ApiError404("No user found.");
    }

    bcrypt.compare(
      req.body.currPassword,
      user.password,
      async (err, result) => {
        if (err) {
          const bcryptError = new ApiError400(err.message);
          next(bcryptError);
        } else {
          if (!result) {
            next(authError);
          } else if (result) {
            const encryptedPassword = await encryptPassword(
              req.body.newPassword
            );

            user.password = encryptedPassword;
            user.save((err) => {
              if (err) {
                next(new ApiError400(err.message));
              } else {
                const returnedUser = {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                };
                res.status(200).send(returnedUser);
              }
            });
          }
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const code = Math.floor(Math.random() * 99999) + 1;
    const user = await UserModel.findOne({ email: req.body.email });
    console.log("req.body.email ", req.body.email);
    console.log("user ", user);
    if (!user) {
      throw new ApiError404("No user associated with this email");
    }
    await user.updateOne({ verificationCode: code });
    const userName = user.firstName;

    const message = `
    ${userName}, use the following link to reset your password: 
    <a href="${process.env.FRONTEND_URI}/reset-password?code=${code}">
    ${process.env.FRONTEND_URI}/reset-password?code=${code}
    </a>`;

    await emailClient("Verification code", message, req.body.email);
    res.status(200).send("Success.");
  } catch (err) {
    next(err);
  }
};

const approvePasswordReset = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      verificationCode: req.body.verificationCode,
    });
    console.log(req.body.verificationCode);
    if (!user) {
      throw new ApiError400("Verification code is not correct");
    }
    user.verificationCode = null;
    const encryptedPassword = await encryptPassword(req.body.password);
    user.password = encryptedPassword;
    user.save();
    res.status(200).send("Success.");
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let accountInfo;

  UserModel.findOne({ email: email })
    .then((account) => {
      if (account.currStatus == "inactive") {
        // If account doc doesn't exist will default to false too.
        throw new ApiError404("Account not found.");
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
      var major = await MajorModel.findById(accountInfo.major);
      if (!major) {
        major = { name: null };
      }
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
    if (!req.accountId) {
      throw new ApiError401("Not authenticated.");
    } else {
      UserModel.findById(
        req.accountId,
        "firstName lastName active email",
        (err, doc) => {
          if (err) {
            next(new ApiError400(err.message));
          } else if (!doc || !doc.active) {
            console.log("doc ", doc);
            next(new ApiError404("Account not found"));
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

const handleGoogleLogin = async (req, res, next) => {
  // This will need more security, maybe decode the jwt here rather than the frontend?
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (user.currStatus == "inactive") {
        throw new ApiError404("Account not found.");
      }
      const token = jwt.sign(
        { email: req.body.email, id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).send({ token: token, userId: user._id, major: null });
    } else {
      const newUser = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: " ",
      };

      UserModel.create(newUser, (err, doc) => {
        if (err || !doc) {
          const apiError400 = new ApiError400(err.message); // if !doc, this will cause a crash
          next(apiError400);
        } else {
          res.status(200).send(doc);
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  isLoggedIn,
  getUserById,
  editUser,
  deleteUser,
  addUser,
  login,
  warnUser,
  suspendUser,
  removeSuspension,
  editPassword,
  getAllUsersPrivate,
  getUserByIdPrivate,
  handleGoogleLogin,
  requestPasswordReset,
  approvePasswordReset,
};
