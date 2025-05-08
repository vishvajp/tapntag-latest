const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib"),
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "assert": require.resolve("assert/"),
    "url": require.resolve("url/"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser.js"),
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'process': 'process/browser.js',
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
}; 