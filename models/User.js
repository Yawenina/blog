const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, '不合法的邮箱地址'],
    required: '请输入邮箱',
  },
  isAdmin: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model(userSchema);
