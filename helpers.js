const axios = require('axios');
const md5 = require('md5');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');

exports.getTitleSlug = function(title) {
  const appKey = process.env.YOUDAO_APPKEY;
  const salt = Math.random();
  const sign = md5(`${appKey}${title}${salt}${process.env.YOUDAO_SECRET_KEY}`);
  const url = encodeURI(`http://openapi.youdao.com/api?q=${title}&from=zh-CHS&to=EN&appKey=${appKey}&salt=${salt}&sign=${sign}`);

  // get translate result
  return axios.get(url).then((res) => {
    return res.data.translation[0];
  });
};

// const findOrCreate = async (category) => {
//   const result = await Category.findOneAndUpdate({ name: category.name }, category);
//   if (result) return 'updated';

//   await new Category(category).save();
//   return 'create';
// };

exports.findOrCreate = async function(query, model, update) {
  const result = await model.findOneAndUpdate(query, update);

  if (result) return 'updated';

  await new model(update).save();
  return 'create';
};
