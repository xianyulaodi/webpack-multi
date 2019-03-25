'use strict'
const path = require('path');
// const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const fs = require('fs');


module.exports = (cwd, dirname = null, outputPath = null) => {
    let baseWebpackConfig = require('./webpack.base.conf')(cwd, dirname, outputPath);
    const localWebpackConf = path.resolve(cwd, `./${dirname}/webpack.base.conf.js`);
    // 如果该产品目录下有webpack.base.conf.js，则使用该产品下的配置
    if (fs.existsSync(localWebpackConf)) {
        baseWebpackConfig = require(localWebpackConf);
    }
    return merge(baseWebpackConfig, {
        devtool: false,
        mode: 'production',
        // output: {
        //     path: path.resolve(cwd, `${dirname}/dist`),
        //     filename: utils.assetsPath('js/[name].[chunkhash].js'),
        //     chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        // },
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

            // new OptimizeCSSPlugin({
            //     cssProcessorOptions: {
            //         safe: true,
            //         discardComments: { removeAll: true }
            //     }
            // }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(cwd, `${dirname}/static`),
                    to: path.resolve(cwd, `${dirname}/dist/static`),
                    ignore: ['.*']
                },
                // {
                //     from: path.resolve(cwd, `${dirname}/index.html`),
                //     to: path.resolve(cwd, `${dirname}/dist/index.html`),
                //     ignore: ['.*']
                // }
            ]),
        ]
    });

}
