const mongoose = require('mongoose');

const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.registerForm = (req, res) => {
  res.render('register', { title: '注册' });
}

exports.validateRegister = (req, res, next) => {
  req.checkBody('email', '邮箱不正确').notEmpty().isEmail();
  req.sanitize('email').normalizeEmail({
    all_lowercase: true,
  });

  req.checkBody('password', '密码不能为空').notEmpty();
  req.checkBody('confirm-password', '确认密码不能为空').notEmpty();
  req.checkBody('confirm-password', '两次输入密码不一致').equals(req.body.password);

  // handle validator result
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      req.flash('error', result.array().map(err => err.msg));
      res.render('register', { body: req.body });
      return;
    }
    next();
  });
};

exports.register = async (req, res) => {
  const user = new User({ email: req.body.email });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  req.flash('success', '注册成功');
  res.redirect('/');
};

exports.loginForm = (req, res) => {
  res.render('login', { title: '登录' });
};
