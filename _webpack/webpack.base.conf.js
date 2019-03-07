const fs = require('fs');
const commander = require('./lib/cmd');

const product = commander.dirname;

module.exports = {
    entry: './src/index.js', // 入口文件
    output: {
        filename: 'main.js',    // 打包后的文件名称
        path: path.resolve(__dirname, 'dist')  // 打包后的目录
    },
}