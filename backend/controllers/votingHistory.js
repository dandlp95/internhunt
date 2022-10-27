const VotingHistory = require("../models/votingHistory");
const ApiError401 = require("../middleware/error-handling/apiError401");
const ApiError400 = require("../middleware/error-handling/apiError400");
const ApiError404 = require("../middleware/error-handling/apiError404");

const getVotingHistoryByIds = (req, res, next) => {
  try {
    if (!req.accountId) {
      throw new ApiError401("Not authorized.");
    }
    VotingHistory.findOne(
      { voter: req.accountId, post: req.params.id },
      (err, doc) => {
        if (err) {
          const apiError = new ApiError400(err.message);
          next(apiError);
        } else if (!doc) {
          res.status(200).send({});
        } else {
          res.status(200).send(doc);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVotingHistoryByIds,
};
