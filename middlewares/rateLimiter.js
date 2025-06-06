const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // Convert minutes to milliseconds
  max: process.env.RATE_LIMIT_MAX,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});

module.exports = limiter;
