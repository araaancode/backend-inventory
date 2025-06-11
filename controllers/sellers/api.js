const Factor = require("../../models/Factor");
const Product = require("../../models/Product");
const Service = require("../../models/Service");
const Cost = require("../../models/Cost");
const BankAccount = require("../../models/BankAccount");
const httpStatus = require("http-status-codes");

// *********************************************************************************
// ************************************ Factors ************************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all seller factors -> GET -> sellers (PRIVATE)
exports.getAllFactors = async (req, res) => {
  try {
    const factors = await Factor.find({ seller: req.user.id }).populate(
      "customer products services seller"
    );

    res.status(httpStatus.OK).json({
      msg: "all your factors found",
      status: "success",
      count: factors.length,
      factors,
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
// # get Single seller factor -> GET -> sellers (PRIVATE)
exports.getSingleFactors = async (req, res) => {
  try {
    const factor = await Factor.findOne({
      _id: req.params.factorId,
      seller: req.user.id,
    }).populate("customer products services seller");

    res.status(httpStatus.OK).json({
      msg: "your factor found",
      status: "success",
      factor,
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
// # create factor by authenticated seller -> POST -> sellers (PRIVATE)
exports.createFactor = async (req, res) => {
  try {
    res.json({
      seller: "684755695a9955ec1da33dfd",
      customer: req.body.customer,
      factorDate: req.body.factorDate,
      products: req.body.products,
      services: req.body.services,
      tax: req.body.tax,
      factorType: req.body.factorType,
      totalPrice,
    });

    // // Validate at least one product or service
    // if (
    //   (!req.body.products || req.body.products.length === 0) &&
    //   (!req.body.services || req.body.services.length === 0)
    // ) {
    //   return res.status(400).json({
    //     status: "error",
    //     msg: "Factor must contain at least one product or service",
    //   });
    // }

    // const newFactor = await Factor.create({
    // seller:req.user.id,
    // customer:req.body.customer,
    // factorDate:req.body.factorDate,
    // products:req.body.products,
    // services:req.body.services,
    // tax:req.body.tax,
    // factorType:req.body.factorType,
    // totalPrice
    // });

    // res.status(201).json({
    //   status: "success",
    //   data: {
    //     factor: newFactor,
    //   },
    // });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: "error",
        msg: messages.join(". "),
      });
    }
    res.status(500).json({
      status: "error",
      msg: "خطای داخلی سرور. دوباره امتحان کنید",
    });
  }
};

// /**
//  * @desc    Get single factor
//  * @route   GET /api/factors/:id
//  */
// exports.getFactor = async (req, res) => {
//   try {
//     const factor = await Factor.findById(req.params.id).populate(
//       "customer products services"
//     );

//     if (!factor) {
//       return res.status(404).json({
//         status: "error",
//         msg: "No factor found with that ID",
//       });
//     }

//     // Check authorization
//     if (
//       req.user.role !== "admin" &&
//       factor.customer._id.toString() !== req.user.id
//     ) {
//       return res.status(403).json({
//         status: "error",
//         msg: "You are not authorized to access this factor",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         factor,
//       },
//     });
//   } catch (err) {
// console.log(err)
//     res.status(500).json({
//       status: "error",
//       msg: "خطای داخلی سرور. دوباره امتحان کنید",
//     });
//   }
// };

// /**
//  * @desc    Update factor
//  * @route   PATCH /api/factors/:id
//  */
// exports.updateFactor = async (req, res) => {
//   try {
//     const factor = await Factor.findById(req.params.id);

//     if (!factor) {
//       return res.status(404).json({
//         status: "error",
//         msg: "No factor found with that ID",
//       });
//     }

//     // Check authorization
//     if (
//       req.user.role !== "admin" &&
//       factor.customer.toString() !== req.user.id
//     ) {
//       return res.status(403).json({
//         status: "error",
//         msg: "You are not authorized to update this factor",
//       });
//     }

//     // Prevent changing customer if not admin
//     if (
//       req.user.role !== "admin" &&
//       req.body.customer &&
//       req.body.customer !== req.user.id
//     ) {
//       return res.status(403).json({
//         status: "error",
//         msg: "You cannot change the customer of this factor",
//       });
//     }

//     // Update factor
//     const updatedFactor = await Factor.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         factor: updatedFactor,
//       },
//     });
//   } catch (err) {
// console.log(err)
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((val) => val.message);
//       return res.status(400).json({
//         status: "error",
//         msg: messages.join(". "),
//       });
//     }
//     res.status(500).json({
//       status: "error",
//       msg: "خطای داخلی سرور. دوباره امتحان کنید",
//     });
//   }
// };

// /**
//  * @desc    Delete factor (Admin only)
//  * @route   DELETE /api/factors/:id
//  */
// exports.deleteFactor = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         status: "error",
//         msg: "You are not authorized to perform this action",
//       });
//     }

//     const factor = await Factor.findByIdAndDelete(req.params.id);

//     if (!factor) {
//       return res.status(404).json({
//         status: "error",
//         msg: "No factor found with that ID",
//       });
//     }

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (err) {
// console.log(err)
//     res.status(500).json({
//       status: "error",
//       msg: "خطای داخلی سرور. دوباره امتحان کنید",
//     });
//   }
// };

// /**
//  * @desc    Get factors for current user
//  * @route   GET /api/factors/my-factors
//  */
// exports.getMyFactors = async (req, res) => {
//   try {
//     const factors = await Factor.find({ customer: req.user.id }).populate(
//       "products services"
//     );

//     res.status(200).json({
//       status: "success",
//       results: factors.length,
//       data: {
//         factors,
//       },
//     });
//   } catch (err) {
// console.log(err)
//     res.status(500).json({
//       status: "error",
//       msg: "خطای داخلی سرور. دوباره امتحان کنید",
//     });
//   }
// };

// *********************************************************************************
// ************************************ Products ***********************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all products -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).populate(
      "seller"
    );

    res.status(httpStatus.OK).json({
      msg: "تمام محصولات شما پیدا شدند",
      status: "success",
      count: products.length,
      products,
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
// # get single product -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/products/:productId
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      seller: req.user.id,
      _id: req.params.productId,
    }).populate("seller");

    res.status(httpStatus.OK).json({
      msg: " محصول شما پیدا شد",
      status: "success",
      product,
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
// # create product -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/products
exports.createProduct = async (req, res) => {
  // const {
  //   title,
  //   productCode,
  //   countingUnit,
  // } = req.body;

  try {
    //   if (
    //     !title ||
    //     !productCode ||
    //     !countingUnit
    //   ) {
    //     return res.status(httpStatus.BAD_REQUEST).json({
    //       msg: "برای ایجاد محصول باید همه فیلدها را پر کنید.",
    //       status: "failure",
    //     });
    //   }

    const productPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    // declare variables
    var productGroupObj = {};
    var secondaryUnitObj = {};
    var moreInfoObj = {};

    var subGroupObj = {};

    subGroupObj.whichMainGroup = req.body.whichMainGroup;

    // assign the product group values
    productGroupObj.mainGroup = req.body.mainGroup;
    productGroupObj.subGroup = subGroupObj;
    productGroupObj.hashtag = req.body.hashtag;

    // assign the secondary unit values
    secondaryUnitObj.secondaryUnitCountingUnit =
      req.body.secondaryUnitCountingUnit;
    secondaryUnitObj.subunitRatio = req.body.subunitRatio;
    secondaryUnitObj.openingInventoryMainUnit =
      req.body.openingInventoryMainUnit;
    secondaryUnitObj.openingInventorySubUnit = req.body.openingInventorySubUnit;
    secondaryUnitObj.purchasePriceMainUnit = req.body.purchasePriceMainUnit;
    secondaryUnitObj.purchasePriceSubUnit = req.body.purchasePriceSubUnit;
    secondaryUnitObj.sellingPriceMainUnit = req.body.sellingPriceMainUnit;
    secondaryUnitObj.sellingPriceSubUnit = req.body.sellingPriceSubUnit;
    secondaryUnitObj.secondSellingMainUnit = req.body.secondSellingMainUnit;
    secondaryUnitObj.secondSellingSubUnit = req.body.secondSellingSubUnit;

    // assign the more info values
    moreInfoObj.additionalInformation = req.body.additionalInformation;
    moreInfoObj.factorDescription = req.body.factorDescription;
    moreInfoObj.barcode = req.body.barcode;
    moreInfoObj.minExpireWarningDays = req.body.minExpireWarningDays;
    moreInfoObj.minStock = req.body.minStock;
    moreInfoObj.vatPercent = req.body.vatPercent;
    moreInfoObj.weight = req.body.weight;
    moreInfoObj.length = req.body.length;
    moreInfoObj.width = req.body.width;
    moreInfoObj.height = req.body.height;

    await Product.create({
      image: productPath || "default.jpg",
      seller: req.user.id,
      title: req.body.title,
      productCode: req.body.productCode,
      productGroup: productGroupObj,
      countingUnit: req.body.countingUnit,
      secondaryUnit: secondaryUnitObj,
      moreInfo: moreInfoObj,
    });

    res.status(httpStatus.OK).json({
      msg: " محصول شما ایجاد شد",
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
    if (!req.files || req.files.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "لطفاً یک تصویر ارسال کنید",
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.productId, seller: req.user.id },
      { image: req.files[0].path },
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
    await Product.findByIdAndDelete(req.params.productId);

    res.status(httpStatus.OK).json({
      msg: "محصول شما پاک شد",
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

// // *********************************************************************************
// ************************************ Bank Account ***********************************
// *********************************************************************************
// # description -> HTTP VERB -> Accesss
// # get all bankaccounts -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/bankaccounts
exports.getAllBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({
      seller: req.user.id,
    }).populate("seller");

    if (bankAccounts && bankAccounts.length > 0) {
      return res.status(httpStatus.OK).json({
        msg: "تمام حساب های بانکی شما پیدا شدند",
        status: "success",
        count: bankAccounts.length,
        bankAccounts,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "هنوز حساب بانکی اضافه نشده است",
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
// # get single bank account -> GET -> sellers (PRIVATE)
// # route -> /api/sellers/bankaccounts/:bankaccountId
exports.getSingleBankAccount = async (req, res) => {
  try {
    const bankAccount = await bankAccount
      .findOne({
        seller: req.user.id,
        _id: req.params.bankaccountId,
      })
      .populate("seller");

    if (bankAccount) {
      return res.status(httpStatus.OK).json({
        msg: "حساب بانکی شما پیدا شد",
        status: "success",
        bankAccount,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "حساب بانکی پیدا نشد",
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
// # create Bank Account -> POST -> sellers (PRIVATE)
// # route -> /api/sellers/bankaccounts
exports.createBankAccount = async (req, res) => {
  const {
    holderFullName,
    accountNumber,
    cardNumber,
    moreInfo,
    iban,
    bankBranch,
    balance,
    additionalInfo,
    bankName,
  } = req.body;

  try {
    if (
      !holderFullName ||
      !accountNumber ||
      !cardNumber ||
      !moreInfo ||
      !iban ||
      !bankBranch ||
      !balance ||
      !additionalInfo ||
      !bankName
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "برای ایجاد حساب بانکی باید همه فیلدها را پر کنید.",
        status: "failure",
      });
    }

    const bankAccountPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    let newService = await BankAccount.create({
      image: bankAccountPath || "default.jpg",
      seller: req.user.id,
      holderFullName,
      accountNumber,
      cardNumber,
      moreInfo,
      iban,
      bankBranch,
      balance,
      additionalInfo,
      bankName,
    });

    if (newService) {
      return res.status(httpStatus.OK).json({
        msg: "حساب بانکی شما ایجاد شد",
        status: "success",
        service: newService,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "حساب بانکی ایجاد نشد",
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
// # update bank account -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/bankaccounts/:bankaccountId/update-bankaccount
exports.updateBankAccount = async (req, res) => {
  try {
    let updatedBankAccount = await BankAccount.findByIdAndUpdate(
      req.params.bankaccountId,
      {
        holderFullName,
        accountNumber,
        cardNumber,
        moreInfo,
        iban,
        bankBranch,
        balance,
        additionalInfo,
        bankName,
      },
      { new: true }
    );

    if (updatedBankAccount) {
      return res.status(httpStatus.OK).json({
        msg: "حساب بانکی شما ویرایش شد",
        status: "success",
        bankAccount: updatedBankAccount,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "حساب بانکی ایجاد نشد",
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
// # update bank account image -> PUT -> sellers (PRIVATE)
// # route -> /api/sellers/bankaccounts/:bankaccountId/update-bankaccount-image
exports.updateBankAccountImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "failure",
        msg: "لطفاً یک تصویر ارسال کنید", 
      });
    }

    const updatedBankAccount = await BankAccount.findOneAndUpdate(
      { _id: req.params.bankaccountId, seller: req.user.id },
      { image: req.file.path },
      { new: true }
    );

    if (!updatedBankAccount) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "failure",
        msg: "هزینه با این شناسه یافت نشد",
      });
    }

    if (updatedBankAccount) {
      return;
      res.status(httpStatus.OK).json({
        status: "success",
        msg: "تصویر هزینه با موفقیت ویرایش شد",
        bankAccount: updatedBankAccount,
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
// # delete bank account -> DELETE -> sellers (PRIVATE)
// # route -> /api/sellers/bankaccounts/:bankaccountId
exports.deletebankAccount = async (req, res) => {
  try {
    let findBankAccount = await BankAccount.findOne({ _id: req.params.bankaccountId });

    if (findBankAccount) {
      await BankAccount.findByIdAndDelete(req.params.costId);

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
