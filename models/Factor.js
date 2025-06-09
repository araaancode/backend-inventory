const mongoose = require('mongoose');
const validator = require('validator');

const factorSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, 'Customer reference is required'],
      validate: {
        validator: async function(value) {
          const user = await mongoose.model('User').findById(value);
          return !!user;
        },
        message: 'No user found with this ID'
      }
    },
    factorDate: {
      type: Date,
      required: [true, 'Invoice date is required'],
      default: Date.now,
      validate: {
        validator: function(value) {
          return value <= new Date();
        },
        message: 'Invoice date cannot be in the future'
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
          message: 'No product found with this ID'
        }
      }],
      validate: {
        validator: function(products) {
          return products.length > 0 || this.services.length > 0;
        },
        message: 'Invoice must contain at least one product or service'
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
          message: 'No service found with this ID'
        }
      }],
      validate: {
        validator: function(services) {
          return services.length > 0 || this.products.length > 0;
        },
        message: 'Invoice must contain at least one product or service'
      }
    },
    tax: {
      type: Number,
      required: [true, 'Tax amount is required'],
      min: [0, 'Tax cannot be negative'],
      max: [100, 'Tax cannot exceed 100%']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
      validate: {
        validator: function(value) {
          // Basic validation that total isn't less than tax
          return value >= this.tax;
        },
        message: 'Total price cannot be less than tax amount'
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Auto-validate that at least products or services exist
factorSchema.pre('validate', function(next) {
  if (this.products.length === 0 && this.services.length === 0) {
    this.invalidate('products', 'Invoice must contain products or services', this.products);
  }
  next();
});

// Calculate totalPrice if not provided (basic example)
factorSchema.pre('save', async function(next) {
  if (this.isModified('products') || this.isModified('services') || this.isModified('tax')) {
    if (typeof this.totalPrice !== 'number') {
      // Simple calculation - in real app you'd fetch actual prices
      const productCount = this.products.length;
      const serviceCount = this.services.length;
      const baseAmount = (productCount * 1000) + (serviceCount * 500); // Example values
      this.totalPrice = baseAmount + (baseAmount * (this.tax / 100));
    }
  }
  next();
});

module.exports = mongoose.model('Factor', factorSchema);