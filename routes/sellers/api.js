const express = require('express');
const router = express.Router();
const {
  getSellerProducts,
  createProduct,
  getSellerProduct,
  updateSellerProduct,
  deactivateProduct,
  getProductInventory
} = require('../../controllers/sellers/api');
const { authenticateUser, authorizeRoles } = require('../../middlewares/auth');

router.use(authenticateUser);
router.use(authorizeRoles('seller'));

router.route('/')
  .get(getSellerProducts)
  .post(createProduct);

router.route('/:id')
  .get(getSellerProduct)
  .patch(updateSellerProduct)
  .delete(deactivateProduct);

router.get('/:id/inventory', getProductInventory);

module.exports = router;