var program = require('commander');

program
    .version('0.1.0')
    .option('--dirname [dirname]', '编译目录')
    .option('-p, --port <n>', '端口号')
    .parse(process.argv);

if (program.dirname) console.log('  - dirname:' + program.dirname);
if (program.port) console.log('  - port:' + program.port);

module.exports = program;
