const mongoose = require('mongoose');
const validator = require('validator');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Notification must belong to a user'],
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user !== null;
      },
      message: 'No user found with this ID'
    }
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: {
      values: ['system', 'order', 'payment', 'promotion', 'alert'],
      message: 'Notification type must be system|order|payment|promotion|alert'
    },
    required: [true, 'Notification type is required']
  },
  status: {
    type: String,
    enum: {
      values: ['unread', 'read', 'archived'],
      message: 'Status must be unread|read|archived'
    },
    default: 'unread'
  },
  relatedEntity: {
    type: mongoose.Schema.ObjectId,
    refPath: 'relatedEntityModel',
    validate: {
      validator: async function(value) {
        if (!value || !this.relatedEntityModel) return true;
        const model = mongoose.model(this.relatedEntityModel);
        const doc = await model.findById(value);
        return doc !== null;
      },
      message: 'Referenced document does not exist'
    }
  },
  relatedEntityModel: {
    type: String,
    enum: {
      values: ['Order', 'Product', 'Subscription', 'Payment'],
      message: 'Related model must be Order|Product|Subscription|Payment'
    }
  },
  priority: {
    type: Number,
    enum: [1, 2, 3], // 1=high, 2=medium, 3=low
    default: 2
  },
  actionUrl: {
    type: String,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: 'Action URL must be a valid URL',
      protocols: ['http', 'https'],
      require_protocol: true
    }
  },
  expiresAt: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Default 30-day expiration
      return date;
    },
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiration date must be in the future'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
});

// Automatic status update for expired notifications
notificationSchema.pre('save', function(next) {
  if (this.expiresAt && new Date() >= this.expiresAt) {
    this.status = 'archived';
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);