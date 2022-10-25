const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const ApiError401 = require("../middleware/error-handling/apiError401");

const apiAuthError = new ApiError401();

const getAll = (Schema) => {
  return (req, res, next) => {
    Schema.find({}, (err, docs) => {
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
};

const getById = (Schema) => {
  return (req, res, next) => {
    Schema.findById(req.params.id, (err, doc) => {
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
};

const voteModel = (Schema) => {
  return (req, res, next) => {
    try {
      if (!req.accountId) {
        throw apiAuthError;
      }
      Schema.findByIdAndUpdate(
        req.params.id,
        { rating: req.body.rating },
        { new: true },
        (err, doc) => {
          if (err) {
            throw new ApiError400(err.message);
          } else if (!doc) {
            res.status(200).send("No docs found.");
          } else {
            res.status(200).send(doc);
          }
        }
      );
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  getAll,
  getById,
  voteModel,
};
