const mongoose = require('mongoose');

const roleKeywordsSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  keywords: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
roleKeywordsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RoleKeywords', roleKeywordsSchema);
