const mongoose = require('mongoose');

const Category = mongoose.model('Category');
const Article = mongoose.model('Article');

const findOrCreate = async (category) => {
  const result = await Category.findOneAndUpdate({ name: category.name }, category);
  if (result) return 'updated';

  await new Category(category).save();
  return 'create';
};

exports.createCategory = async (req, res) => {
  req.checkBody('name', '名称不能为空！').notEmpty();
  req.checkBody('desc', '描述不能为空！').notEmpty();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      const category = {
        name: req.body.name,
        description: req.body.desc,
      };

      findOrCreate(category).then(status => {
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

exports.articleList = async (req, res) => {
  const articles = await Article.find().sort({ created: 'desc' });
  res.render('list', { title: '文章列表', articles });
};

exports.adminHome = (req, res) => {
  res.redirect('/admin/article/create');
};

exports.articleForm = async (req, res) => {
  const categories = await Category.find();
  res.render('admin/createArticle', { title: '创建文章', categories });
};

exports.categoryForm = (req, res) => {
  res.render('createCategory', { title: '创建分类' });
};

exports.editArticleForm = async (req, res) => {
  const article = await Article.findOne({ _id: req.params.id });
  const categories = await Category.find();
  res.render('editArticle', { title: '编辑文章', article, categories });
};

exports.updateArticle = async (req, res) => {
  const article = await Article.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  }).exec();
  res.json({ status: 1, text: '更新成功！', link: `/article/${article.slug}` });
};

exports.deleteArticle = async (req, res) => {
  await Article.findOneAndRemove({ _id: req.params.id }).exec();
  req.flash('success', '删除成功');
  res.redirect('/admin/article/edit');
};
