const mongoose = require("mongoose");
const validator = require("validator");

const personSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
      index: true // Added index for better query performance
    },

    personName: {
      type: String,
      required: [true, "Person name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    personGroups: {
      type: String,
      enum: {
        values: ["sellers", "customers"],
        message: "Person group must be either 'sellers' or 'customers'"
      },
      required: [true, "Person group is required"]
    },

    previousFinancialAccount: {
      type: Number,
      min: [0, "Financial account cannot be negative"],
      set: v => Math.round(v * 100) / 100 // Store with 2 decimal precision
    },

    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^09\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid Iranian mobile number`
      },
      unique: true,
      sparse: true,
      trim: true
    },

    moreInfo: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true
    },

    postalCode: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid Iranian postal code`
      }
    },

    birthDate: {
      type: Date,
      validate: {
        validator: function(date) {
          return date < new Date();
        },
        message: "Birth date cannot be in the future"
      }
    },

    nationalCode: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v) && this.validateNationalCode(v);
        },
        message: props => `${props.value} is not a valid Iranian national code`
      },
      unique: true,
      sparse: true
    },

    economicCode: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{12}$/.test(v);
        },
        message: props => `${props.value} is not a valid economic code`
      },
      unique: true,
      sparse: true
    },

    position: {
      type: {
        lat: {
          type: Number,
          min: -90,
          max: 90
        },
        lng: {
          type: Number,
          min: -180,
          max: 180
        }
      },
      validate: {
        validator: function(pos) {
          return pos.lat !== undefined && pos.lng !== undefined;
        },
        message: "Both latitude and longitude are required for position"
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },

    tags: {
      type: [String],
      validate: {
        validator: function(tags) {
          return tags.length <= 10;
        },
        message: "Cannot have more than 10 tags"
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// National code validation method
personSchema.methods.validateNationalCode = function(code) {
  if (!/^\d{10}$/.test(code)) return false;
  
  const check = parseInt(code[9]);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

// Indexes for better query performance
personSchema.index({ personName: 'text' });
personSchema.index({ personGroups: 1, isActive: 1 });

// Virtual for age calculation
personSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Query helper for active persons
personSchema.query.active = function() {
  return this.where({ isActive: true });
};

module.exports = mongoose.model("Person", personSchema);