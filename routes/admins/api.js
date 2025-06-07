const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus
} = require('../../controllers/admins/api');
const { authenticateUser, authorizeRoles } = require('../../middlewares/auth');

router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.patch('/:id/status', toggleProductStatus);

module.exports = router;