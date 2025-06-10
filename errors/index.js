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
  constructor(message = "شما باید ابتدا احراز هویت شوید") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends CustomAPIError {
  constructor(message = "شما حق دسترسی به اینجا را ندارید") {
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
