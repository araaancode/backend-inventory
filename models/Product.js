// models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    // 1. Core Product Information
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [50, 'Title cannot exceed 50 characters'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [20, 'Description must be at least 20 characters'],
        maxlength: [350, 'Description cannot exceed 350 characters']
    },

    // 2. Visual Assets
    photo: {
        type: String,
        default: '',
        validate: {
            validator: (url) => !url || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url),
            message: 'Invalid photo URL format'
        }
    },
    photos: [{
        type: String,
        validate: {
            validator: (url) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url),
            message: 'Invalid image URL format'
        }
    }],

    // 3. Identification Codes
    productCode: {
        type: String,
        trim: true,
        uppercase: true,
        unique: true,
        sparse: true
    },
    barcode: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },

    // 4. Categorization
    mainCategory: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    subCategory: {
        type: String,
        trim: true,
        index: true
    },
    hashtags: {
        type: String,
        trim: true,
        set: (value) => value.replace(/\s+/g, '').toLowerCase()
    },

    // 5. Inventory Units
    unit: {
        type: String,
        trim: true,
        required: true,
        enum: ['piece', 'kg', 'g', 'L', 'm', 'box', 'pack'],
        default: 'piece'
    },
    hasSecondaryUnit: {
        type: Boolean,
        default: false
    },
    secondaryUnit: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return !this.hasSecondaryUnit || !!value;
            },
            message: 'Secondary unit is required when hasSecondaryUnit is true'
        }
    },
    secondaryUnitRatio: {
        type: Number,
        min: [0.01, 'Ratio must be at least 0.01'],
        validate: {
            validator: function(value) {
                return !this.hasSecondaryUnit || !!value;
            },
            message: 'Secondary unit ratio is required when hasSecondaryUnit is true'
        }
    },

    // 6. Stock Information
    initialStock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    initialSecondaryStock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    minStock: {
        type: Number,
        default: 0,
        min: [0, 'Minimum stock cannot be negative']
    },

    // 7. Pricing Structure
    purchasePrice: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        get: (price) => (price || 0).toFixed(2)
    },
    sellPrice: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
        get: (price) => (price || 0).toFixed(2)
    },
    purchasePriceSecondary: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        get: (price) => (price || 0).toFixed(2)
    },
    sellPriceSecondary: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        get: (price) => (price || 0).toFixed(2)
    },
    secondSellPrice: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        get: (price) => (price || 0).toFixed(2)
    },
    secondSellPriceSecondary: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        get: (price) => (price || 0).toFixed(2)
    },
    vatPercent: {
        type: Number,
        default: 0,
        min: [0, 'VAT cannot be negative'],
        max: [100, 'VAT cannot exceed 100%']
    },

    // 8. Logistics
    weight: {
        type: Number,
        min: [0, 'Weight cannot be negative']
    },
    length: {
        type: Number,
        min: [0, 'Length cannot be negative']
    },
    width: {
        type: Number,
        min: [0, 'Width cannot be negative']
    },
    height: {
        type: Number,
        min: [0, 'Height cannot be negative']
    },

    // 9. Documentation
    invoiceDescription: {
        type: String,
        trim: true,
        maxlength: [200, 'Invoice description too long']
    },
    minExpireWarningDays: {
        type: Number,
        min: [0, 'Days cannot be negative']
    },
    moreInfo: {
        type: String,
        trim: true
    },

    // 10. System Fields
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
        transform: function(doc, ret) {
            delete ret.__v; // Remove version key
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        getters: true
    }
});

// ======================
// VIRTUAL FIELDS
// ======================
productSchema.virtual('movements', {
    ref: 'InventoryMovement',
    localField: '_id',
    foreignField: 'product',
    options: {
        sort: { createdAt: -1 },
        limit: 50
    }
});

productSchema.virtual('inventory', {
    ref: 'Inventory',
    localField: '_id',
    foreignField: 'product'
});

// ======================
// INSTANCE METHODS
// ======================
productSchema.methods.getTotalStock = async function() {
    const inventoryRecords = await mongoose.model('Inventory').find({ product: this._id });
    return inventoryRecords.reduce((total, inv) => total + inv.currentStock, 0);
};

// ======================
// MIDDLEWARE
// ======================
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Auto-generate product code if not provided
    if (!this.productCode) {
        this.productCode = `PRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    
    next();
});

productSchema.post('save', function(doc, next) {
    // Create default inventory record if none exists
    mongoose.model('Inventory').updateOne(
        { product: doc._id },
        { $setOnInsert: { 
            product: doc._id,
            warehouse: 'default-warehouse-id', // Set your default warehouse
            currentStock: doc.initialStock,
            currentSecondaryStock: doc.initialSecondaryStock || 0
        }},
        { upsert: true }
    ).exec();
    next();
});

module.exports = mongoose.model('Product', productSchema);