const express = require('express');
const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');
const tagController = require('../controllers/tagController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();
const adminRoutes = require('./adminRoutes');

// blog
router.get('/', catchErrors(articleController.getArticles));
router.get('/blog/page/:page', catchErrors(articleController.getArticles));
router.get('/article/:slug', catchErrors(articleController.getArticleBySlug));
router.get('/tags', catchErrors(tagController.getTags));
router.get('/tags/:tag', catchErrors(tagController.getArticleByTag));

// register
router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
);

// login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

// api
router.get('/api/search/tags', catchErrors(tagController.searchTags));
router.post('/addTag', catchErrors(tagController.addTag));

// demos
const demos = [
  {
    title: '仿豆瓣网站',
    link: 'https://github.com/Yawenina/vue2-douban-city',
    imgs: ['/images/douban/1.PNG', '/images/douban/2.PNG', '/images/douban/3.PNG', '/images/douban/4.PNG'],
  },
  {
    title: 'Github 应用',
    link: 'https://github.com/Yawenina/react-github-explorer',
    imgs: ['/images/github/1.PNG', '/images/github/2.PNG', '/images/github/3.PNG', '/images/github/4.PNG'],
  },
];

router.get('/demos', (req, res) => {
  res.render('demos', { demos });
});

// admin
router.get('/admin*',
  authController.isLoggedIn,
  authController.isAdmin,
  adminRoutes,
);
router.post('/admin*',
  authController.isLoggedIn,
  authController.isAdmin,
  adminRoutes,
);

module.exports = router;
