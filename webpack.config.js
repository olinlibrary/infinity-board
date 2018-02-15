var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname);
var APP_DIR = path.resolve(__dirname, 'app', 'src');

module.exports = {
    devtool:'source-map',
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        publicPath: "/",
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel-loader'
            },
            {
                test : /\.svg$/,
                loaders : 'raw-loader'
            },
            {
                test : /\.css$/,
                include : APP_DIR,
                loaders : ['style-loader', 'css-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
