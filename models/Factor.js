const mongoose = require('mongoose');
const validator = require('validator');

const factorItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required'],
    validate: {
      validator: async function(value) {
        const product = await mongoose.model('Product').findById(value);
        return product !== null;
      },
      message: 'No product found with this ID'
    }
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    validate: {
      validator: async function(value) {
        if (!value) return true;
        const service = await mongoose.model('Service').findById(value);
        return service !== null;
      },
      message: 'No service found with this ID'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  }
});

const factorSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Customer reference is required'],
      validate: {
        validator: async function(value) {
          const user = await mongoose.model('User').findById(value);
          return user !== null;
        },
        message: 'No user found with this ID'
      }
    },
    factorNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function(value) {
          return /^[A-Z0-9\-_]+$/.test(value);
        },
        message: 'Invoice number can only contain letters, numbers, hyphens, and underscores'
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
    items: [factorItemSchema],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    tax: {
      type: Number,
      required: [true, 'Tax amount is required'],
      min: [0, 'Tax cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'partial', 'paid', 'refunded', 'cancelled'],
        message: 'Payment status must be pending|partial|paid|refunded|cancelled'
      },
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['cash', 'credit', 'bank', 'online', 'check'],
        message: 'Payment method must be cash|credit|bank|online|check'
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return value > this.factorDate;
        },
        message: 'Due date must be after invoice date'
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Calculate totals before saving
factorSchema.pre('save', function(next) {
  // Calculate item totals
  if (this.isModified('items')) {
    this.items.forEach(item => {
      item.totalPrice = (item.unitPrice * item.quantity) * (1 - (item.discount / 100));
    });
  }

  // Calculate invoice totals
  if (this.isModified('items') || this.isModified('discount') || this.isModified('tax') || this.isModified('shippingCost')) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalPrice = this.subtotal + this.tax + this.shippingCost - this.discount;
  }

  next();
});

// Add indexes for performance
factorSchema.index({ customer: 1 });
factorSchema.index({ factorNumber: 1 });
factorSchema.index({ factorDate: -1 });
factorSchema.index({ paymentStatus: 1 });
factorSchema.index({ totalPrice: 1 });

// Virtual for formatted invoice date
factorSchema.virtual('formattedDate').get(function() {
  return this.factorDate.toLocaleDateString('fa-IR'); // Persian date format
});

// Virtual for days overdue
factorSchema.virtual('daysOverdue').get(function() {
  if (this.paymentStatus === 'paid' || !this.dueDate) return 0;
  const diff = new Date() - this.dueDate;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
});

module.exports = mongoose.model('Factor', factorSchema);