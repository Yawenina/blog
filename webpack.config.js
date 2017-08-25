const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const vue = {
  test: /\.vue$/,
  use: 'vue-loader',
};

const javascript = {
  test: /\.(js)$/, // see how we match anything that ends in `.js`? Cool
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] }, // this is one way of passing options
  }],
  exclude: /node_modules/,
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

const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
  compress: { warnings: false }
});

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
    rules: [javascript, vue, styles],
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
  stats: {
    children: false,
  },
};

module.exports = config;
