const mongoose = require('mongoose');

const Tag = mongoose.model('Tag');
const Article = mongoose.model('Article');

exports.searchTags = async (req, res) => {
  const query = new RegExp(`^${req.query.tag}`, 'gi');
  const tags = await Tag.find({ name: query });
  res.json(tags);
};

exports.addTag = async (req, res) => {
  const tag = {
    name: req.body.name,
    description: req.body.description,
  };

  const tagExists = await Tag.findOne({ name: tag.name });
  if (tagExists) {
    return res.json({ status: 1, data: { name: '标签已存在' } });
  } else {
    const newTag = new Tag(tag).save();
    return res.json({ status: 0, data: { id: newTag.id, name: newTag.name } });
  }
};

exports.getTags = async (req, res) => {
  const tags = await Article.getTagsList();
  res.render('tags', { tags });
};
