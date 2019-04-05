'use strict'

// 这里是定制的举例，比如demo1的入口文件就是和其他项目不同，为index.js，打包后也叫index.js

const path = require('path');

module.exports = (cwd, dirname = null, outputPath = null) => {
    let baseWebpackConfig = require('../_webpack/webpack.base.conf')(cwd, dirname, outputPath);
    let entryFilePath = path.resolve(cwd, `${dirname}/src/index.js`);
    return Object.assign(baseWebpackConfig, {
        entry: {
            lib: ['vue', 'vuex'],
            index: ['webpack-hot-middleware/client?noInfo=true&reload=true', entryFilePath]
        }
    });
    
}
