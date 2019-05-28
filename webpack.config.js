const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
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
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'ldreact'),
                ],
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

    resolve: {
        modules: [ // 优化模块查找路径
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules') // 指定node_modules所在位置 当你import 第三方模块时 直接从这个路径下搜索寻找
        ],
        alias: {
            components: path.resolve(__dirname, 'src/components/'),
            mock: path.resolve(__dirname, 'mock'),
            ldreact: path.resolve(__dirname, 'ldreact')
        },
        extensions: ['.js', '.jsx']
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 9000,
        open: true,
        hot: true,
        inline: true
    }
};
