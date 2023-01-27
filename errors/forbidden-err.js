const { AUTHORIZED_BUT_FORBIDDEN_ERROR_CODE } = require('../utils/errorCode');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZED_BUT_FORBIDDEN_ERROR_CODE;
  }
}

module.exports = ForbiddenError;
