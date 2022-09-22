const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Api401Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNAUTHORIZED,
    description = "Unautharized.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api401Error;
