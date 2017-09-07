const mongoose = require('mongoose');
const promisify = require('es6-promisify');

const Article = mongoose.model('Article');
const Tag = mongoose.model('Tag');

exports.createArticle = async (req, res) => {
  // 1. validate user input
  req.sanitize('title');
  req.checkBody('title', '标题不能为空').notEmpty();

  req.sanitize('content');
  req.checkBody('content', '内容不能为空').notEmpty();

  const article = req.body;

  const articleModel = new Article(article);

  const saveArticle = promisify(articleModel.save, articleModel);
  const newArticle = await saveArticle();

  res.json({ status: 1, text: '发布成功！', link: `/article/${newArticle.slug}` });
};

exports.articleList = async (req, res) => {
  const articles = await Article.find().sort({ created: 'desc' });
  res.render('admin/articleList', { title: '文章列表', articles });
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

exports.getArticles = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page - 1) * limit;

  const articlesPromise = Article
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });
  const countPromise = Article.count();

  const [articles, count] = await Promise.all([articlesPromise, countPromise]);

  const pages = Math.ceil(count / limit);

  if (!articles.length && skip) {
    req.flash('info', 'X﹏X 当前页面不存在， 返回至之前的页面哦~');
    return res.redirect(`/blog/page/${page}`);
  }

  res.render('articleList', { articles, page, pages });
};

exports.getArticleBySlug = async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) return next();
  res.render('article', { article });
};

exports.getArticleByTag = async (req, res) => {
  const tag = await Tag
    .findOne({ name: req.params.tag })
    .populate('articles');
  res.render('tagItem', { tag });
};
