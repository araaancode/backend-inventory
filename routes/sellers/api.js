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
  "/products/maingroups",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllMainGroups
);

router.post(
  "/products/maingroups",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.createMainGroup
);

router.get(
  "/products/subgroups",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllSubGroups
);

router.post(
  "/products/subgroups",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.createSubGroup
);

router.get(
  "/products",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllProducts
);

router.get(
  "/products/productgroups",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllProductGroups
);

router.post(
  "/products/productgroups",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.createProductGroup
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

// ************************************************************************
// ******************************* Costs *******************************
// ************************************************************************

router.get(
  "/costs",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllCosts
);

router.get(
  "/costs/:costId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleCost
);

router.post(
  "/costs",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createCost
);

router.put(
  "/costs/:costId/update-cost",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateCost
);

router.put(
  "/costs/:costId/update-cost-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateCostImage
);

router.delete(
  "/costs/:costId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteCost
);

// ************************************************************************
// ******************************* Bank Accounts *******************************
// ************************************************************************

router.get(
  "/bankaccounts",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllBankAccounts
);

router.get(
  "/bankaccounts/:bankaccountId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleBankAccount
);

router.post(
  "/bankaccounts",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createBankAccount
);

router.put(
  "/bankaccounts/:bankaccountId/update-bankaccount",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateBankAccount
);

router.put(
  "/bankaccounts/:bankaccountId/update-bankaccount-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateBankAccountImage
);

router.put(
  "/bankaccounts/:bankaccountId/set-default",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.setDefaultBankAccount
);

router.delete(
  "/bankaccounts/:bankaccountId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteBankAccount
);

// ************************************************************************
// ******************************* Persons(seller,customer) *******************************
// ************************************************************************

router.get(
  "/persons",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllPersons
);

router.get(
  "/persons/:personId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSinglePerson
);

router.post(
  "/persons",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createPerson
);

router.put(
  "/persons/:personId/update-person",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updatePerson
);

router.put(
  "/persons/:personId/update-person-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updatePersonImage
);

router.delete(
  "/persons/:personId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deletePerson
);

// ************************************************************************
// ******************************* Bank Checks *******************************
// ************************************************************************

router.get(
  "/checks/:checkType",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllChecks
);

router.get(
  "/checks/:checkType/:checkId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleCheck
);

router.post(
  "/checks",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createCheck
);

router.put(
  "/checks/:checkType/:checkId/update-check",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateCheck
);

router.put(
  "/checks/:checkType/:checkId/update-check-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateCheckImage
);

router.delete(
  "/checks/:checkType/:checkId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteCheck
);

// ************************************************************************
// ******************************* Funds *******************************
// ************************************************************************

router.get(
  "/funds",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllFinancialFunds
);

router.get(
  "/funds/:fundId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleFinancialFund
);

router.post(
  "/funds",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createFinancialFund
);

router.put(
  "/funds/:fundId/update-fund",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateFinancialFund
);

router.put(
  "/funds/:fundId/update-fund-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateFundImage
);

router.delete(
  "/funds/:fundId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteFund
);

// ************************************************************************
// ******************************* Paychecks *******************************
// ************************************************************************

router.get(
  "/paychecks/:paycheckType",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllPaychecks
);

router.get(
  "/paychecks/:paycheckType/:pcId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSinglePaycheck
);

router.post(
  "/paychecks",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createPaycheck
);

router.put(
  "/paychecks/:paycheckType/:pcId/update-paycheck",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updatePaycheck
);

router.put(
  "/paychecks/:paycheckType/:pcId/update-paycheck-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updatePaycheckImage
);

router.delete(
  "/paychecks/:paycheckType/:pcId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deletePaycheck
);

// ************************************************************************
// ******************************* Financial ******************************
// ************************************************************************

router.get(
  "/financials/:financialType",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllFinancials
);

router.get(
  "/financials/:financialType/:financialId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleFinancial
);

router.post(
  "/financials",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createFinancial
);

router.put(
  "/financials/:financialType/:financialId/update-financial",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateFinancial
);

router.put(
  "/financials/:financialType/:financialId/update-financial-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateFinancialImage
);

router.delete(
  "/financials/:financialType/:financialId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteFinancial
);

// ************************************************************************
// ******************************* Factor ******************************
// ************************************************************************

router.get(
  "/factors/:factorType",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllFactors
);

router.get(
  "/factors/:factorType/:factorId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleFactor
);

router.post(
  "/factors",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createFactor
);

router.put(
  "/factors/:factorType/:factorId/update-factor",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateFactor
);

router.put(
  "/factors/:factorType/:factorId/update-factor-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateFactorImage
);

router.delete(
  "/factors/:factorType/:factorId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteFactor
);

// ************************************************************************
// ******************************* Refund ******************************
// ************************************************************************

router.get(
  "/refunds/:refundType",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllRefunds
);

router.get(
  "/refunds/:refundType/:refundId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleRefund
);

router.post(
  "/refunds",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createRefund
);

router.put(
  "/refunds/:refundType/:refundId/update-factor",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateRefund
);

router.put(
  "/refunds/:refundType/:refundId/update-factor-image",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.updateFactorImage
);

router.delete(
  "/refunds/:refundType/:refundId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteFactor
);

// ************************************************************************
// ******************************* Catalog *********************************
// ************************************************************************

router.get(
  "/catalogs",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllCatalogs
);

router.get(
  "/catalogs/:catalogId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleCatalog
);

router.post(
  "/catalogs",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createCatalog
);

router.put(
  "/catalogs/:catalogId/update-catalog",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateCatalog
);

router.delete(
  "/catalogs/:catalogId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteCatalog
);

// ************************************************************************
// ******************************* Order **********************************
// ************************************************************************

router.get(
  "/orders",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getAllOrders
);

router.get(
  "/orders/:orderId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.getSingleOrder
);

router.post(
  "/orders",
  authenticateUser,
  authorizeRoles("seller"),
  upload.single("image"),
  sellerApiCtrls.createOrder
);

router.put(
  "/orders/:orderId/update-catalog",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.updateOrder
);

router.delete(
  "/orders/:orderId",
  authenticateUser,
  authorizeRoles("seller"),
  sellerApiCtrls.deleteOrder
);

// *******************************************************************************
// ******************************* Subscription **********************************
// *******************************************************************************

router.get(
  "/subscribe/:type",
  authenticateUser,
  authorizeRoles("seller"),
  requestSubscription
);
router.get("/subscribe/verify", verifyPayment);

module.exports = router;
