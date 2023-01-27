const { INCORRECT_DATA_ERROR_CODE } = require('../utils/errorCode');

class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA_ERROR_CODE;
  }
}

module.exports = IncorrectDataError;
