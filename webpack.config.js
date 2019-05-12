const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        index: './src/page/index',
        user: './src/page/user'
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
            title: '原生react',
            chunks: ['index'],
            filename: 'index.html',
            template: path.resolve(__dirname, './public/index.ejs')
        }),
        new HtmlWebpackPlugin({
            title: '我的react',
            chunks: ['user'],
            filename: 'user.html',
            template: path.resolve(__dirname, './public/index.ejs')
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
