const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");

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

module.exports = {
  getAll,
  getById
};
