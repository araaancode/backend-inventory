const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
  token: {
    type: String,
    required: true,
  },
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token