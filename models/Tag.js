const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: '请输入标签名！',
    ref: 'Article',
  },
  description: {
    type: String,
    required: '请输入标签介绍',
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

tagSchema.virtual('articles', {
  ref: 'Article',
  localField: 'name',
  foreignField: 'tags',
});

module.exports = mongoose.model('Tag', tagSchema);
