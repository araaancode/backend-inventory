// models/InventoryMovement.js
const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product reference is required']
    },
    user: {  // Who performed the action
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movementType: {
        type: String,
        required: true,
        enum: ['purchase', 'sale', 'return', 'adjustment', 'transfer']
    },
    quantity: {
        type: Number,
        required: true,
        min: [0.01, 'Quantity must be at least 0.01']
    },
    secondaryQuantity: {
        type: Number,
        min: [0, 'Quantity cannot be negative']
    },
    referenceId: {
        type: String,
        required: true
    },
    fromLocation: String,  // Warehouse A
    toLocation: String,   // Warehouse B
    cost: {  // For inventory valuation (optional)
        type: Number,
        min: 0
    },
    notes: {
        type: String,
        maxlength: 200
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Auto-update product stock on movement
movementSchema.post('save', async function(doc) {
    const Product = mongoose.model('Product');
    const update = {};

    if (['purchase', 'return'].includes(doc.movementType)) {
        update.$inc = { 
            initialStock: doc.quantity,
            ...(doc.secondaryQuantity && { initialSecondaryStock: doc.secondaryQuantity })
        };
    } else if (doc.movementType === 'sale') {
        update.$inc = { 
            initialStock: -doc.quantity,
            ...(doc.secondaryQuantity && { initialSecondaryStock: -doc.secondaryQuantity })
        };
    }

    if (Object.keys(update).length) {
        await Product.findByIdAndUpdate(doc.product, update);
    }
});

module.exports = mongoose.model('InventoryMovement', movementSchema);