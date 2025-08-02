const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

// !!! This configuration is NOT production ready.

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: outputPath,
  },
  entry: {
    main: ['webpack-hot-middleware/client', './client/index.js'],
  },
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
    clean: true, // cleanup dist folder on each build
    publicPath: '/', // webpack-dev-server location
  },
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.([jt]sx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            // options: {
            //   plugins: ['react-refresh/babel'],
            // },
          },
        ],
      },
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'whm',
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Code Challenge',
      template: path.resolve(__dirname, 'client/index.template.html'),
    }),
  ],
};