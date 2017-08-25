const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const Tag = mongoose.model('Tag');

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
