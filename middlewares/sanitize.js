// utils/sanitize.js
const xss = require('xss');
const { body, query, param } = require('express-validator');

// Allowed tags and attributes
const ALLOWED_ATTRIBUTES = {
  '*': ['class', 'style', 'id'],
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height']
};

const ALLOWED_TAGS = [
  'p', 'b', 'i', 'u', 'em', 'strong', 'br', 
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
  'a', 'img', 'div', 'span', 'blockquote'
];

// xss configuration
const xssOptions = {
  whiteList: ALLOWED_ATTRIBUTES,
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe']
};

// Utility function to apply xss only on strings
const sanitizeValue = (value) =>
  typeof value === 'string' ? xss(value, xssOptions) : value;

// Middleware: sanitize body, query, and params
const sanitizeInput = () => [
  body('*').customSanitizer(sanitizeValue),
  query('*').customSanitizer(sanitizeValue),
  param('*').customSanitizer(sanitizeValue),
];

// Middleware: escape dangerous characters
const escapeInput = () => [
  body('*').escape(),
  query('*').escape(),
  param('*').escape(),
];

// Middleware: trim whitespace
const trimInput = () => [
  body('*').trim(),
  query('*').trim(),
  param('*').trim(),
];

// Combined sanitization middleware
const fullSanitize = () => [
  ...trimInput(),
  ...escapeInput(),
  ...sanitizeInput()
];

// For direct HTML sanitation (e.g., rich text editors)
const sanitizeHTML = (html) =>
  xss(html, {
    ...xssOptions,
    whiteList: {
      ...ALLOWED_ATTRIBUTES,
      iframe: ['src', 'frameborder', 'allowfullscreen'],
      table: ['border', 'cellspacing', 'cellpadding'],
      tr: ['rowspan'],
      td: ['colspan']
    }
  });

// Raw Express middleware (in-place modification)
const middleware = (req, res, next) => {
  try {
    ['body', 'query', 'params'].forEach((key) => {
      if (req[key]) {
        Object.entries(req[key]).forEach(([k, v]) => {
          if (typeof v === 'string') req[key][k] = xss(v, xssOptions);
        });
      }
    });
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sanitizeInput,
  escapeInput,
  trimInput,
  fullSanitize,
  sanitizeHTML,
  middleware,
};
