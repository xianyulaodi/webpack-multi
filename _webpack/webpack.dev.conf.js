'use strict'
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

console.log(888, process.env.NODE_ENV);

module.exports = (cwd, dirname = null, outpathPath = null) => {
    let baseWebpackConfig = require('./webpack.base.conf')(cwd, dirname, outpathPath);
    const localWebpackConf = path.resolve(cwd, `./${dirname}/webpack.base.conf.js`);
    // 如果该产品目录下有webpack.base.conf.js，则使用该产品下的配置
    if (fs.existsSync(localWebpackConf)) {
        baseWebpackConfig = require(localWebpackConf);
    }
    return merge(baseWebpackConfig, {
        devtool: '#cheap-module-eval-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"dev"' // 注入到页面中的环境变量
                }
            }),
        ]
    });
    
}
