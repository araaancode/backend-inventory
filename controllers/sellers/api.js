const Factor = require("../../models/Factor");
const httpStatus = require("http-status-codes");

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
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # get Single seller factor -> GET -> sellers (PRIVATE)
exports.getSingleFactors = async (req, res) => {
  try {
    const factor = await Factor.findOne({_id:req.params.factorId ,seller: req.userId }).populate(
      "customer products services seller"
    );

    res.status(httpStatus.OK).json({
      msg: "your factor found",
      status: "success",
      factor,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # create factor by authenticated seller -> POST -> sellers (PRIVATE)
exports.createFactor = async (req, res) => {
  try {


    res.json({
      seller:"684755695a9955ec1da33dfd",
      customer:req.body.customer,
      factorDate:req.body.factorDate,
      products:req.body.products,
      services:req.body.services,
      tax:req.body.tax,
      factorType:req.body.factorType,
      totalPrice
    })

    // // Validate at least one product or service
    // if (
    //   (!req.body.products || req.body.products.length === 0) &&
    //   (!req.body.services || req.body.services.length === 0)
    // ) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Factor must contain at least one product or service",
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
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: "error",
        message: messages.join(". "),
      });
    }
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
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
//         message: "No factor found with that ID",
//       });
//     }

//     // Check authorization
//     if (
//       req.user.role !== "admin" &&
//       factor.customer._id.toString() !== req.user.id
//     ) {
//       return res.status(403).json({
//         status: "error",
//         message: "You are not authorized to access this factor",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         factor,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
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
//         message: "No factor found with that ID",
//       });
//     }

//     // Check authorization
//     if (
//       req.user.role !== "admin" &&
//       factor.customer.toString() !== req.user.id
//     ) {
//       return res.status(403).json({
//         status: "error",
//         message: "You are not authorized to update this factor",
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
//         message: "You cannot change the customer of this factor",
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
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((val) => val.message);
//       return res.status(400).json({
//         status: "error",
//         message: messages.join(". "),
//       });
//     }
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
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
//         message: "You are not authorized to perform this action",
//       });
//     }

//     const factor = await Factor.findByIdAndDelete(req.params.id);

//     if (!factor) {
//       return res.status(404).json({
//         status: "error",
//         message: "No factor found with that ID",
//       });
//     }

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
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
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//     });
//   }
// };
