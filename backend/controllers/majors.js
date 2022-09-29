const ApiError404 = require("../middleware/error-handling/apiError404");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError422 = require("../middleware/error-handling/apiError422");
const controllers = require("./genericControllers");
const MajorModel = require("../models/major");

const getMajors = controllers.getAll(MajorModel);

const getMajor = controllers.getById(MajorModel);

const addMajor = () => {
  const newMajor = {
    name: req.body.name,
  };

  MajorModel.create(newMajor, (err, doc) => {
    if (err) {
      const apiError400 = new ApiError400();
      next(apiError400);
    } else {
      res.status(200).send(doc);
    }
  });
};

module.exports = {
  getMajors,
  getMajor,
  addMajor,
};
