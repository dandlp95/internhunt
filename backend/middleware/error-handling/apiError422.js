// api404Error.js
const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Api422Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNPROCESSABLE_ENTITY,
    description = "Unprocessable entity.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api422Error;
