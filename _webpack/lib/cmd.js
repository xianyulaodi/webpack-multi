'use strict';
const program = require('commander');
const fs = require('fs');
const path = require('path');

let argv;
try {
  // 通过 npm run dev 的方法执行的时候，参数更换获取方式
  argv = JSON.parse(process.env.npm_config_argv).original;
}	catch (e) {
  argv = process.argv;
}

program
    .version('0.1.0')
    .option('--dirname <dirname>', '编译目录')
    .option('-p, --port <n>', '端口号')
    .parse(argv);

const dirname = program.dirname;

if(!fs.existsSync(path.resolve(__dirname, `../../${dirname}`))) {
    throw `${dirname}项目不存在`
}

module.exports = program;
