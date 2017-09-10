const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: '请输入分类名！',
  },
  description: {
    type: String,
    required: '请输入分类介绍',
  },
});

module.exports = mongoose.model('Category', categorySchema);
