const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const commander = require('./_webpack/lib/cmd');
const product = commander.product;


module.exports = {
    entry: './src/index.js', // 入口文件
    output: {
        filename: 'main.js',    // 打包后的文件名称
        path: path.resolve(__dirname, 'dist')  // 打包后的目录
    },
    module: {
        rules: [
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
            components: path.resolve(__dirname, 'src/components/') // 别名
        },
        extensions: ['.js', '.json'], // 忽略文件后缀
        modules: ['node_modules']
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            inject: true,
            hash: true,
            chunksSortMode: 'none' //如使用webpack4将该配置项设置为'none'
        }),
        new ExtractTextPlugin("css/styles.css"), 
        new OptimizeCssAssetsPlugin({ // 优化css
            cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
            cssProcessorOptions: {
                discardComments: { removeAll: true }
            },
            canPrint: true //是否将插件信息打印到控制台
        })
    ],
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        port: 3002,
    },
};