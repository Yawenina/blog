const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');
const articleController = require('../controllers/articleController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/admin', adminController.adminHome);
router.get('/admin/article/create', catchErrors(adminController.articleForm));
router.post('/admin/article/create', catchErrors(articleController.createArticle));

router.get('/admin/category/create', adminController.categoryForm);
router.post('/admin/category/create', adminController.createCategory);

router.get('/admin/article/edit', adminController.articleList);

router.get('/admin/article/edit/:id', adminController.editArticleForm);

router.post('/admin/article/update/:id', adminController.updateArticle);
router.get('/admin/article/delete/:id', adminController.deleteArticle);

module.exports = router;
