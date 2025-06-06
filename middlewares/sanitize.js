// utils/sanitize.js
const xss = require('xss');
const { body, query, param } = require('express-validator');

// لیست تگ‌ها و attributeهای مجاز برای sanitize
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

// تنظیمات سفارشی برای XSS
const xssOptions = {
  whiteList: ALLOWED_ATTRIBUTES,
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe']
};

/**
 * Middleware برای sanitize کردن تمامی ورودی‌ها
 */
const sanitizeInput = () => [
  // Sanitize body params
  body('*').customSanitizer(value => {
    if (typeof value === 'string') {
      return xss(value, xssOptions);
    }
    return value;
  }),
  
  // Sanitize query params
  query('*').customSanitizer(value => {
    if (typeof value === 'string') {
      return xss(value, xssOptions);
    }
    return value;
  }),
  
  // Sanitize route params
  param('*').customSanitizer(value => {
    if (typeof value === 'string') {
      return xss(value, xssOptions);
    }
    return value;
  })
];

/**
 * Middleware برای escape کردن کاراکترهای خاص
 */
const escapeInput = () => [
  body('*').escape(),
  query('*').escape(),
  param('*').escape()
];

/**
 * Middleware برای trim کردن فضاهای خالی
 */
const trimInput = () => [
  body('*').trim(),
  query('*').trim(),
  param('*').trim()
];

/**
 * Middleware ترکیبی برای تمامی عملیات sanitize
 */
const fullSanitize = () => [
  trimInput(),
  escapeInput(),
  sanitizeInput()
];

/**
 * Sanitize برای محتوای HTML (مثل editorها)
 */
const sanitizeHTML = (html) => {
  return xss(html, {
    ...xssOptions,
    whiteList: {
      ...ALLOWED_ATTRIBUTES,
      iframe: ['src', 'frameborder', 'allowfullscreen'],
      table: ['border', 'cellspacing', 'cellpadding'],
      tr: ['rowspan'],
      td: ['colspan']
    },
    allowList: {
      ...ALLOWED_TAGS,
      'iframe': true,
      'table': true,
      'tr': true,
      'td': true,
      'th': true
    }
  });
};

module.exports = {
  sanitizeInput,
  escapeInput,
  trimInput,
  fullSanitize,
  sanitizeHTML,
  middleware: (req, res, next) => {
    try {
      // Sanitize body
      if (req.body) {
        Object.keys(req.body).forEach(key => {
          if (typeof req.body[key] === 'string') {
            req.body[key] = xss(req.body[key], xssOptions);
          }
        });
      }

      // Sanitize query
      if (req.query) {
        Object.keys(req.query).forEach(key => {
          if (typeof req.query[key] === 'string') {
            req.query[key] = xss(req.query[key], xssOptions);
          }
        });
      }

      // Sanitize params
      if (req.params) {
        Object.keys(req.params).forEach(key => {
          if (typeof req.params[key] === 'string') {
            req.params[key] = xss(req.params[key], xssOptions);
          }
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  }
};