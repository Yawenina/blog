const express = require('express');
const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');
const tagController = require('../controllers/tagController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();
const adminRoute = require('./adminRoute');

// blog
router.get('/', articleController.getArticles);
router.get('/blog/page/:page', articleController.getArticles);
router.get('/article/:slug', articleController.getArticleBySlug);
router.get('/tags', tagController.getTags);
router.get('/tags/:tag', articleController.getArticleByTag);

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
  adminRoute,
);
router.post('/admin*',
  authController.isLoggedIn,
  authController.isAdmin,
  adminRoute,
);

module.exports = router;
