const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        app: './src/page/index'
    },

    output: {
        path: path.resolve(__dirname, 'build')
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'babel-loader?cacheDirectory'
                ]
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 9000,
        open: true,
        hot: true,
        inline: true,
        compress: true
    }
};
