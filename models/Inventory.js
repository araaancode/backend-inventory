// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true
    },
    currentStock: {
        type: Number,
        default: 0
    },
    currentSecondaryStock: {
        type: Number,
        default: 0
    },
    allocatedStock: {     
        type: Number,
        default: 0
    },
    allocatedSecondaryStock: {
        type: Number,
        default: 0
    },
    lowStockAlert: {
        type: Boolean,
        default: false
    },
    lastRestocked: {
        type: Date
    },
    stockMovements: [{
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['purchase', 'sale', 'return', 'adjustment'] },
        quantity: Number,
        secondaryQuantity: Number,
        reference: String  // Could be order ID, purchase ID, etc.
    }]
}, { timestamps: true });

// Update lowStockAlert whenever stock changes
inventorySchema.pre('save', function(next) {
    const product = this.populated('product') || this.product;
    if (product && product.minStock) {
        this.lowStockAlert = this.currentStock <= product.minStock;
    }
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);