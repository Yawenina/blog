const mongoose = require('mongoose');

const Category = mongoose.model('Category');
const Article = mongoose.model('Article');

const { findOrCreate } = require('../helpers');

exports.adminHome = (req, res) => {
  res.redirect('/admin/article/create');
};

exports.articleForm = async (req, res) => {
  const categories = await Category.find();
  res.render('admin/createArticle', { title: '创建文章', categories });
};

exports.editArticleForm = async (req, res) => {
  const article = await Article.findOne({ _id: req.params.id });
  const categories = await Category.find();
  res.render('admin/editArticle', { title: '编辑文章', article, categories });
};

exports.categoryForm = (req, res) => {
  res.render('admin/createCategory', { title: '创建分类' });
};

exports.createCategory = async (req, res) => {
  req.sanitize('name');
  req.checkBody('name', '名称不能为空！').notEmpty();

  req.sanitize('desc');
  req.checkBody('desc', '描述不能为空！').notEmpty();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      const category = {
        name: req.body.name,
        description: req.body.desc,
      };

      findOrCreate({ name: category.name }, Category, category).then((status) => {
        if (status === 'create') {
          req.flash('success', '创建成功！');
        } else {
          req.flash('success', '分类更新成功！');
        }
        res.redirect('/admin/category/create');
      });
    } else {
      req.flash('error', result.array().map(err => err.msg));
      res.redirect('/admin/category/create');
    }
  });
};
