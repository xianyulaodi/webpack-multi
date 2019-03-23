const fs = require('fs');
const path = require('path');
const webpack = require('webpack')
const htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = (cwd, dirname = null, outputPath = null) => {

    let entryFilePath = path.resolve(cwd, `${dirname}/src/main.js`);
    if (!fs.existsSync(entryFilePath)) {
        let entryFilePath = path.resolve(cwd, 'common/src/main.js');
    }
    return {

        entry: {
            lib: ['vue', 'vuex'],
            main: entryFilePath,
        }, // 入口文件

        output: {
            filename: '[name].js',    // 打包后的文件名称
            path: path.resolve(cwd, `${dirname}/dist`)  // 打包后的目录
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({ // 拆分单独的css文件
                        fallback: "style-loader",
                        use: ['css-loader', 'postcss-loader'] // 加载css
                    })
                },
                // 加载less
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: ['css-loader', 'postcss-loader']
                    })
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
        resolve: {
            alias: {
                $common: path.resolve(cwd, 'common/src'),
                $components: path.resolve(cwd, `${dirname}/src/components`),
                'vue$': 'vue/dist/vue.esm.js',
            },
            extensions: ['.js', '.json'], // 忽略文件后缀
            modules: [
                path.resolve(cwd, 'node_modules'),
                path.resolve(cwd, `${dirname}/src`),
                path.resolve(cwd, 'common/src')
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new htmlWebpackPlugin({
                template: path.resolve(cwd, `${dirname}/index.html`),
                filename: "index.html",
                inject: true,
                hash: true,
                chunksSortMode: 'none' //如使用webpack4将该配置项设置为'none'
            }),
            new ExtractTextPlugin("css/main.css"),
            new OptimizeCssAssetsPlugin({ // 优化css
                cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
                cssProcessorOptions: {
                    discardComments: { removeAll: true }
                },
                canPrint: true //是否将插件信息打印到控制台
            }),
            // 页面不用每次都引入这些变量
            new webpack.ProvidePlugin({
                Vue: ['vue', 'default'],
                Vuex: ['vuex', 'default']
            })
        ],
        // devServer: server.devServer,
    }
};