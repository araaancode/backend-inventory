const Factor = require("../../models/Factor");
const {
  Product,
  MainGroup,
  SubGroup,
  ProductGroup,
} = require("../../models/Product");
const Person = require("../../models/Person");
const Service = require("../../models/Service");
const Cost = require("../../models/Cost");
const BankAccount = require("../../models/BankAccount");
const FinancialFund = require("../../models/FinancialFund");
const httpStatus = require("http-status-codes");
const BankCheck = require("../../models/BankCheck");
const Paycheck = require("../../models/Paycheck");
const Financial = require("../../models/Financial");
const Refund = require("../../models/Refund");
const Catalog = require("../../models/Catalog");
const Order = require("../../models/Order");
const Subscription = require("../../models/Subscription");
const { ObjectId } = require("mongoose").Types;

const zarinpal = ZarinpalCheckout.create(process.env.ZARINPAL_KEY, true);

// Prices in Toman
const PLAN_DETAILS = {
  golden: { amount: 500000, storageLimit: 1000 }, // 500,000 Toman
  silver: { amount: 200000, storageLimit: 500 }, // 200,000 Toman
};

// *********************************************************************************
// ************************************ Products ***********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all main groups -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products/maingroups
exports.getAllMainGroups = async (req, res) => {
  try {
    const mainGroups = await MainGroup.find({ seller: req.user.id });

    if (mainGroups) {
      return res.status(httpStatus.OK).json({
        msg: "گروه اصلی های اصلی پیدا شدند",
        status: "success",
        count: mainGroups.length,
        mainGroups,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "گروه اصلی پیدا نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create main group -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/products/maingroups
exports.createMainGroup = async (req, res) => {
  try {
    const mainGroup = await MainGroup.create({
      seller: req.user.id,
      name: req.body.name,
      createdAt: req.body.createdAt,
    });

    if (mainGroup) {
      return res.status(httpStatus.CREATED).json({
        msg: "گروه اصلی ایجاد شد",
        status: "success",
        mainGroup,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "گروه اصلی ایجاد نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get all sub groups -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products/subgroups
exports.getAllSubGroups = async (req, res) => {
  try {
    const subGroups = await SubGroup.find({ seller: req.user.id }).populate(
      "mainGroup"
    );

    if (subGroups) {
      return res.status(httpStatus.CREATED).json({
        msg: "گروه های فرعی پیدا شدند",
        status: "success",
        count: subGroups.length,
        subGroups,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "گروه فرعی پیدا نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create sub group -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/products/subgroups
exports.createSubGroup = async (req, res) => {
  try {
    const subGroup = await SubGroup.create({
      seller: req.user.id,
      name: req.body.name,
      mainGroup: req.body.mainGroup,
      createdAt: req.body.createdAt,
    });

    if (subGroup) {
      return res.status(httpStatus.CREATED).json({
        msg: "گروه فرعی ایجاد شد",
        status: "success",
        subGroup,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "گروه فرعی ایجاد نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get all product groups -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products/productgroups
exports.getAllProductGroups = async (req, res) => {
  try {
    const productGroups = await ProductGroup.find({
      seller: req.user.id,
    }).populate("mainGroup subGroup");

    if (productGroups) {
      return res.status(httpStatus.OK).json({
        msg: "گروه های کالایی پیدا شدند",
        status: "success",
        count: productGroups.length,
        productGroups,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "گروه کالایی پیدا نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create product group -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/products/productgroups
exports.createProductGroup = async (req, res) => {
  try {
    const productGroup = await ProductGroup.create({
      seller: req.user.id,
      name: req.body.name,
      mainGroup: req.body.mainGroup,
      subGroup: req.body.subGroup,
      hashtag: req.body.hashtag,
    });

    if (productGroup) {
      return res.status(httpStatus.CREATED).json({
        msg: "گروه کالایی ایجاد شد",
        status: "success",
        productGroup,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "گروه کالایی ایجاد نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get all products -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).populate(
      "seller"
    );

    if (products && products.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام محصولات شما پیدا شدند",
        status: "success",
        count: products.length,
        products,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "محصولی پیدا نشد. دوباره امتحان کنید",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single product -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products/:productId
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      seller: req.user.id,
      _id: req.params.productId,
    }).populate("seller");

    if (product) {
      return res.status(httpStatus.OK).json({
        msg: " محصول شما پیدا شد",
        status: "success",
        product,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "محصولی پیدا نشد. دوباره امتحان کنید",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create product -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/products
exports.createProduct = async (req, res) => {
  const { title, productCode, countingUnit, unitTypes } = req.body;

  try {
    if (!title || !productCode || !countingUnit || !unitTypes) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد محصول باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const productPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    // create product if it has Main Unit
    if (unitTypes === "mainUnit") {
      let moreInfoObj = {
        additionalInformation: req.body.additionalInformation,
        factorDescription: req.body.factorDescription,
        barcode: req.body.barcode,
        minExpireWarningDays: req.body.minExpireWarningDays,
        minStock: req.body.minStock,
        vatPercent: req.body.vatPercent,
        weight: req.body.weight,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
      };

      console.log(new ObjectId(req.user.id));

      let newProduct = await Product.create({
        seller: new ObjectId(req.user.id),
        image: productPath || "default.jpg",
        title: req.body.title,
        productCode: req.body.productCode,
        productGroup: new ObjectId(req.body.productGroup),
        countingUnit: req.body.countingUnit,
        unitTypes: req.body.unitTypes,
        initialInventory: req.body.initialInventory,
        purchasePrice: req.body.purchasePrice,
        sellingPrice: req.body.sellingPrice,
        secondSellingPrice: req.body.secondSellingPrice,
        moreInfo: moreInfoObj,
      });

      if (newProduct) {
        return res.status(httpStatus.CREATED).json({
          msg: " کالا ایجاد شد",
          status: "success",
          newProduct,
        });
      } else {
        return res.status(httpStatus.NOT_FOUND).json({
          msg: " کالا ایجاد نشد. دوباره امتحان کنید",
          status: "failure",
        });
      }
    }

    // create product if it has Secondary Unit
    if (unitTypes === "secondaryUnit") {
      let secondaryUnitObj = {
        countingUnit: req.body.countingUnit,
        subunitRatio: req.body.subunitRatio,
        initialInventoryMainUnit: req.body.initialInventoryMainUnit,
        initialInventorySubUnit: req.body.initialInventorySubUnit,
        purchasePriceMainUnit: req.body.purchasePriceMainUnit,
        purchasePriceSubUnit: req.body.purchasePriceSubUnit,
        sellingPriceMainUnit: req.body.sellingPriceMainUnit,
        sellingPriceSubUnit: req.body.sellingPriceSubUnit,
        secondSellingPriceMainUnit: req.body.secondSellingPriceMainUnit,
        secondSellingPriceSubUnit: req.body.secondSellingPriceSubUnit,
      };

      let moreInfoObj = {
        additionalInformation: req.body.additionalInformation,
        factorDescription: req.body.factorDescription,
        barcode: req.body.barcode,
        minExpireWarningDays: req.body.minExpireWarningDays,
        minStock: req.body.minStock,
        vatPercent: req.body.vatPercent,
        minStock: req.body.minStock,
        weight: req.body.weight,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
      };

      let newProduct = await Product.create({
        seller: req.user.id,
        image: productPath || "default.jpg",
        title: req.body.title,
        productCode: req.body.productCode,
        productGroup: new ObjectId(req.body.productGroup),
        countingUnit: req.body.countingUnit,
        unitTypes: req.body.unitTypes,
        secondaryUnit: secondaryUnitObj,
        moreInfo: moreInfoObj,
      });

      if (newProduct) {
        return res.status(httpStatus.CREATED).json({
          msg: " کالا ایجاد شد",
          status: "success",
          newProduct,
        });
      } else {
        return res.status(httpStatus.NOT_FOUND).json({
          msg: " کالا ایجاد نشد. دوباره امتحان کنید",
          status: "failure",
        });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).json({
        msg: "نوع واحد نامعتبر است",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update product -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/products/:productId/update-product
exports.updateProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.productId,
      {
        seller: req.user.id,
        title: req.body.title,
        productCode: req.body.productCode,
        productGroup: {
          mainGroup: req.body.mainGroup,
          subGroup: req.body.subGroup,
          hashtag: req.body.hashtag,
        },
        countingUnit: req.body.countingUnit,
        secondaryUnit: {
          secondaryUnitCountingUnit: req.body.secondaryUnitCountingUnit,
          subunitRatio: req.body.subunitRatio,
          openingInventoryMainUnit: req.body.openingInventoryMainUnit,
          openingInventorySubUnit: req.body.openingInventorySubUnit,
          purchasePriceMainUnit: req.body.purchasePriceMainUnit,
          purchasePriceSubUnit: req.body.purchasePriceSubUnit,
          sellingPriceMainUnit: req.body.sellingPriceMainUnit,
          sellingPriceSubUnit: req.body.sellingPriceSubUnit,
          secondSellingMainUnit: req.body.secondSellingMainUnit,
          secondSellingSubUnit: req.body.secondSellingSubUnit,
        },
        moreInfo: {
          additionalInformation: req.body.additionalInformation,
          factorDescription: req.body.factorDescription,
          barcode: req.body.barcode,
          minExpireWarningDays: req.body.minExpireWarningDays,
          minStock: req.body.minStock,
          vatPercent: req.body.vatPercent,
          weight: req.body.weight,
          length: req.body.length,
          width: req.body.width,
          height: req.body.height,
        },
      },
      { new: true }
    );

    res.status(httpStatus.OK).json({
      msg: "محصول شما ویرایش شد",
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update product image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/products/:productId/update-product-image
exports.updateProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "لطفاً یک تصویر ارسال کنید",
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.productId, seller: req.user.id },
      { image: req.file.path },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "failure",
        msg: "محصولی با این شناسه یافت نشد",
      });
    }

    res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر محصول با موفقیت ویرایش شد",
      product: updatedProduct,
    });
  } catch (err) {
    console.log(err);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete product -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/products/:productId
exports.deleteProduct = async (req, res) => {
  try {
    let findProduct = await Product.findOne({ _id: req.params.productId });

    if (findProduct) {
      await Product.findByIdAndDelete(req.params.productId);

      return res.status(httpStatus.OK).json({
        msg: "محصول شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// *********************************************************************************
// ************************************ Services ***********************************
// *********************************************************************************
// # description -> HTTP VERB -> Accesss
// # get all services -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ seller: req.user.id }).populate(
      "seller"
    );

    if (services && services.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام خدمات شما پیدا شدند",
        status: "success",
        count: services.length,
        services,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز خدمتی اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single service -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/services/:serviceId
exports.getSingleService = async (req, res) => {
  try {
    const service = await Service.findOne({
      seller: req.user.id,
      _id: req.params.serviceId,
    }).populate("seller");

    if (service) {
      return res.status(httpStatus.OK).json({
        msg: "خدمت شما پیدا شد",
        status: "success",
        service,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "خدمت پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create service -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/services
exports.createService = async (req, res) => {
  const {
    serviceName,
    countingRatio,
    totalCost,
    price,
    moreInfo,
    factorDescription,
    vatPercent,
  } = req.body;

  try {
    if (
      !serviceName ||
      !countingRatio ||
      !totalCost ||
      !price ||
      !moreInfo ||
      !factorDescription ||
      !vatPercent
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد خدمت باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const servicePath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let newService = await Service.create({
      image: servicePath || "default.jpg",
      seller: req.user.id,
      serviceName: req.body.serviceName,
      countingRatio: req.body.countingRatio,
      totalCost: req.body.totalCost,
      price: req.body.price,
      moreInfo: req.body.moreInfo,
      factorDescription: req.body.factorDescription,
      vatPercent: req.body.vatPercent,
    });

    if (newService) {
      return res.status(httpStatus.OK).json({
        msg: "خدمت شما ایجاد شد",
        status: "success",
        service: newService,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "خدمت ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update service -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/services/:serviceId/update-service
exports.updateService = async (req, res) => {
  try {
    let updatedService = await Service.findByIdAndUpdate(
      req.params.serviceId,
      {
        serviceName: req.body.serviceName,
        countingRatio: req.body.countingRatio,
        totalCost: req.body.totalCost,
        price: req.body.price,
        moreInfo: req.body.moreInfo,
        factorDescription: req.body.factorDescription,
        vatPercent: req.body.vatPercent,
      },
      { new: true }
    );

    if (updatedService) {
      return res.status(httpStatus.OK).json({
        msg: "خدمت شما ویرایش شد",
        status: "success",
        service: updatedService,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "خدمت ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update service image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/services/:serviceId/update-service-image
exports.updateServiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "لطفاً یک تصویر ارسال کنید",
      });
    }

    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, seller: req.user.id },
      { image: req.file.path },
      { new: true }
    );

    if (!updatedService) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "failure",
        msg: "سرویسی با این شناسه یافت نشد",
      });
    }

    if (updatedService) {
      return;
      res.status(httpStatus.OK).json({
        status: "success",
        msg: "تصویر سرویس با موفقیت ویرایش شد",
        service: updatedService,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "خدمت ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete service -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/services/:serviceId
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.serviceId);

    res.status(httpStatus.OK).json({
      msg: "سرویس شما پاک شد",
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // *********************************************************************************
// ************************************ Costs ***********************************
// *********************************************************************************
// # description -> HTTP VERB -> Accesss
// # get all costs -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/costs
exports.getAllCosts = async (req, res) => {
  try {
    const costs = await Cost.find({ seller: req.user.id }).populate("seller");

    if (costs && costs.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام هزینه های شما پیدا شدند",
        status: "success",
        count: costs.length,
        costs,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز هزینه ای اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single cost -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/costs/:costId
exports.getSingleCost = async (req, res) => {
  try {
    const cost = await Cost.findOne({
      seller: req.user.id,
      _id: req.params.costId,
    }).populate("seller");

    if (cost) {
      return res.status(httpStatus.OK).json({
        msg: "هزینه شما پیدا شد",
        status: "success",
        cost,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هزینه پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create Cost -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/costs
exports.createCost = async (req, res) => {
  const { costTitle, countingRatio, price, moreInfo, factorDescription } =
    req.body;

  try {
    if (
      !costTitle ||
      !countingRatio ||
      !price ||
      !moreInfo ||
      !factorDescription
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد هزینه باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const costPath = req.file ? req.file.path.replace("public", "") : undefined;

    let newService = await Cost.create({
      image: costPath || "default.jpg",
      seller: req.user.id,
      costTitle,
      countingRatio,
      price,
      moreInfo,
      factorDescription,
    });

    if (newService) {
      return res.status(httpStatus.OK).json({
        msg: "هزینه شما ایجاد شد",
        status: "success",
        service: newService,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "هزینه ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update cost -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/costs/:costId/update-cost
exports.updateCost = async (req, res) => {
  try {
    let updatedCost = await Cost.findByIdAndUpdate(
      req.params.costId,
      {
        costTitle: req.body.costTitle,
        countingRatio: req.body.countingRatio,
        price: req.body.price,
        moreInfo: req.body.moreInfo,
        factorDescription: req.body.factorDescription,
      },
      { new: true }
    );

    if (updatedCost) {
      return res.status(httpStatus.OK).json({
        msg: "هزینه شما ویرایش شد",
        status: "success",
        cost: updatedCost,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "هزینه ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update cost image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/costs/:costId/update-cost-image
exports.updateCostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "لطفاً یک تصویر ارسال کنید",
      });
    }

    const updatedCost = await Cost.findOneAndUpdate(
      { _id: req.params.costId, seller: req.user.id },
      { image: req.file.path },
      { new: true }
    );

    if (!updatedCost) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "failure",
        msg: "هزینه با این شناسه یافت نشد",
      });
    }

    if (updatedCost) {
      return;
      res.status(httpStatus.OK).json({
        status: "success",
        msg: "تصویر هزینه با موفقیت ویرایش شد",
        cost: updatedCost,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "خدمت ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete cost -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/costs/:costId
exports.deleteCost = async (req, res) => {
  try {
    let findCost = await Cost.findOne({ _id: req.params.costId });

    if (findCost) {
      await Cost.findByIdAndDelete(req.params.costId);

      return res.status(httpStatus.OK).json({
        msg: "هزینه شما پاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Bank Account *******************************
// *********************************************************************************
// Utility functions for bank validation
const validateBankCard = (cardNumber) => {
  return /^[0-9]{16}$/.test(cardNumber);
};

const validateIBAN = (iban) => {
  return /^IR[0-9]{24}$/.test(iban);
};

// Get all bank accounts for seller
exports.getAllBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({ seller: req.user.id })
      .populate("seller")
      .sort("-createdAt");

    if (bankAccounts && bankAccounts.length > 0) {
      return res.status(httpStatus.OK).json({
        status: "success",
        msg: "حساب های شما پیدا شدند",
        count: bankAccounts.length,
        bankAccounts,
      });
    } else {
      return res.status(httpStatus.OK).json({
        status: "success",
        msg: "هنوز حساب بانکی ایجاد نکرده اید",
      });
    }
  } catch (error) {
    console.error("Error getting bank accounts:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در دریافت حساب های بانکی",
    });
  }
};

// Get single bank account
exports.getSingleBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOne({
      _id: req.params.bankaccountId,
      seller: req.user.id,
    }).populate("seller", "name email phone");

    if (!bankAccount) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "fail",
        msg: "حساب بانکی با این شناسه یافت نشد",
      });
    }

    res.status(httpStatus.OK).json({
      status: "success",
      bankAccount,
    });
  } catch (error) {
    console.error("Error getting bank account:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در دریافت حساب بانکی",
    });
  }
};

// Create new bank account
exports.createBankAccount = async (req, res) => {
  try {
    const {
      holderFullName,
      accountNumber,
      cardNumber,
      iban,
      bankName,
      bankBranch,
      balance = 0,
      moreInfo = "",
    } = req.body;

    // Validate required fields
    if (
      !holderFullName ||
      !accountNumber ||
      !cardNumber ||
      !iban ||
      !bankName ||
      !bankBranch
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "لطفاً تمام فیلدهای ضروری را پر کنید",
      });
    }

    // Validate card number format
    if (!validateBankCard(cardNumber)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "شماره کارت بانکی معتبر نیست (باید 16 رقم باشد)",
      });
    }

    // Validate IBAN format
    if (!validateIBAN(iban)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "شماره شبا معتبر نیست (باید با IR شروع شود و 26 رقم باشد)",
      });
    }

    // Check for duplicate account number (for this user)
    const existingAccount = await BankAccount.findOne({
      seller: req.user.id,
      accountNumber,
    });

    if (existingAccount) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "شما قبلاً حسابی با این شماره حساب ثبت کرده‌اید",
      });
    }

    // Check for duplicate IBAN (system-wide)
    const existingIBAN = await BankAccount.findOne({ iban });
    if (existingIBAN) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "این شماره شبا قبلاً در سیستم ثبت شده است",
      });
    }

    // Check for duplicate card number (system-wide)
    const existingCard = await BankAccount.findOne({ cardNumber });
    if (existingCard) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "این شماره کارت قبلاً در سیستم ثبت شده است",
      });
    }

    const bankAccountPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    // Create the bank account
    const newBankAccount = await BankAccount.create({
      seller: req.user.id,
      image: bankAccountPath || "default.jpg",
      holderFullName,
      accountNumber,
      cardNumber,
      iban,
      bankName,
      bankBranch,
      balance,
      moreInfo,
    });

    res.status(httpStatus.CREATED).json({
      status: "success",
      msg: "حساب بانکی جدید با موفقیت ایجاد شد",
      bankAccount: newBankAccount,
    });
  } catch (error) {
    console.error("Error creating bank account:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در ایجاد حساب بانکی",
    });
  }
};

// Update bank account
exports.updateBankAccount = async (req, res) => {
  try {
    const {
      holderFullName,
      accountNumber,
      cardNumber,
      iban,
      bankName,
      bankBranch,
      balance,
      moreInfo,
    } = req.body;

    // Find the bank account
    const bankAccount = await BankAccount.findOne({
      _id: req.params.bankaccountId,
      seller: req.user.id,
    });

    if (!bankAccount) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "fail",
        msg: "حساب بانکی با این شناسه یافت نشد",
      });
    }

    // Prevent changing account number if provided
    if (accountNumber && accountNumber !== bankAccount.accountNumber) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "تغییر شماره حساب مجاز نیست",
      });
    }

    // Validate card number format if provided
    if (cardNumber && !validateBankCard(cardNumber)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "شماره کارت بانکی معتبر نیست (باید 16 رقم باشد)",
      });
    }

    // Validate IBAN format if provided
    if (iban && !validateIBAN(iban)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "شماره شبا معتبر نیست (باید با IR شروع شود و 26 رقم باشد)",
      });
    }

    // Update the bank account
    const updatedBankAccount = await BankAccount.findByIdAndUpdate(
      req.params.bankaccountId,
      {
        holderFullName: holderFullName || bankAccount.holderFullName,
        cardNumber: cardNumber || bankAccount.cardNumber,
        iban: iban || bankAccount.iban,
        bankName: bankName || bankAccount.bankName,
        bankBranch: bankBranch || bankAccount.bankBranch,
        balance: balance !== undefined ? balance : bankAccount.balance,
        moreInfo: moreInfo || bankAccount.moreInfo,
      },
      { new: true, runValidators: true }
    );

    if (updatedBankAccount) {
      return res.status(httpStatus.OK).json({
        status: "success",
        msg: "حساب بانکی با موفقیت به‌روزرسانی شد",
        bankAccount: updatedBankAccount,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "حساب بانکی به روزآوری نشد. مشکلی وجود دارد",
      });
    }
  } catch (error) {
    console.error("Error updating bank account:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در به‌روزرسانی حساب بانکی",
    });
  }
};

// @desc    Update bank account image
// @route   PATCH /api/sellers/bankaccounts/:id/image
// @access  Private/Seller
exports.updateBankAccountImage = async (req, res) => {
  try {
    // 1) Check if image file was uploaded
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "لطفاً یک تصویر برای حساب بانکی انتخاب کنید",
      });
    }

    // 2) Verify the image file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "فرمت تصویر مجاز نیست (فقط JPEG, PNG یا WebP مجاز هستند)",
      });
    }

    // 3) Verify image size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (req.file.size > maxSize) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد",
      });
    }

    // 4) Find and verify the bank account belongs to the seller
    const bankAccount = await BankAccount.findOne({
      _id: req.params.bankaccountId,
      seller: req.user.id,
    });

    if (!bankAccount) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "fail",
        msg: "حساب بانکی با این شناسه یافت نشد",
      });
    }

    // 5) Process the image path (remove 'public' from the path)
    const imagePath = req.file.path.replace(/\\/g, "/").replace("public", "");

    // 6) Update the bank account image
    const updatedBankAccount = await BankAccount.findByIdAndUpdate(
      req.params.bankaccountId,
      { image: imagePath },
      { new: true, runValidators: true }
    );

    if (updatedBankAccount) {
      // 7) Return success response
      return res.status(httpStatus.OK).json({
        status: "success",
        msg: "تصویر حساب بانکی با موفقیت به‌روزرسانی شد",
        bankAccount: updatedBankAccount,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "تصویر حساب بانکی به‌روزرسانی نشد",
      });
    }
  } catch (error) {
    console.error("Error updating bank account image:", error);

    // Handle specific errors
    if (error.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "fail",
        msg: "شناسه حساب بانکی نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در به‌روزرسانی تصویر حساب بانکی",
    });
  }
};

// Delete bank account
exports.deleteBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOneAndDelete({
      _id: req.params.bankaccountId,
      seller: req.user.id,
    });

    if (!bankAccount) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "fail",
        msg: "حساب بانکی با این شناسه یافت نشد",
      });
    }

    res.status(httpStatus.OK).json({
      status: "success",
      msg: "حساب بانکی با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در حذف حساب بانکی",
    });
  }
};

// Set default bank account
exports.setDefaultBankAccount = async (req, res) => {
  try {
    // First, unset any existing default account
    await BankAccount.updateMany(
      { seller: req.user.id, isDefault: true },
      { $set: { isDefault: false } }
    );

    // Then set the new default account
    const defaultAccount = await BankAccount.findOneAndUpdate(
      { _id: req.params.bankaccountId, seller: req.user.id },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!defaultAccount) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "fail",
        msg: "حساب بانکی با این شناسه یافت نشد",
      });
    }

    res.status(httpStatus.OK).json({
      status: "success",
      msg: "حساب بانکی پیش‌فرض با موفقیت تنظیم شد",
      data: {
        bankAccount: defaultAccount,
      },
    });
  } catch (error) {
    console.error("Error setting default bank account:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای سرور در تنظیم حساب پیش‌فرض",
    });
  }
};

// // ******************************************************************************
// ************************************ Persons(seller,customer) *******************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all persons -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/persons
exports.getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find({ seller: req.user.id }).populate(
      "seller"
    );

    if (persons && persons.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام اشخاص شما پیدا شدند",
        status: "success",
        count: persons.length,
        persons,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز اشخاص اضافه نشده اند",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single person -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/persons/:personId
exports.getSinglePerson = async (req, res) => {
  try {
    const person = await Person.findOne({
      seller: req.user.id,
      _id: req.params.personId,
    }).populate("seller");

    if (person) {
      return res.status(httpStatus.OK).json({
        msg: "شخص شما پیدا شد",
        status: "success",
        person,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "شخص پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create  -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/persons
exports.createPerson = async (req, res) => {
  const {
    personName,
    personGroups,
    previousFinancialAccount,
    phone,
    moreInfo,
    postalCode,
    birthDate,
    nationalCode,
    economicCode,
    lat,
    lng,
  } = req.body;

  try {
    if (
      !personName ||
      !personGroups ||
      !previousFinancialAccount ||
      !phone ||
      !moreInfo ||
      !postalCode ||
      !birthDate ||
      !nationalCode ||
      !economicCode ||
      !lat ||
      !lng
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد شخص باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const personPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let positin = { type: { lat, lng } };

    let newPerson = await Person.create({
      image: personPath || "default.jpg",
      seller: req.user.id,
      personName,
      personGroups,
      previousFinancialAccount,
      moreInfo,
      postalCode,
      birthDate,
      nationalCode,
      economicCode,
      positin,
      phone,
    });

    if (newPerson) {
      return res.status(httpStatus.OK).json({
        msg: "شخص شما ایجاد شد",
        status: "success",
        person: newPerson,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "شخص ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update person -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/persons/:personId/update-person
exports.updatePerson = async (req, res) => {
  try {
    const {
      personName,
      personGroups,
      previousFinancialAccount,
      phone,
      moreInfo,
      postalCode,
      birthDate,
      nationalCode,
      economicCode,
      lat,
      lng,
    } = req.body;

    // Validate and sanitize the financial account value
    let sanitizedFinancialAccount = previousFinancialAccount;
    if (previousFinancialAccount !== undefined) {
      sanitizedFinancialAccount = Number(previousFinancialAccount);
      if (isNaN(sanitizedFinancialAccount)) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "error",
          msg: "مقدار حساب مالی قبلی نامعتبر است",
        });
      }
    }

    // Handle position data
    let position = null;
    if (lat !== undefined && lng !== undefined) {
      position = {
        lat: Number(lat),
        lng: Number(lng),
      };

      // Validate coordinates
      if (isNaN(position.lat) || isNaN(position.lng)) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "error",
          msg: "مقادیر مختصات جغرافیایی نامعتبر است",
        });
      }
    }

    const updateData = {
      personName,
      personGroups,
      moreInfo,
      postalCode,
      birthDate,
      nationalCode,
      economicCode,
      phone, // Added phone which was missing in original update
    };

    // Only add fields that were actually provided
    if (previousFinancialAccount !== undefined) {
      updateData.previousFinancialAccount = sanitizedFinancialAccount;
    }

    if (position) {
      updateData.position = position;
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.personId,
      updateData,
      {
        new: true,
        runValidators: true, // Ensure validators run on update
      }
    );

    if (!updatedPerson) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "شخص مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات شخص با موفقیت ویرایش شد",
      status: "success",
      person: updatedPerson,
    });
  } catch (err) {
    console.error("Update person error:", err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه شخص نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "داده‌های ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update person image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/persons/:personId/update-person-image
exports.updatePersonImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update person image (only if they belong to the requesting seller)
    const updatedPerson = await Person.findOneAndUpdate(
      {
        _id: req.params.personId,
        seller: req.user.id, // Ensure person belongs to the seller making the request
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPerson) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "شخص مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر پروفایل با موفقیت به‌روزرسانی شد",
      image: updatedPerson.image,
    });
  } catch (err) {
    console.error("Update person image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه شخص نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete person -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/persons/:personId
exports.deletePerson = async (req, res) => {
  try {
    let findperson = await Person.findOne({ _id: req.params.personId });

    if (findperson) {
      await Person.findByIdAndDelete(req.params.personId);

      return res.status(httpStatus.OK).json({
        msg: "شخص شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Bank Checks ********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all checks -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/checks/:checkType
exports.getAllChecks = async (req, res) => {
  try {
    const checks = await BankCheck.find({
      seller: req.user.id,
      checkType: req.params.checkType,
    }).populate("seller");

    if (checks && checks.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام چک های شما پیدا شدند",
        status: "success",
        count: checks.length,
        checks,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز چکی اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single check -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/checks/:checkType/:checkId
exports.getSingleCheck = async (req, res) => {
  try {
    const check = await BankCheck.findOne({
      seller: req.user.id,
      _id: req.params.checkId,
      checkType: req.params.checkType,
    }).populate("seller");

    if (check) {
      return res.status(httpStatus.OK).json({
        msg: "چک بانکی شماپیدا شد",
        status: "success",
        check,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "چک پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create check -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/checks
exports.createCheck = async (req, res) => {
  const {
    payer,
    recipient,
    checkPrice,
    dueDate,
    receivingCheckDate,
    bank,
    bankCheckNumber,
    moreInfo,
    endorsementCheck,
    endorsementCheckDate,
    checkType,
  } = req.body;

  try {
    if (
      !payer ||
      !recipient ||
      !checkPrice ||
      !dueDate ||
      !receivingCheckDate ||
      !bank ||
      !bankCheckNumber ||
      !moreInfo ||
      !endorsementCheck ||
      !endorsementCheckDate ||
      !checkType
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد چک باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const checkBankPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let newBankCheck = await BankCheck.create({
      image: checkBankPath || "default.jpg",
      seller: req.user.id,
      payer,
      recipient,
      checkPrice,
      dueDate,
      receivingCheckDate,
      bank,
      bankCheckNumber,
      moreInfo,
      endorsementCheck,
      endorsementCheckDate,
      checkType,
    });

    if (newBankCheck) {
      return res.status(httpStatus.OK).json({
        msg: "چک شما ایجاد شد",
        status: "success",
        check: newBankCheck,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "چک ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update check -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/checks/:checkId/update-check
exports.updateCheck = async (req, res) => {
  try {
    const {
      payer,
      recipient,
      checkPrice,
      dueDate,
      receivingCheckDate,
      bank,
      bankCheckNumber,
      moreInfo,
      endorsementCheck,
      endorsementCheckDate,
      checkType,
    } = req.body;

    const updateData = {
      payer,
      recipient,
      checkPrice,
      dueDate,
      receivingCheckDate,
      bank,
      bankCheckNumber,
      moreInfo,
      endorsementCheck,
      endorsementCheckDate,
      checkType,
    };

    const updatedBankCheck = await BankCheck.findByIdAndUpdate(
      req.params.checkId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBankCheck) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "چک مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات چک با موفقیت ویرایش شد",
      status: "success",
      person: updatedBankCheck,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه چک نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "داده‌های ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update check image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/checks/:checkId/update-check-image
exports.updateCheckImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update Bank Check image (only if they belong to the requesting seller)
    const updatedBankCheck = await BankCheck.findOneAndUpdate(
      {
        _id: req.params.checkId,
        seller: req.user.id, // Ensure Bank Check belongs to the seller making the request
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBankCheck) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "چک مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر پروفایل با موفقیت به‌روزرسانی شد",
      image: updatedBankCheck.image,
    });
  } catch (err) {
    console.error("Update Bank Check image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه چک نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete check -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/checks/:checkId
exports.deleteCheck = async (req, res) => {
  try {
    let findBankCheck = await BankCheck.findOne({
      _id: req.params.checkId,
    });

    if (findBankCheck) {
      await BankCheck.findByIdAndDelete(req.params.checkId);

      return res.status(httpStatus.OK).json({
        msg: "چک شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Financial Fund ********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all financial funds -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/funds
exports.getAllFinancialFunds = async (req, res) => {
  try {
    const funds = await FinancialFund.find({
      seller: req.user.id,
    }).populate("seller");

    if (funds && funds.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام صندوق های شما پیدا شدند",
        status: "success",
        count: funds.length,
        funds,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز صندوقی اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single financial fund -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/funds/:fundId
exports.getSingleFinancialFund = async (req, res) => {
  try {
    const fund = await FinancialFund.findOne({
      seller: req.user.id,
      _id: req.params.fundId,
    }).populate("seller");

    if (fund) {
      return res.status(httpStatus.OK).json({
        msg: "صندوق بانکی شماپیدا شد",
        status: "success",
        fund,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "صندوق پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create financial fund -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/funds
exports.createFinancialFund = async (req, res) => {
  const { fundName, initialStock, moreInfo } = req.body;

  try {
    if (!fundName || !initialStock || !moreInfo) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد صندوق باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const fundPath = req.file ? req.file.path.replace("public", "") : undefined;

    let newFinancialFund = await FinancialFund.create({
      image: fundPath || "default.jpg",
      seller: req.user.id,
      fundName,
      initialStock,
      moreInfo,
    });

    if (newFinancialFund) {
      return res.status(httpStatus.OK).json({
        msg: "صندوق شماایجاد شد",
        status: "success",
        fund: newFinancialFund,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "صندوق ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update financial fund -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/funds/:fundId
exports.updateFinancialFund = async (req, res) => {
  try {
    const { fundName, initialStock, moreInfo } = req.body;

    const updateData = {
      fundName,
      initialStock,
      moreInfo,
    };

    const updatedFinancialFund = await FinancialFund.findByIdAndUpdate(
      req.params.fundId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFinancialFund) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "صندوق مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات صندوق با موفقیت ویرایش شد",
      status: "success",
      fund: updatedFinancialFund,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه صندوق نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "داده‌های ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update financial fund image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/funds/:fundId/update-fund-image
exports.updateFundImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update Bank fund image (only if they belong to the requesting seller)
    const updatedFinancialFund = await FinancialFund.findOneAndUpdate(
      {
        _id: req.params.fundId,
        seller: req.user.id,
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFinancialFund) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "صندوق مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر پروفایل با موفقیت به‌روزرسانی شد",
      image: updatedFinancialFund.image,
    });
  } catch (err) {
    console.error("Update fund image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه صندوق نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete financial fund -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/funds/:fundId
exports.deleteFund = async (req, res) => {
  try {
    let findFinancialFund = await FinancialFund.findOne({
      _id: req.params.fundId,
    });

    if (findFinancialFund) {
      await FinancialFund.findByIdAndDelete(req.params.fundId);

      return res.status(httpStatus.OK).json({
        msg: "صندوق شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Paychecks **********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all paychecks -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/paychecks/:paycheckType
exports.getAllPaychecks = async (req, res) => {
  try {
    const paychecks = await Paycheck.find({
      seller: req.user.id,
      paycheckType: req.params.paycheckType,
    }).populate("seller");

    if (paychecks && paychecks.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام معاملات های شما پیدا شدند",
        status: "success",
        count: paychecks.length,
        paychecks,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز معاملاتی اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single paycheck -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/paychecks/:paycheckType/:pcId
exports.getSinglePaycheck = async (req, res) => {
  try {
    const fund = await Paycheck.findOne({
      seller: req.user.id,
      _id: req.params.pcId,
      paycheckType: req.params.paycheckType,
    }).populate("seller");

    if (fund) {
      return res.status(httpStatus.OK).json({
        msg: "معاملات شماپیدا شد",
        status: "success",
        fund,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "معاملات پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create paycheck -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/paychecks/:paycheckType
exports.createPaycheck = async (req, res) => {
  const {
    payer,
    recipient,
    receiptPrice,
    financialFund,
    checkoutMethod,
    moreInfo,
    receiptDate,
    paycheckType,
  } = req.body;

  try {
    if (
      !payer ||
      !recipient ||
      !receiptPrice ||
      !financialFund ||
      !checkoutMethod ||
      !moreInfo ||
      !receiptDate ||
      !paycheckType
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد معامله باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const paycheckPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let newPaycheck = await Paycheck.create({
      image: paycheckPath || "default.jpg",
      seller: req.user.id,
      payer,
      recipient,
      receiptPrice,
      financialFund,
      checkoutMethod,
      moreInfo,
      receiptDate,
      paycheckType,
    });

    if (newPaycheck) {
      return res.status(httpStatus.OK).json({
        msg: "معامله شماایجاد شد",
        status: "success",
        fund: newPaycheck,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "معامله ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update paycheck -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/paychecks/:paycheckType/:pcId/update-paycheck
exports.updatePaycheck = async (req, res) => {
  try {
    const {
      payer,
      recipient,
      receiptPrice,
      financialFund,
      checkoutMethod,
      moreInfo,
      receiptDate,
      paycheckType,
    } = req.body;

    const updateData = {
      payer,
      recipient,
      receiptPrice,
      financialFund,
      checkoutMethod,
      moreInfo,
      receiptDate,
      paycheckType,
    };

    const updatedPaycheck = await Paycheck.findByIdAndUpdate(
      req.params.pcId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPaycheck) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "معامله مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات معامله با موفقیت ویرایش شد",
      status: "success",
      fund: updatedPaycheck,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه معامله نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "داده‌های ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update paycheck image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/paychecks/:paycheckType/:pcId/update-paycheck-image
exports.updatePaycheckImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update Bank fund image (only if they belong to the requesting seller)
    const updatedPaycheck = await Paycheck.findOneAndUpdate(
      {
        _id: req.params.pcId,
        seller: req.user.id,
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPaycheck) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "معامله مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر معامله با موفقیت به‌روزرسانی شد",
      image: updatedPaycheck.image,
    });
  } catch (err) {
    console.error("Update fund image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه معامله نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete paycheck -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/paychecks/:paycheckType/:pcId
exports.deletePaycheck = async (req, res) => {
  try {
    let findPaycheck = await Paycheck.findOne({
      _id: req.params.pcId,
    });

    if (findPaycheck) {
      await Paycheck.findByIdAndDelete(req.params.pcId);

      return res.status(httpStatus.OK).json({
        msg: "معامله شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Financial **********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all financials -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/financials/:financialType
exports.getAllFinancials = async (req, res) => {
  try {
    const financials = await Financial.find({
      seller: req.user.id,
      financialType: req.params.financialType,
    }).populate("seller");

    if (financials && financials.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام داده های شما پیدا شدند",
        status: "success",
        count: financials.length,
        financials,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز داده اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single financial -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/financials/:financialType/:financialId
exports.getSingleFinancial = async (req, res) => {
  try {
    const fund = await Financial.findOne({
      seller: req.user.id,
      _id: req.params.financialId,
      financialType: req.params.financialType,
    }).populate("seller");

    if (fund) {
      return res.status(httpStatus.OK).json({
        msg: "داده شماپیدا شد",
        status: "success",
        fund,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "داده پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create Financial -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/financials
exports.createFinancial = async (req, res) => {
  const {
    salesman,
    customer,
    products,
    services,
    discountAmount,
    receiptPay,
    receiptPayChecks,
    financialDate,
    factorNumber,
    moreInfo,
    financialType,
    hasVat,
  } = req.body;

  try {
    if (
      !salesman ||
      !customer ||
      !products ||
      !services ||
      !discountAmount ||
      !receiptPay ||
      !receiptPayChecks ||
      !financialDate ||
      !factorNumber ||
      !moreInfo ||
      !financialType ||
      !hasVat
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد داده باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const financialPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let newFinancial = await Financial.create({
      image: financialPath || "default.jpg",
      seller: req.user.id,
      salesman,
      customer,
      products,
      services,
      discountAmount,
      receiptPay,
      receiptPayChecks,
      financialDate,
      factorNumber,
      moreInfo,
      financialType,
      hasVat,
    });

    if (newFinancial) {
      return res.status(httpStatus.OK).json({
        msg: "داده شماایجاد شد",
        status: "success",
        fund: newFinancial,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "داده ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update financial -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/financials/:financialType/:financialId/update-financial
exports.updateFinancial = async (req, res) => {
  try {
    const {
      customer,
      products,
      services,
      discountAmount,
      receiptPay,
      receiptPayChecks,
      financialDate,
      factorNumber,
      moreInfo,
      financialType,
      hasVat,
    } = req.body;

    const updateData = {
      customer,
      products,
      services,
      discountAmount,
      receiptPay,
      receiptPayChecks,
      financialDate,
      factorNumber,
      moreInfo,
      financialType,
      hasVat,
    };

    const updatedFinancial = await Financial.findByIdAndUpdate(
      req.params.financialId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFinancial) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "داده مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات داده با موفقیت ویرایش شد",
      status: "success",
      fund: updatedFinancial,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه داده نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "داده‌های ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update financial image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/financials/:financialType/:financialId/update-financial-image
exports.updateFinancialImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update Bank fund image (only if they belong to the requesting seller)
    const updatedFinancial = await Financial.findOneAndUpdate(
      {
        _id: req.params.financialId,
        seller: req.user.id,
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFinancial) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "داده مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر داده با موفقیت به‌روزرسانی شد",
      image: updatedFinancial.image,
    });
  } catch (err) {
    console.error("Update fund image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه داده نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete financial -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/financials/:financialType/:financialId
exports.deleteFinancial = async (req, res) => {
  try {
    let findFinancial = await Financial.findOne({
      _id: req.params.financialId,
    });

    if (findFinancial) {
      await Financial.findByIdAndDelete(req.params.financialId);

      return res.status(httpStatus.OK).json({
        msg: "داده شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Factor **********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all factors -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/factors/:factorType
exports.getAllFactors = async (req, res) => {
  try {
    const factors = await Factor.find({
      seller: req.user.id,
      factorType: req.params.factorType,
    }).populate("seller");

    if (factors && factors.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام فاکتورهای شما پیدا شدند",
        status: "success",
        count: factors.length,
        factors,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز فاکتور اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single factor -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/factors/:factorType/:factorId
exports.getSingleFactor = async (req, res) => {
  try {
    const factor = await Factor.findOne({
      seller: req.user.id,
      _id: req.params.factorId,
      factorType: req.params.factorType,
    }).populate("seller");

    if (factor) {
      return res.status(httpStatus.OK).json({
        msg: "فاکتور شماپیدا شد",
        status: "success",
        factor,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "فاکتور پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create factor -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/factors
exports.createFactor = async (req, res) => {
  const {
    salesman,
    customer,
    factorDate,
    products,
    services,
    tax,
    factorType,
  } = req.body;

  try {
    if (
      !salesman ||
      !customer ||
      !factorDate ||
      !products ||
      !services ||
      !tax ||
      !factorType
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد فاکتور باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    let totalPrice = 0;

    const factorPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let productsObj = req.body.products;
    let servicesObj = req.body.services;

    productsObj.map((item) => {
      totalPrice += item.price * item.count;
    });

    servicesObj.map((item) => {
      totalPrice += item.price * item.count;
    });

    let newFactor = await Factor.create({
      image: factorPath || "default.jpg",
      seller: req.user.id,
      salesman,
      customer,
      factorDate,
      products,
      services,
      tax,
      factorType,
      totalPrice: totalPrice - (totalPrice * 4) / 100,
    });

    if (newFactor) {
      return res.status(httpStatus.OK).json({
        msg: "فاکتور شماایجاد شد",
        status: "success",
        fund: newFactor,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "فاکتور ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update factor -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/factors/:factorType/:factorId/update-factor
exports.updateFactor = async (req, res) => {
  try {
    const {
      salesman,
      customer,
      factorDate,
      products,
      services,
      tax,
      factorType,
      totalPrice,
    } = req.body;

    const updateData = {
      salesman,
      customer,
      factorDate,
      products,
      services,
      tax,
      factorType,
      totalPrice,
    };

    const updatedFactor = await Factor.findByIdAndUpdate(
      req.params.factorId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFactor) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "فاکتور مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات فاکتور با موفقیت ویرایش شد",
      status: "success",
      fund: updatedFactor,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه فاکتور نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فاکتور‌های ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update factors image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/factors/:factorType/:factorId/update-factor-image
exports.updateFactorImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update Bank fund image (only if they belong to the requesting seller)
    const updatedFactor = await Factor.findOneAndUpdate(
      {
        _id: req.params.factorId,
        seller: req.user.id,
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFactor) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "فاکتور مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر فاکتور با موفقیت به‌روزرسانی شد",
      image: updatedFactor.image,
    });
  } catch (err) {
    console.error("Update fund image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه فاکتور نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete factor -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/factors/:factorType/:factorId
exports.deleteFactor = async (req, res) => {
  try {
    let findFactor = await Factor.findOne({
      _id: req.params.factorId,
    });

    if (findFactor) {
      await Factor.findByIdAndDelete(req.params.factorId);

      return res.status(httpStatus.OK).json({
        msg: "فاکتور شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Refund **********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all Refund -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/refunds/:refundType
exports.getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find({
      seller: req.user.id,
      refundType: req.params.refundType,
    }).populate("seller");

    if (refunds && refunds.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام استردادهای شما پیدا شدند",
        status: "success",
        count: refunds.length,
        refunds,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز استرداد اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single refund -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/refunds/:refundType/:refundId
exports.getSingleRefund = async (req, res) => {
  try {
    const refund = await Refund.findOne({
      seller: req.user.id,
      _id: req.params.refundId,
      refundType: req.params.refundType,
    }).populate("seller");

    if (refund) {
      return res.status(httpStatus.OK).json({
        msg: "استرداد شماپیدا شد",
        status: "success",
        refund,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "استرداد پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create refund -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/refunds
exports.createRefund = async (req, res) => {
  const {
    salesman,
    customer,
    refundDate,
    refundType,
    products,
    services,
    moreInfo,
  } = req.body;

  try {
    if (
      !salesman ||
      !customer ||
      !refundDate ||
      !refundType ||
      !products ||
      !services ||
      !moreInfo
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد استرداد باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const refundPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let newRefund = await Refund.create({
      image: refundPath || "default.jpg",
      seller: req.user.id,
      salesman,
      customer,
      refundDate,
      products,
      services,
      refundType,
    });

    if (newRefund) {
      return res.status(httpStatus.OK).json({
        msg: "استرداد شماایجاد شد",
        status: "success",
        fund: newRefund,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "استرداد ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update refund -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/refunds/:refundType/:refundId/update-refund
exports.updateRefund = async (req, res) => {
  try {
    const {
      salesman,
      customer,
      refundDate,
      refundType,
      products,
      services,
      moreInfo,
    } = req.body;

    const updateData = {
      salesman,
      customer,
      refundDate,
      refundType,
      products,
      services,
      moreInfo,
    };

    const updatedRefund = await Refund.findByIdAndUpdate(
      req.params.refundId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRefund) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "استرداد مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات استرداد با موفقیت ویرایش شد",
      status: "success",
      fund: updatedRefund,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه استرداد نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "استردادهای ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update refund image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/refunds/:refundType/:refundId/update-refund-image
exports.updateRefundImage = async (req, res) => {
  try {
    // 1. Validate image exists
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "لطفاً یک تصویر معتبر ارسال کنید",
      });
    }

    // 2. Validate file type (optional but recommended)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "فرمت تصویر نامعتبر است. فقط تصاویر JPEG, PNG و WebP قابل قبول هستند",
      });
    }

    // 3. Update Bank fund image (only if they belong to the requesting seller)
    const updatedFactor = await Factor.findOneAndUpdate(
      {
        _id: req.params.refundId,
        seller: req.user.id,
      },
      {
        image: req.file.path,
        imageMimeType: req.file.mimetype, // Store mime type for future reference
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFactor) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "استرداد مورد نظر یافت نشد یا شما مجوز ویرایش آن را ندارید",
      });
    }

    // 5. Return success response
    return res.status(httpStatus.OK).json({
      status: "success",
      msg: "تصویر استرداد با موفقیت به‌روزرسانی شد",
      image: updatedFactor.image,
    });
  } catch (err) {
    console.error("Update fund image error:", err);

    // Handle specific errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه استرداد نامعتبر است",
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در سرور هنگام آپلود تصویر",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete factor -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/refunds/:refundType/:refundId
exports.deleteFactor = async (req, res) => {
  try {
    let findFactor = await Factor.findOne({
      _id: req.params.refundId,
    });

    if (findFactor) {
      await Factor.findByIdAndDelete(req.params.refundId);

      return res.status(httpStatus.OK).json({
        msg: "استرداد شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Catalog *************************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all catalog -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/catalogs
exports.getAllCatalogs = async (req, res) => {
  try {
    const catalogs = await Catalog.find({
      seller: req.user.id,
    }).populate("seller");

    if (catalogs && catalogs.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام کاتالوگهای شما پیدا شدند",
        status: "success",
        count: catalogs.length,
        catalogs,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز کاتالوگ اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single catalog -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/catalogs/:catalogId
exports.getSingleCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findOne({
      seller: req.user.id,
      _id: req.params.catalogId,
    }).populate("seller");

    if (catalog) {
      return res.status(httpStatus.OK).json({
        msg: "کاتالوگ شماپیدا شد",
        status: "success",
        catalog,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "کاتالوگ پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create catalog -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/catalogs
exports.createCatalog = async (req, res) => {
  const { title } = req.body;

  try {
    if (!title) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد کاتالوگ باید همه عنوان را وارد کنید.",
        status: "failure",
      });
    }
    let newCatalog = await Catalog.create({
      seller: req.user.id,
      title,
    });

    if (newCatalog) {
      return res.status(httpStatus.OK).json({
        msg: "کاتالوگ شماایجاد شد",
        status: "success",
        fund: newCatalog,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "کاتالوگ ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update catalog -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/catalogs/:catalogId/update-catalog
exports.updateCatalog = async (req, res) => {
  try {
    const { title } = req.body;

    const updateData = {
      title,
    };

    const updatedcatalog = await Catalog.findByIdAndUpdate(
      req.params.catalogId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedcatalog) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "کاتالوگ مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات کاتالوگ با موفقیت ویرایش شد",
      status: "success",
      fund: updatedcatalog,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه کاتالوگ نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "کاتالوگهای ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete catalog -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/catalogs/:catalogId
exports.deleteCatalog = async (req, res) => {
  try {
    let findCatalog = await Catalog.findOne({
      _id: req.params.catalogId,
    });

    if (findCatalog) {
      await Catalog.findByIdAndDelete(req.params.catalogId);

      return res.status(httpStatus.OK).json({
        msg: "کاتالوگ شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Order **************************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all orders -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      seller: req.user.id,
    }).populate("seller");

    if (orders && orders.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام سفارشهای شما پیدا شدند",
        status: "success",
        count: orders.length,
        orders,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز سفارش اضافه نشده است",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get single order -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/orders/:orderId
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      seller: req.user.id,
      _id: req.params.orderId,
    }).populate("seller");

    if (order) {
      return res.status(httpStatus.OK).json({
        msg: "سفارش شماپیدا شد",
        status: "success",
        order,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "سفارش پیدا نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create order -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/orders
exports.createOrder = async (req, res) => {
  const { title, orderOwner, moreInfo, orderDate, catalog, status } = req.body;

  try {
    if (!title || !orderOwner || !moreInfo || !orderDate || !catalog) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد سفارش باید همه فیلدها را وارد کنید.",
        status: "failure",
      });
    }
    let neworder = await Order.create({
      seller: req.user.id,
      title,
      orderOwner,
      moreInfo,
      orderDate,
      catalog,
      status,
    });

    if (neworder) {
      return res.status(httpStatus.OK).json({
        msg: "سفارش شماایجاد شد",
        status: "success",
        fund: neworder,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "سفارش ایجاد نشد",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update order -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/orders/:orderId/update-order
exports.updateOrder = async (req, res) => {
  try {
    const { title, orderOwner, moreInfo, orderDate, catalog, status } =
      req.body;

    const updateData = {
      title,
      orderOwner,
      moreInfo,
      orderDate,
      catalog,
      status,
    };

    const updatedorder = await Order.findByIdAndUpdate(
      req.params.orderId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedorder) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        msg: "سفارش مورد نظر یافت نشد",
      });
    }

    return res.status(httpStatus.OK).json({
      msg: "اطلاعات سفارش با موفقیت ویرایش شد",
      status: "success",
      fund: updatedorder,
    });
  } catch (err) {
    console.error(err);

    // Handle specific mongoose errors
    if (err.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "شناسه سفارش نامعتبر است",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        msg: "سفارشهای ارسالی نامعتبر هستند",
        errors: err.errors,
      });
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. لطفاً دوباره امتحان کنید",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # delete order -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/orders/:orderId
exports.deleteOrder = async (req, res) => {
  try {
    let findOrder = await Order.findOne({
      _id: req.params.orderId,
    });

    if (findOrder) {
      await Order.findByIdAndDelete(req.params.orderId);

      return res.status(httpStatus.OK).json({
        msg: "سفارش شماپاک شد",
        status: "success",
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "درخواست شما نامعتبر است",
        status: "failure",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// // ******************************************************************************
// ************************************ Subscription *******************************
// *********************************************************************************

exports.requestSubscription = async (req, res) => {
  const { type } = req.params;
  const userId = req.user.id; 

  if (!["golden", "silver"].includes(type)) {
    return res.status(400).json({ message: "Invalid plan type." });
  }

  try {
    const { amount } = PLAN_DETAILS[type];

    const response = await zarinpal.PaymentRequest({
      Amount: amount,
      CallbackURL: `${process.env.BASE_URL}/api/sellers/subscribe/verify?userId=${userId}&type=${type}`,
      Description: `Subscription plan: ${type}`,
    });

    if (response.status === 100) {
      return res.json({ url: response.url });
    }

    res
      .status(400)
      .json({ message: "Payment request failed", status: response.status });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating payment", error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { Authority, Status } = req.query;
  const { userId, type } = req.query;

  const plan = PLAN_DETAILS[type];
  if (!plan) return res.status(400).json({ message: "Invalid plan type." });

  try {
    const response = await zarinpal.PaymentVerification({
      Amount: plan.amount,
      Authority,
    });

    if (response.status === 100) {
      const subscription = new Subscription({
        seller: userId,
        type,
        features: {
          storageLimit: plan.storageLimit,
        },
      });

      await subscription.save();

      // Optionally update user subscription field
      // await User.findByIdAndUpdate(userId, { subscription: subscription._id });

      return res.redirect(`${process.env.BASE_URL}/success`);
    } else {
      return res.redirect(`${process.env.BASE_URL}/payment/failure`);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Payment verification error", error: err.message });
  }
};
