// routes/customerProductRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductDetails,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require('../../controllers/customers/api');
const { authenticateUser, authorizeRoles } = require('../../middlewares/auth');

// Public product browsing
router.get('/', getAllProducts);
router.get('/:id', getProductDetails);

// Protected customer routes
router.use(authenticateUser);
router.use(authorizeRoles('customer'));

router.post('/:id/favorite', addToFavorites);
router.delete('/:id/favorite', removeFromFavorites);
router.get('/favorites', getFavorites);

module.exports = router;