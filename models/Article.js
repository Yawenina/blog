const mongoose = require('mongoose');
const slug = require('slugs');

const Schema = mongoose.Schema;
const getTitleSlug = require('../helpers').getTitleSlug;

const articleShema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  slug: String,
  title: {
    type: String,
    trim: true,
    required: '请输入标题！',
  },
  tags: [{ type: String, ref: 'Tag' }],
  category: {
    type: Schema.Types.ObjectId,
    required: '请选择分类!',
    ref: 'Category',
  },
  content: {
    type: String,
    required: '请输入文章内容！',
  },
});

async function setArticleSlug(next) {
  if (!this.isModified('title')) {
    // if title doesn't modified, skip it!
    next();
    return;
  }

  // get the new slug
  let articleSlug = await getTitleSlug(this.title);
  articleSlug = slug(articleSlug);
  // find a slugs that has the title title-1 pattern
  const slugRegEx = new RegExp(`^(${articleSlug})(((-/d*)$)?)$`, 'i');
  const articlesWithSlug = await this.constructor.find({ slug: slugRegEx });

  this.slug = articlesWithSlug.length ? `${articleSlug}-${articlesWithSlug.length + 1}` : articleSlug;
  next();
}

function autopopulate(next) {
  this.populate({ path: 'tagIds' });
  next();
}

articleShema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

articleShema.pre('save', setArticleSlug);
articleShema.pre('find', autopopulate);
articleShema.pre('findOne', autopopulate);

module.exports = mongoose.model('Article', articleShema);
