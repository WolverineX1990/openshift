/*
* @Author: zhengchangjun
* @Date:   2018-02-06 15:51:50
* @Last Modified by:   zhengchangjun
* @Last Modified time: 2018-02-06 18:05:05
*/
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var argv = require('yargs').argv;

var sourcemap = argv.sourcemap;
var name = argv.env == 'local' ? 'id' : 'hash:8';
module.exports = {
    entry: {
        app: path.resolve(__dirname, './view')
    },
    devtool: sourcemap ? 'source-map' : false,
    output: {
        publicPath: '',
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[' + name + '].js',
        chunkFilename: 'js/[chunkhash:8].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('./dist', {
            root: './dist' // 需要指定根目录，才能删除项目外的文件夹
        }),

        // 处理html模板
        new HtmlWebpackPlugin({
            template: './view/index.html',
            filename: 'index.html',
            minify: {    //压缩HTML文件
                removeComments: true,    //移除HTML中的注释
                collapseWhitespace: false    //删除空白符与换行符
            }
        })
    ]
};