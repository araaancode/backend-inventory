const express = require("express");
const router = express.Router();

// seller controllers
const sellerApiCtrls = require("../../controllers/sellers/api");

// seller middlewares
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");
const upload = require("../../utils/multerConfig");

// ************************************************************************
// ******************************* Products *******************************
// ************************************************************************

router.get(
  "/products",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllProducts
);

router.get(
  "/products/:productId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleProduct
);

router.post(
  "/products",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createProduct
);

router.put(
  "/products/:productId/update-product",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateProduct
);

router.put(
  "/products/:productId/update-product-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateProductImage
);

router.delete(
  "/products/:productId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteProduct
);



// ************************************************************************
// ******************************* Services *******************************
// ************************************************************************

router.get(
  "/services",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllServices
);

router.get(
  "/services/:serviceId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleService
);

router.post(
  "/services",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createService
);

router.put(
  "/services/:serviceId/update-service",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateService
);

router.put(
  "/services/:serviceId/update-service-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateServiceImage
);

router.delete(
  "/services/:serviceId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteService
);

module.exports = router;
