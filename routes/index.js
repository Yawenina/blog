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
