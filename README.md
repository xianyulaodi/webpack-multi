# 基于webpack4.x项目实战2 - 配置一次，多个项目运行

不久前，写过一篇webpack4的简单实践，传送门： [基于webpack4.x项目实战](https://juejin.im/post/5c7a9f27f265da2dca387dc9)，今天我们继续来webpack4.x的实战第二部分，只需要配置一次，就可以多个项目一起使用。

## 使用场景：
1. 非外包项目,因为外包项目一般只有一个产品
2. 我们的项目都使用vue或者react，统一一个框架，本文基于vue
3. 我们不想每次开发一个项目都复制粘贴一个webpack配置，而且希望只配置一次，每个项目都可以通用
4. 我们可以引用公共项目的代码，所有项目共享。
5. 可以自定义个别项目的webpack配置，灵活配置


## 一些目录结构 

在这里，我们有一个约定：
1. 单页面，页面名称都为index.html
2. 入口文件都为该项目src下的main.js
3. 一些静态文件，也就是我们不想打包的文件，如一些配置等，放在和index.html同级目录下的static目录中
4. 打包后的文件放在dist目录下


我们的目录结构如下：···
> 到时用tree生成

1. `_webpack`：用来存放webpack、node的一些配置文件，主要用来打包编译
2. `common`：用来存放我们的一些公共文件，比如一些常用的工具脚本，常用组件等等
3. `demo1/demo2`：就是我们开发项目的目录


开发环境：
我们执行`npm run dev --dirname=产品名`，如`npm run dev --dirname=demo`来进行开发，如果指定端口，可以为`npm run dev --dirname=demo1 --port=8080`

生产环境：
我们执行`npm run build --dirname=产品名`，如`npm run build --dirname=demo1`来进行打包编译

## 代码解析


#### 命令脚本`_webpack/lib/cmd.js`

```javascript
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
    .option('-d, --dirname <dirname>', '编译目录')
    .option('-p, --port <n>', '端口号')
    .parse(argv);

const dirname = program.dirname;

if(!fs.existsSync(path.resolve(__dirname, `../../${dirname}`))) {
    throw `${dirname}项目不存在`
}

module.exports = program;

```
我们引入了`commander`这个库来接收一些命令，比如产品名`--dirname=xxx`(也可以为`-d xxx`)、端口号`--port=xxx`，这样，我们就可以通过在命令行接受我们的一些定制的命令了，如果没有找到你输入的产品名，直接抛出异常。

**注意点**：如果想通过在package.json中设置来接受我们的命令，则下面这一段是必须的
```javascript
try {
  // 通过 npm run dev 的方法执行的时候，参数更换获取方式
  argv = JSON.parse(process.env.npm_config_argv).original;
}	catch (e) {
  argv = process.argv;
}
```
这样，我们就可以通过`npm run dev --dirname=xxx --port=xxx`来执行我们的命令了

#### 基础webpack配置 `_webpack/webpack.base.conf.js`

* 入口文件
```javascript
...
let entryFilePath = path.resolve(cwd, `${dirname}/src/main.js`);
if (!fs.existsSync(entryFilePath)) {
    entryFilePath = path.resolve(cwd, 'common/src/main.js');
}
return {

    entry: {
        lib: ['vue', 'vuex'],
        main: ['webpack-hot-middleware/client?noInfo=true&reload=true', entryFilePath]
    }, // 入口文件

    output: {
        filename: 'js/[name].js',    // 打包后的文件名称
        path: path.resolve(cwd, `${dirname}/dist`)  // 打包后的目录
    }
    ...
}
```
我们将vue、vuex这些单独打包，入口文件为我们的`main.js`,如果项目下没有这个文件，则去寻找`common`下的`main.js`,打包后为`lib.js`和`main.js`，放在dist目录下。

* 一些loader

```javascript
const fs = require('fs');
const path = require('path');
const webpack = require('webpack')
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.env.NODE_ENV == 'development'; // 是否是开发环境
...
module: {
    rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.(le|c)ss$/,
            use: [
                devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'less-loader'
            ],
        },
        {
            test: /\.(png|svg|jpg|gif)$/, // 加载图片
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,  // 小于8k的图片自动转成base64格式
                    name: 'images/[name].[ext]?[hash]', // 图片打包后的目录
                    publicPath: '../'  // css图片引用地址
                },
            }]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/, // 加载字体文件
            use: [
                'file-loader'
            ]
        },
        // 转义es6
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: /src/,          // 只转化src目录下的js
            exclude: /node_modules/, // 忽略掉node_modules下的js
        }
    ]
},
...
```

1. 支持vue
由于项目基于Vue，所以需要`vue-loader`

2. 支持CSS

加入`css-loader` 、`less-loader`(如果你们项目是用scss,也可以引入`scss-loader`)
支持自动加css3前缀，引入了`postcss-loader`，需要和`autoprefixer`一起使用。在根目录下新建`./postcss.config.js`文件，里面的内容为
```javascript
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
package.json中需要这样写
```json
"browserslist": [
    "> 1%", // 值越小，支持的浏览器返回更广
    "last 2 versions",
    "not ie <= 8"
],
```

3. 支持图片
引入`url-loader`来加载图片，打包后的图片放在images文件夹中，在引用图片时，自动加入hash值

4. 支持es6
引入`babel-loader`

5. CSS优化
引入`mini-css-extract-plugin`这个插件对生产环境的CSS进行优化，这里需要注意的是，webpack4.x建议用`mini-css-extract-plugin`替换`extract-text-webpack-plugin`

* resolve
```javascript
resolve: {
    // 创建import别名
    alias: {
        $common: path.resolve(cwd, 'common/src'),
        $components: path.resolve(cwd, `${dirname}/src/components`),
        'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.json'], // 忽略文件后缀
    modules: [  
        // 引入模块的话，先从node_modules中查找，其次是当前产品的src下，最后是common的src下
        path.resolve(cwd, 'node_modules'),
        path.resolve(cwd, `${dirname}/src`),
        path.resolve(cwd, 'common/src')
    ]
},
```
* resolve中，我们创建了一些别名，支持Vue必须引入的`vue$`,省略掉js和json的后缀等等

* modules这里就比较好玩了，如果我们在代码中`import dialog from utils/dialog.vue`,它会先去node_modules下查找，如果没找到，则去当前项目下的src查找，如果还是没有，则去common下的src去查找,这样有什么好处呢?

如果我们的common目录下有一个dialog.vue文件，如：`common/src/utils/dialog.vue`
在我们的项目中，如：项目A，引用这个dialog.vue文件，是可以直接`import dialog from utils/dialog.vue`这样引入的，即使我们的项目A里面没有`utils/dialog.vue`这个文件。
```tree

--common
  --src
    -- utils/dialog.vue
--projectA
  --src
    -- utils/dialog.vue
    --main.js // import dialog from utils/dialog.vue  来自于自己目录下
--projectB
  --src
    --main.js // import dialog from utils/dialog.vue 来自于common目录下
```

这样，当我们的项目A、项目B中存在很多的公用代码，可以把公共代码放在common中，项目A或B中，只要写少许代码，就可以完成一个项目，如果项目A中的dialog.vue比较特殊，则在项目A中新建同目录下的dialog.vue文件，即可覆盖掉common的文件,这样`import dialog from utils/dialog.vue`就来自于项目A, 而不是common了。从而达到，即可通用，又可定制的效果。如果项目A中的dialog.vue文件，只有一点点和common下的不同，则在dialog.vue中，继承于common即可


* 插件
```javascript
...
plugins: [
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
        template: path.resolve(cwd, `${dirname}/index.html`),
        filename: "index.html",
        inject: true,
        hash: true,
        minify: {
            removeComments: devMode ? false : true, // 删除html中的注释代码
            collapseWhitespace: devMode ? false : true, // 删除html中的空白符
            removeAttributeQuotes: devMode ? false : true // 删除html元素中属性的引号
        },
        chunksSortMode: 'dependency' // 按dependency的顺序引入
    }),
    new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: '[id].css'
    }),

    // 优化css
    new OptimizeCssAssetsPlugin({ 
        ssetNameRegExp: /\.css\.*(?!.*map)/g,
        cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
        cssProcessorOptions: { // 用postcss添加前缀，这里关掉
            autoprefixer: { 
                disable: true 
            },
            discardComments: {  // 移除注释
                removeAll: true
            }
        },
        canPrint: true // 是否将插件信息打印到控制台
    }),

    // 页面不用每次都引入这些变量
    new webpack.ProvidePlugin({
        Vue: ['vue', 'default'],
        Vuex: ['vuex', 'default']
    })
]
...
```
比较常用的一些插件，压缩css、js、html自动引入css、js等。上面就是我们webpack的基础配置。

#### 开发环境配置`_webpack/webpack.dev.conf.js`

```javascript
'use strict'
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
module.exports = (cwd, dirname = null, outputPath = null) => {
    let baseWebpackConfig = require('./webpack.base.conf')(cwd, dirname, outputPath);
    return merge(baseWebpackConfig, {
        mode: 'development',
        devtool: '#cheap-module-eval-source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin(), // 用于热加载
        ]
    });
    
}
```

#### 生产环境配置`_webpack/webpack.prod.conf.js`
```javascript
'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const fs = require('fs');

module.exports = (cwd, dirname = null, outputPath = null) => {
    let baseWebpackConfig = require('./webpack.base.conf')(cwd, dirname, outputPath);
    return merge(baseWebpackConfig, {
        devtool: false,
        mode: 'production',
        optimization: {
            minimize: true
        },
        plugins: [
            new CleanWebpackPlugin({
                default: ['dist'],
                verbose: true,
                dry: false
            }),
            // 复制静态资源,将static文件内的内容复制到指定文件夹
            new CopyWebpackPlugin([
                {
                    from: path.resolve(cwd, `${dirname}/static`),
                    to: path.resolve(cwd, `${dirname}/dist/static`),
                    ignore: ['.*'] // 忽视.*文件
                }
            ]),
        ]
    });

}
```
主要是压缩js、复制一些静态文件等等

## 开发环境服务 

#### 开发环境服务`_webpack/dev-server.js`

我们用expess来做服务器，如果你不想用公共的`webpack.dev.conf.js`,也可以在你的项目下新建`webpack.dev.conf.js`来自定义单独项目下的配置

```javascript
'use strict'
const path = require('path');
const commander = require('./lib/cmd');
const dirname = commander.dirname;
const port = commander.port || 3002; // 端口号
const cwd = path.resolve(__dirname, '../');
let devWebpackConf = require('./webpack.dev.conf.js');
let localWebpackConf = path.resolve(cwd, `${dirname}/webpack.dev.conf.js`);
if (fs.existsSync(localWebpackConf)) { // 如果项目下有webpack.dev.conf,则使用该配置，覆盖掉公有的配置
    devWebpackConf = require(localWebpackConf);
}
const webpackConfig = devWebpackConf(cwd, dirname, null); // webpack的配置
...

// 设置一些静态资源
const staticPath = path.resolve(cwd, `${dirname}/static`);
app.use('/static', express.static(staticPath));
...
```
一些产品名，基本路径都是从这里传入你的webpack配置里面去。具体内容可以看`dev-server.js`

## 编译服务

#### 生产环境服务`_webpack/build.js`

```javascript
'use strict'
const ora = require('ora'); // 终端显示的转轮loading
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const commander = require('./lib/cmd');
const product = commander.dirname;
const cwd = path.resolve(__dirname, '../');
const webpack = require('webpack');

let proWebpackConf = require('./webpack.pro.conf.js');
let localWebpackConf = path.resolve(cwd, `${dirname}/webpack.pro.conf.js`);
if (fs.existsSync(localWebpackConf)) { // 如果项目下有webpack.dev.conf,则使用该配置，覆盖掉公有的配置
    proWebpackConf = require(localWebpackConf);
}
const webpackConfig = proWebpackConf(cwd, dirname, null); // webpack的配置
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

```
如果不想用公用编译，同理，也可以在独自的项目下新建`webpack.pro.conf.js`来覆盖掉公共的编译配置

## 结尾

代码地址： [https://github.com/xianyulaodi/webpack-multi](https://github.com/xianyulaodi/webpack-multi)

代码中有两个demo：
demo1的webpack配置是定制的，它的入口可以为index.js,demo1也举例了引用common文件的情况
demo2基于vue,支持开发环境引入mock，打包后mock移除

这样，我们就完成了我们的webpack配置，只需要配置一次，多个项目公用一套配置，如果common目录下有的组件，单独项目下可以直接使用，支持单独项目覆盖掉公用组件以及覆盖掉公用webpack配置，做到既公用，又解耦。尤其适用于项目A、B、C只有少部分功能有差异的情况。

