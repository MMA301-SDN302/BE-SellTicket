"use strict";

const {
  ReasonPhrases,
  StatusCodes,
  ErrorCodes,
} = require("../errorConstant/httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status, error_code = ErrorCodes.UNKNOWN_ERROR) {
    super(message);
    this.status = status;
    this.error_code = error_code;
  }
}
// code 400
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    error_code = ErrorCodes.DUPLICATE_ENTRY,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode, error_code);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    error_code,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode, error_code);
  }
}
class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    error_code,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode, error_code);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    error_code,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode, error_code);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    error_code,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode, error_code);
  }
}
class MethodNotAllowedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.METHOD_NOT_ALLOWED,
    error_code,
    statusCode = StatusCodes.METHOD_NOT_ALLOWED
  ) {
    super(message, statusCode, error_code);
  }
}
//code 422
class UnprocessableEntityError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNPROCESSABLE_ENTITY,
    error_code,
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode, error_code);
  }
}

//429
class TooManyRequestsError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.TOO_MANY_REQUESTS,
    error_code,
    statusCode = StatusCodes.TOO_MANY_REQUESTS
  ) {
    super(message, statusCode, error_code);
  }
}
// code 500

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    error_code = ErrorCodes.INTERNAL_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode, error_code);
  }
}
class NotImplemented extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_IMPLEMENTED,
    statusCode = StatusCodes.NOT_IMPLEMENTED
  ) {
    super(message, statusCode);
  }
}
class BadGateway extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_GATEWAY,
    statusCode = StatusCodes.BAD_GATEWAY
  ) {
    super(message, statusCode);
  }
}
class ServiceUnavailable extends ErrorResponse {
  constructor(
    message = ReasonPhrases.SERVICE_UNAVAILABLE,
    statusCode = StatusCodes.SERVICE_UNAVAILABLE
  ) {
    super(message, statusCode);
  }
}
class GatewayTimeout extends ErrorResponse {
  constructor(
    message = ReasonPhrases.GATEWAY_TIMEOUT,
    statusCode = StatusCodes.GATEWAY_TIMEOUT
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  ConflictRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  MethodNotAllowedError,
  InternalServerError,
  NotImplemented,
  BadGateway,
  ServiceUnavailable,
  GatewayTimeout,
  UnprocessableEntityError,
  TooManyRequestsError,
};
