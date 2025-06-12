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



module.exports = router;
