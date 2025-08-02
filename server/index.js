const express = require('express');
const webpack = require('webpack');
const historyApiFallback = require('connect-history-api-fallback');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('../webpack.config.js');
const compiler = webpack(config);
const port = process.env.PORT || 3000;

// use any express routes (fallback should be defined in each route file)
app.use('/api', require('./api'));

// if not found in routes, use history fallback api
// (redirect to browser so react-router can pick it up)
app.use(historyApiFallback());

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.listen(port, function () {
  console.log(`express listening on port ${port}\n`);
});