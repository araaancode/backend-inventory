const Factor = require("../../models/Factor");
const Product = require("../../models/Product");
const httpStatus = require("http-status-codes");

// *********************************************************************************
// ************************************ Factors ************************************
// *********************************************************************************

// # description -> HTTP VERB -> Accesss
// # get all seller factors -> GET -> sellers (PRIVATE)
exports.getAllFactors = async (req, res) => {
  try {
    const factors = await Factor.find({ seller: req.userId }).populate(
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
      seller: req.userId,
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
    // seller:req.userId,
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
    const products = await Product.find({ seller: req.userId }).populate(
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
      seller: req.userId,
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

    res.json({
      seller:  req.user.id,
      title: req.body.title,
      productCode: req.body.productCode,
    });

    console.log("sellerId: ", req.user.id);

    // await Product.create({
    //   image: productPath || "default.jpg",
    //   seller: req.userId,
    //   title: req.body.title,
    //   productCode: req.body.productCode,
    //   productGroup: {
    //     mainGroup: req.body.productGroup.mainGroup,
    //     subGroup: req.body.productGroup.subGroup,
    //     hashtag: req.body.productGroup.hashtag,
    //   },
    //   countingUnit: req.body.countingUnit,
    //   secondaryUnit: {
    //     secondaryUnitCountingUnit: req.body.secondaryUnit.secondaryUnitCountingUnit,
    //     subunitRatio: req.body.secondaryUnit.subunitRatio,
    //     openingInventoryMainUnit: req.body.secondaryUnit.openingInventoryMainUnit,
    //     openingInventorySubUnit: req.body.secondaryUnit.openingInventorySubUnit,
    //     purchasePriceMainUnit: req.body.secondaryUnit.purchasePriceMainUnit,
    //     purchasePriceSubUnit: req.body.secondaryUnit.purchasePriceSubUnit,
    //     sellingPriceMainUnit: req.body.secondaryUnit.sellingPriceMainUnit,
    //     sellingPriceSubUnit: req.body.secondaryUnit.sellingPriceSubUnit,
    //     secondSellingMainUnit: req.body.secondaryUnit.secondSellingMainUnit,
    //     secondSellingSubUnit: req.body.secondaryUnit.secondSellingSubUnit,
    //   },
    //   moreInfo: {
    //     additionalInformation: req.body.moreInfo.additionalInformation,
    //     factorDescription: req.body.moreInfo.factorDescription,
    //     barcode: req.body.moreInfo.barcode,
    //     minExpireWarningDays: req.body.moreInfo.minExpireWarningDays,
    //     minStock: req.body.moreInfo.minStock,
    //     vatPercent: req.body.moreInfo.vatPercent,
    //     weight: req.body.moreInfo.weight,
    //     length: req.body.moreInfo.length,
    //     width: req.body.moreInfo.width,
    //     height: req.body.moreInfo.height,
    //   },
    // });

    // res.status(httpStatus.OK).json({
    //   msg: " محصول شما ایجاد شد",
    //   status: "success",
    // });
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
        seller: req.userId,
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
      { _id: req.params.productId, seller: req.userId },
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
