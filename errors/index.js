// errors/index.js
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends CustomAPIError {
  constructor(resource = "Resource") {
    super(`${resource} not found`);
    this.statusCode = 404;
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message = "Authentication required") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends CustomAPIError {
  constructor(message = "Not authorized to access this route") {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
  ForbiddenError,
};
