'use strict'
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = (cwd, dirname = null, outputPath = null) => {
    let baseWebpackConfig = require('./webpack.base.conf')(cwd, dirname, outputPath);
    const localWebpackConf = path.resolve(cwd, `./${dirname}/webpack.base.conf.js`);
    // 如果该产品目录下有webpack.base.conf.js，则使用该产品下的配置
    if (fs.existsSync(localWebpackConf)) {
        baseWebpackConfig = require(localWebpackConf);
    }
    return merge(baseWebpackConfig, {
        mode: 'development',
        devtool: '#cheap-module-eval-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"dev"' // 注入到页面中的环境变量，比如用于在开发环境才引入mockjs
                }
            }),
            // 用于热加载
            new webpack.HotModuleReplacementPlugin(),
            // new webpack.NoEmitOnErrorsPlugin(),
        ]
    });
    
}
