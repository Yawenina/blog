const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const glob = require('glob-all');
const PurifyCSSPlugin = require('purifycss-webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const inProduction = process.env.NODE_ENV === 'production';

const vue = {
  test: /\.vue$/,
  use: 'vue-loader',
};

const javascript = {
  test: /\.(js)$/,
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] },
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
    // process css
    new ExtractTextPlugin('[name].css'),
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, 'views/blog/*.pug'),
        path.join(__dirname, 'views/admin/*.pug'),
        path.join(__dirname, 'views/mixins/*.pug'),
        path.join(__dirname, 'views/*.pug'),
      ]),
      minimize: inProduction,
      purifyOptions: {
        whitelist: ['*markdown*', '*js*'],
      },
    }),
    // moment config
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/locale$/),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /zh-cn/),
    // analysis bundler
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.common.js',
    },
  },
  stats: {
    children: false,
  },
};

if (inProduction) {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }));
}

module.exports = config;
