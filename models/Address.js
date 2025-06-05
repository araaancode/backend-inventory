// models/Address.js

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    enum: ['home', 'work', 'store', 'other'],
    default: 'home',
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  street: {
    type: String,
    required: [true, 'Street is required'],
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    match: [/^\d{10}$/, 'Postal code must be exactly 10 digits'],
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    }
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
