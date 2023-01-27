const { DATA_NOT_FOUND_ERROR_CODE } = require('../utils/errorCode');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DATA_NOT_FOUND_ERROR_CODE;
  }
}

module.exports = NotFoundError;
