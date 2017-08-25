const mongoose = require('mongoose');
const axios = require('axios');
const promisify = require('es6-promisify');
const md5 = require('md5');
const slug = require('slugs');

const Category = mongoose.model('Category');
const Article = mongoose.model('Article');

const findOrCreate = async (category) => {
  const result = await Category.findOneAndUpdate({ name: category.name }, category);
  if (result) return 'updated';

  await new Category(category).save();
  return 'create';
};

exports.adminHome = (req, res) => {
  res.redirect('/admin/article/create');
};

exports.articleForm = async (req, res) => {
  const categories = await Category.find();
  res.render('createArticle', { title: '创建文章', categories });
};

exports.categoryForm = (req, res) => {
  res.render('createCategory', { title: '创建分类' });
};

exports.createArticle = async (req, res) => {
  // 1. validate user input
  req.sanitize('title');
  req.checkBody('title', '标题不能为空').notEmpty();

  req.sanitize('content');
  req.checkBody('content', '内容不能为空').notEmpty();

  const article = req.body;

  // 2. translate and slug the title
  // 2.1 translate
  const title = req.body.title;
  const appKey = process.env.YOUDAO_APPKEY;
  const salt = Math.random();
  const sign = md5(`${appKey}${title}${salt}${process.env.YOUDAO_SECRET_KEY}`);
  const url = encodeURI(`http://openapi.youdao.com/api?q=${title}&from=zh-CHS&to=EN&appKey=${appKey}&salt=${salt}&sign=${sign}`);

  // 2.2 get translate result
  // axios.get(url).then(res => {
  //   article.slug = slug(res.data.translation[0]);
  //   return new Promise(resolve => resolve());
  // }).then(() => {
  //   // 3. save it!
  // });

  const articleModel = new Article(article);
  const saveArticle = promisify(articleModel.save, articleModel);
  saveArticle().then((data) => {
    res.json({ status: 1, text: '发布成功！', link: `/article/${data.slug}` });
  });
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
