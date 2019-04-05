'use strict'

// process.env.NODE_ENV = 'production';

const ora = require('ora'); // 终端显示的转轮loading
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const commander = require('./lib/cmd');
const dirname = commander.dirname;
const cwd = path.resolve(__dirname, '../');
const webpack = require('webpack');
const fs = require('fs');


let proWebpackConf = require('./webpack.prod.conf');
let localWebpackConf = path.resolve(cwd, `${dirname}/webpack.pro.conf.js`);
if (fs.existsSync(localWebpackConf)) { // 如果项目下有webpack.dev.conf,则使用该配置，覆盖掉公有的配置
    proWebpackConf = require(localWebpackConf);
}
const webpackConfig = proWebpackConf(cwd, dirname, null); // webpack的配置

const spinner = ora('building for production...')
spinner.start()

// 删除已编译文件
rm(path.resolve(cwd, `${dirname}/dist`), err => {
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
