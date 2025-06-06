const csurf = require('csurf');

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict'
  },
  secret: process.env.CSRF_SECRET
});

module.exports = csrfProtection;
