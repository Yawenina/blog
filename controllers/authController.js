const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: '登录失败',
  successRedirect: '/admin',
});

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', '你需要先登录才能进行操作');
  res.redirect('/login');
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    req.flash('error', '没有权限');
    res.redirect('/');
  }
  
  return next();
};
