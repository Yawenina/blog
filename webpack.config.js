const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const vue = {
  test: /\.vue$/,
  use: ['vue-loader'],
};

const javascript = {
  test: /\.js$/,
  use: [
    {
      loader: 'babel-loader',
      options: { presets: 'es2015' },
    },
  ],
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() {
      return [autoprefixer()];
    },
    sourceMap: true,
  },
};

const styles = {
  test: /\.(s)*css$/,
  use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap']),
};

// basic config
const config = {
  entry: {
    App: './public/javascripts/app.js',
    Admin: './public/javascripts/admin.js',
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [vue, javascript, styles],
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
};

// uglify js
const uglify = new webpack.optimize.UglifyJsPlugin();

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify);
}

module.exports = config;
