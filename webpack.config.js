const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    entry: {
        index: './src/page/index',
        user: './src/page/user',
        d3: './src/page/d3',
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
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // 将 JS 字符串生成为 style 节点
                    "css-loader", // 将 CSS 转化成 CommonJS 模块
                    "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
                ]
            },
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
        }),
        new HtmlWebpackPlugin({
            title: 'd3',
            chunks: ['d3'],
            filename: 'd3.html',
            template: path.resolve(__dirname, './public/index.ejs')
        }),
    ],

    resolve: {
        modules: [ // 优化模块查找路径
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules') // 指定node_modules所在位置 当你import 第三方模块时 直接从这个路径下搜索寻找
        ],
        alias: {
            components: path.resolve(__dirname, 'src/components/'),
            page: path.resolve(__dirname, 'src/page/'),
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
