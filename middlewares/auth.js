// middleware/auth.js
const { UnauthenticatedError, ForbiddenError } = require('../errors');
const jwt = require('jsonwebtoken');

// 1. Authentication Middleware
const authenticateUser = async (req, res, next) => {
  // Check for token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError();
  }


  const token = authHeader.split(' ')[1];


  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication token');
  }
};

// 2. Role Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }
    next();
  };
};

// 3. Ownership Check Middleware (for seller-owned resources)
const checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    const resource = await model.findById(req.params[paramName]);
    
    if (!resource) {
      throw new NotFoundError('Resource');
    }

    // Check if user is owner (assuming resources have 'seller' field)
    if (resource.seller.toString() !== req.user.userId) {
      throw new ForbiddenError();
    }
    
    next();
  };
};

// 3. Block Guests to some of routes 
const blockGuests = (req, res, next) => {
  if (req.user?.isGuest) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: 'failure',
      msg: 'لطفاً برای دسترسی به این بخش ثبت‌نام کامل انجام دهید'
    });
  }
  next();
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  checkOwnership,
  blockGuests
};