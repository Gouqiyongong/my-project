const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
//用到的路径
module.exports = {
    //入口文件
    entry: {
        index: './all/js/index.js',
        event: './all/js/event.js',
        eventContent: './all/js/eventContent.js',
        analysis: './all/js/analysis.js',
        inline: './all/js/inline.js',
        platform: './all/js/platform.js',
        teamintorduction: './all/js/teamintorduction.js'
    },
    output: {
        path: path.join(__dirname, './work'),
        filename: 'js/[name].js',
        libraryTarget: 'var'
    },
    module: {
        rules: [{
                test: /\.html/,
                use: [
                    'html-loader',
                ],
                exclude: /^node_modules$/,
            },
            {
                test: /\.js$/,
                use: ['HappyPack/loader?id=js'],
                exclude: /^node_modules$/,
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"]
                }),
                exclude: /^node_modules$/,
            },
            {
                test: /\.(png|svg|jpg|gif|webp)$/,
                use: [{
                        loader: 'url-loader?limit=8192&name=images/[name].[ext]',
                        options: {
                            publicPath: './images'
                        }
                    }

                ],
                exclude: /^node_modules$/,
            },
            {
                test: /\.(woff|woff2|eot|ttc|ttf|otf)$/,
                use: [
                    'file-loader',
                    'url-loader'
                ],
                exclude: /^node_modules$/,
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new clean(['work']),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'chunk',
            filename: 'js/chunk.js',
            chunks: ['index', 'event', 'eventContent', 'analysis', 'inline'],
        }),
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
              output: {
                comments: false
              },
              compress: {
                warnings: false
              }
            }
          }),
        new HappyPack({
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    'presets': ['env'],
                    cacheDirectory: true
                }
            }],
            threadPool: happyThreadPool,
            cache: true,
            verbose: true
        }),
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     'window.$':'jquery',
        //     'window.jQuery':'jquery'
        // }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'body',
            filename: './index.html',
            chunksSortMode: 'dependency',
            chunks: ['chunk','index'],
        }),
        new HtmlWebpackPlugin({
            template: 'event.html',
            inject: 'body',
            filename: './event.html',
            chunksSortMode: 'dependency',
            chunks: ['chunk', 'event'],
        }),
        new HtmlWebpackPlugin({
            template: 'eventContent.html',
            inject: 'body',
            filename: './eventContent.html',
            chunksSortMode: 'dependency',
            chunks: ['chunk', 'eventContent'],
        }),
        new HtmlWebpackPlugin({
            template: 'analysis.html',
            inject: 'body',
            chunksSortMode: 'dependency',
            filename: './analysis.html',
            chunks: ['chunk', 'analysis'],
        }),
        new HtmlWebpackPlugin({
            template: 'inline.html',
            inject: 'body',
            chunksSortMode: 'dependency',
            filename: './inline.html',
            chunks: ['chunk', 'inline'],
        }), 
        new HtmlWebpackPlugin({
            template: 'platform.html',
            inject: 'body',
            chunksSortMode: 'dependency',
            filename: './platform.html',
            chunks: ['chunk', 'platform'],
        }),
        new HtmlWebpackPlugin({
            template: 'teamintorduction.html',
            inject: 'body',
            chunksSortMode: 'dependency',
            filename: './teamintorduction.html',
            chunks: ['chunk', 'teamintorduction'],
        }),
    ],
    //colors: true,
    //watch: true,
    // externals: {
    //     'jquery': 'window.jQuery',
    //   },
    //devtool: 'inline-source-map',
    devServer: {
        contentBase: './work',
        inline: true,
        open: true,
        openPage: 'index.html',
    },
};