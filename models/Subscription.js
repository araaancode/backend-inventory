const mongoose = require("mongoose");
const validator = require("validator");

const subscriptionSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Subscription must belong to a user"],
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user !== null;
      },
      message: "No user found with this ID"
    }
  },
  type: {
    type: String,
    enum: {
      values: ['golden', 'silver'],
      message: 'Subscription type must be either golden or silver'
    },
    required: [true, "Subscription type is required"]
  },
  startDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: "Start date cannot be in the future"
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: "End date must be after start date"
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: {
    storageLimit: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return this.type === 'golden' ? value === 1000 : value === 500;
        },
        message: "Storage limit must be 1000GB for golden or 500GB for silver"
      }
    },
    prioritySupport: {
      type: Boolean,
      default: function() {
        return this.type === 'golden';
      }
    },
    analyticsAccess: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate end date automatically (1 year from start)
subscriptionSchema.pre('save', function(next) {
  if (!this.endDate) {
    const oneYearLater = new Date(this.startDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    this.endDate = oneYearLater;
  }
  
  // Update isActive status based on end date
  this.isActive = new Date() < this.endDate;
  next();
});

// Add index for better performance
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ isActive: 1 });

// Virtual property for remaining days
subscriptionSchema.virtual('remainingDays').get(function() {
  const now = new Date();
  const diffTime = Math.max(0, this.endDate - now);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
});

module.exports = mongoose.model("Subscription", subscriptionSchema);