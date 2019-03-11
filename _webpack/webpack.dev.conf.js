'use strict'
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
const commander = require('./lib/cmd');
const product = commander.product;

const localWebpackConf = path.resolve(__dirname, `${product}/webpack.base.conf.js`);
// 如果该产品目录下有webpack.base.conf.js，则使用该产品下的配置
if (fs.readFileSync(localWebpackConf)) { 
    baseWebpackConfig = require(localWebpackConf);
}

module.exports = merge(baseWebpackConfig, {
    devtool: '#cheap-module-eval-source-map',
})
