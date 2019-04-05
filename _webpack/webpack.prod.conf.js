'use strict'
const path = require('path');
// const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const fs = require('fs');


module.exports = (cwd, dirname = null, outputPath = null) => {
    let baseWebpackConfig = require('./webpack.base.conf')(cwd, dirname, outputPath);
    const localWebpackConf = path.resolve(cwd, `./${dirname}/webpack.base.conf.js`);
    // 如果该产品目录下有webpack.base.conf.js，则使用该产品下的配置
    if (fs.existsSync(localWebpackConf)) {
        baseWebpackConfig = require(localWebpackConf)(cwd, dirname, outputPath);
    }
    return merge(baseWebpackConfig, {
        devtool: false,
        mode: 'production',
        optimization: {
            minimize: true
        },
        // optimization: {
        //     minimizer: [
        //         new UglifyJsPlugin({ // 编译es6会有问题
        //             parallel: true,
        //             sourceMap: true
        //         })
        //     ]
        // },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"pro"' // 注入到页面中的环境变量，比如用于在开发环境才引入mockjs
                }
            }),
            new CleanWebpackPlugin({
                default: ['dist'],
                verbose: true,
                dry: false
            }),
            // 复制静态资源,将static文件内的内容复制到指定文件夹
            new CopyWebpackPlugin([
                {
                    from: path.resolve(cwd, `${dirname}/static`),
                    to: path.resolve(cwd, `${dirname}/dist/static`),
                    ignore: ['.*'] // 忽视.*文件
                }
            ]),
            new webpack.HotModuleReplacementPlugin(),
        ]
    });

}
