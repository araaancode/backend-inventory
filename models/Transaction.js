const mongoose = require('mongoose');
const validator = require('validator');

const transactionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      validate: {
        validator: async function(value) {
          if (!value) return true; // Optional field
          const user = await mongoose.model('User').findById(value);
          return !!user;
        },
        message: 'Invalid seller reference - user not found'
      }
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, 'Customer reference is required'],
      validate: {
        validator: async function(value) {
          const user = await mongoose.model('User').findById(value);
          return !!user;
        },
        message: 'Invalid customer reference - user not found'
      }
    },
    products: {
      type: [{
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        validate: {
          validator: async function(value) {
            const product = await mongoose.model('Product').findById(value);
            return !!product;
          },
          message: 'Invalid product reference - product not found'
        }
      }],
      validate: {
        validator: function(products) {
          return products.length > 0 || this.services.length > 0;
        },
        message: 'Transaction must contain at least one product or service'
      }
    },
    services: {
      type: [{
        type: mongoose.Schema.ObjectId,
        ref: "Service",
        validate: {
          validator: async function(value) {
            const service = await mongoose.model('Service').findById(value);
            return !!service;
          },
          message: 'Invalid service reference - service not found'
        }
      }],
      validate: {
        validator: function(services) {
          return services.length > 0 || this.products.length > 0;
        },
        message: 'Transaction must contain at least one product or service'
      }
    },
    receipt: {
      type: mongoose.Schema.ObjectId,
      ref: "Paycheck",
      validate: {
        validator: async function(value) {
          if (!value) return true; // Optional field
          const paycheck = await mongoose.model('Paycheck').findById(value);
          return !!paycheck;
        },
        message: 'Invalid paycheck reference - paycheck not found'
      }
    },
    receiptChecks: {
      type: [{
        type: mongoose.Schema.ObjectId,
        ref: "BankCheck",
        validate: {
          validator: async function(value) {
            const check = await mongoose.model('BankCheck').findById(value);
            return !!check;
          },
          message: 'Invalid bank check reference - check not found'
        }
      }],
      validate: {
        validator: function(checks) {
          return checks.length <= 10; // Maximum 10 checks
        },
        message: 'Cannot have more than 10 receipt checks'
      }
    },
    factorNumber: {
      type: Number,
      validate: {
        validator: function(value) {
          if (!value) return true; // Optional field
          return value.toString().length >= 6 && value.toString().length <= 12;
        },
        message: 'Factor number must be 6-12 digits'
      }
    },
    moreInfo: {
      type: String,
      maxlength: [500, 'Additional info cannot exceed 500 characters'],
      trim: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better performance
transactionSchema.index({ customer: 1 });
transactionSchema.index({ seller: 1 });
transactionSchema.index({ factorNumber: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Transaction", transactionSchema);