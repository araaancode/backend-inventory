// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    // 1. Core References
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product reference is required'],
        index: true
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: [true, 'Warehouse reference is required'],
        index: true
    },

    // 2. Stock Levels
    currentStock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    currentSecondaryStock: {
        type: Number,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    reservedStock: {
        type: Number,
        min: [0, 'Reserved stock cannot be negative'],
        default: 0
    },

    // 3. Stock Alerts
    lowStockThreshold: {
        type: Number,
        min: [0, 'Threshold cannot be negative'],
        default: 5
    },
    lastStockUpdate: {
        type: Date,
        default: Date.now
    },

    // 4. Location Details
    location: {
        aisle: String,
        shelf: String,
        bin: String
    },

    // 5. Metadata
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for available stock (current - reserved)
inventorySchema.virtual('availableStock').get(function() {
    return this.currentStock - this.reservedStock;
});

// Compound index for product+warehouse uniqueness
inventorySchema.index(
    { product: 1, warehouse: 1 },
    { unique: true }
);

// Update timestamp on stock changes
inventorySchema.pre('save', function(next) {
    if (this.isModified('currentStock')) {
        this.lastStockUpdate = Date.now();
    }
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);