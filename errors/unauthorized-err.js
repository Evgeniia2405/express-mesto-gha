const { UNAUTHORIZED_ERROR_CODE } = require('../utils/errorCode');

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
}

module.exports = UnAuthorizedError;
