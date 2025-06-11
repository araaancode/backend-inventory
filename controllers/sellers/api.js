const Factor = require("../../models/Factor");
const {
  Product,
  MainGroup,
  SubGroup,
  ProductGroup,
} = require("../../models/Product");
const Service = require("../../models/Service");
const Cost = require("../../models/Cost");
const BankAccount = require("../../models/BankAccount");
const httpStatus = require("http-status-codes");
const { ObjectId } = require('mongoose').Types;


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
//     const factor = await Factor.findById(req.params.bankaccountId).populate(
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
//     const factor = await Factor.findById(req.params.bankaccountId);

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
//       req.params.bankaccountId,
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

//     const factor = await Factor.findByIdAndDelete(req.params.bankaccountId);

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
        moreInfo:moreInfoObj
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
