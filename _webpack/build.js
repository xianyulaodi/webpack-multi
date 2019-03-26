'use strict'
// require('./check-versions')()

process.env.NODE_ENV = 'production';

const ora = require('ora'); // 终端显示的转轮loading
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const commander = require('./lib/cmd');
const product = commander.dirname;
const cwd = path.resolve(__dirname, '../');
const webpack = require('webpack');

const webpackConfig = require('./webpack.prod.conf')(cwd, product, null);

const spinner = ora('building for production...')
spinner.start()

// 删除已编译文件
rm(path.resolve(cwd, `${product}/dist`), err => {
  if (err) throw err

  // 在删除完成的回调函数中开始编译
  webpack(webpackConfig, function (err, stats) {
    spinner.stop() // 停止loading
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('Build complete.\n'));
  })
})
