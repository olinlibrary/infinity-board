const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname);
const APP_DIR = path.resolve(__dirname, 'app', 'src');

module.exports = (env = {}) => {
  const dev = ('dev' in env);

  return {
    devtool: 'source-map',
    entry: `${APP_DIR}/index.jsx`,
    output: {
      path: BUILD_DIR,
      publicPath: '/',
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?/,
          include: APP_DIR,
          loader: 'babel-loader',
        },
        {
          test: /\.svg$/,
          loaders: 'raw-loader',
        },
        {
          test: /\.css$/,
          include: APP_DIR,
          loaders: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new webpack.DefinePlugin({ LOCALDEV: JSON.stringify(dev) })
    ],
}
};
