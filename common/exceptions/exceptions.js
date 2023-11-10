const { logger } = require("../logger");
const messageBinder = require("../../utils/locale/locale-binder").messageBinder();

const HttpErrorCodes = {
  ERROR_404_NOT_FOUND: 404,
  ERROR_400_BAD_REQUEST: 400,
  ERROR_401_UNAUTHORIZED: 401,
  ERROR_403_FORBIDDEN: 403,
  ERROR_409_CONFLICT: 409,
  ERROR_500_SERVER_ERROR: 500
};

const ErrorMessages = {
  ELEMENT_NOT_EXIST: messageBinder.ElementNotExists,
  INVALID_DATA: messageBinder.InvalidData,
};

class ElementNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.httpCode = HttpErrorCodes.ERROR_404_NOT_FOUND;
  }
}

class MissingToken extends Error {
  constructor(message) {
    super(message);
    this.httpCode = HttpErrorCodes.ERROR_401_UNAUTHORIZED;
  }
}

class ElementInvalidException extends Error {
  constructor(message) {
    super(message);
    this.httpCode = HttpErrorCodes.ERROR_400_BAD_REQUEST;
  }
}

class InvalidCredentials extends Error {
  constructor(message) {
    super(message);
    this.httpCode = HttpErrorCodes.ERROR_401_UNAUTHORIZED;
  }
}

class ElementAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.httpCode = HttpErrorCodes.ERROR_409_CONFLICT;
  }
}

class ConflictWithElements extends Error {
  constructor(message) {
    super(message);
    this.httpCode = HttpErrorCodes.ERROR_409_CONFLICT;
  }
}

const evalException = function (err, res) {
  if(process.env.ENVIRONMENT == 'development'){
    logger.debug(err.stack)
  }

  let httpStatus = err.httpCode || HttpErrorCodes.ERROR_500_SERVER_ERROR

  return res.status(httpStatus).send(err.message);
};

module.exports = {
  ElementInvalidException,
  ElementAlreadyExist,
  ElementNotFoundException,
  InvalidCredentials,
  ConflictWithElements,
  HttpErrorCodes,
  ErrorMessages,
  evalException,
  MissingToken,
};
